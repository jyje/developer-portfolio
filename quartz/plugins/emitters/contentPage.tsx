import path from "path"
import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { DynamicPageBody } from "../../components"
import { styleText } from "util"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { Node } from "unist"
import { StaticResources } from "../../util/resources"
import { QuartzPluginData, ProcessedContent } from "../vfile"
import type { Root, Element, ElementContent, Text } from "hast"
import { LANG_LABELS } from "../transformers/folderlang"

async function processContent(
  ctx: BuildCtx,
  tree: Node,
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const slug = fileData.slug!
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  const content = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({
    ctx,
    content,
    slug,
    ext: ".html",
  })
}

/**
 * Wraps each language's HAST children in a lang-block div and prepends
 * a language switcher when more than one language is present.
 */
function slugToAbsPath(baseSlug: string): string {
  if (baseSlug === "index") return "/"
  if (baseSlug.endsWith("/index")) return `/${baseSlug.slice(0, -6)}/`
  return `/${baseSlug}`
}

function buildMergedTree(
  variants: Array<{ lang: string; tree: Root }>,
  baseSlug: string,
): Root {
  const defaultLang = variants[0].lang

  const langBlocks: Element[] = variants.map(({ lang, tree }): Element => ({
    type: "element",
    tagName: "div",
    properties: { "data-lang": lang, className: ["lang-block"] },
    children: tree.children as ElementContent[],
  }))

  if (variants.length <= 1) {
    return { type: "root", children: langBlocks }
  }

  const basePath = slugToAbsPath(baseSlug)
  const switcherLinks: Element[] = variants.map(({ lang }): Element => ({
    type: "element",
    tagName: "a",
    properties: {
      "data-lang": lang,
      className: ["lang-link", ...(lang === defaultLang ? ["active"] : [])],
      href: lang === "en" ? basePath : `${basePath}?lang=${lang}`,
    },
    children: [{ type: "text", value: LANG_LABELS[lang] ?? lang } as Text],
  }))

  const switcher: Element = {
    type: "element",
    tagName: "div",
    properties: { className: ["content-lang-switcher"], "aria-label": "Language selector" },
    children: switcherLinks,
  }

  return { type: "root", children: [switcher, ...langBlocks] }
}

type LangGroupMap = Map<string, Array<{ lang: string; tree: Root; fileData: QuartzPluginData }>>

/**
 * Splits content into lang-variant groups (keyed by baseSlug) and regular files.
 * Also builds allFiles suitable for component rendering:
 *   - non-primary lang variants are excluded
 *   - primary variants have their slug overridden to baseSlug
 */
function partitionContent(content: ProcessedContent[]): {
  groups: LangGroupMap
  regular: ProcessedContent[]
  allFilesForComponents: QuartzPluginData[]
} {
  const groups: LangGroupMap = new Map()
  const regular: ProcessedContent[] = []
  const componentFiles: QuartzPluginData[] = []

  for (const [tree, file] of content) {
    const lv = file.data.langVariant
    if (lv) {
      const arr = groups.get(lv.baseSlug) ?? []
      arr.push({ lang: lv.lang, tree: tree as Root, fileData: file.data })
      groups.set(lv.baseSlug, arr)

      if (lv.isPrimary) {
        componentFiles.push({ ...file.data, slug: lv.baseSlug })
      }
    } else {
      regular.push([tree, file])
      componentFiles.push(file.data)
    }
  }

  return { groups, regular, allFilesForComponents: componentFiles }
}

async function* emitLangGroups(
  ctx: BuildCtx,
  groups: LangGroupMap,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
  containsIndex: { value: boolean },
): AsyncGenerator<string> {
  for (const [baseSlug, variants] of groups) {
    // en first, then alphabetical
    variants.sort((a, b) => {
      if (a.lang === "en") return -1
      if (b.lang === "en") return 1
      return a.lang.localeCompare(b.lang)
    })

    if (baseSlug === "index") containsIndex.value = true

    const mergedTree = buildMergedTree(
      variants.map(({ lang, tree }) => ({ lang, tree })),
      baseSlug,
    )

    // Use primary variant's fileData (first after sort) but override slug to baseSlug
    const primaryFileData: QuartzPluginData = {
      ...variants[0].fileData,
      slug: baseSlug as FullSlug,
    }

    yield processContent(ctx, mergedTree, primaryFileData, allFiles, opts, resources)
  }
}

export const ContentPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: DynamicPageBody(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "ContentPage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const containsIndex = { value: false }
      const { groups, regular, allFilesForComponents } = partitionContent(content)

      yield* emitLangGroups(ctx, groups, allFilesForComponents, opts, resources, containsIndex)

      for (const [tree, file] of regular) {
        const slug = file.data.slug!
        if (slug === "index") containsIndex.value = true
        if (slug.endsWith("/index") || slug.startsWith("tags/")) continue
        yield processContent(ctx, tree, file.data, allFilesForComponents, opts, resources)
      }

      if (!containsIndex.value) {
        console.log(
          styleText(
            "yellow",
            `\nWarning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder (\`${path.join(ctx.argv.directory, "index.md")} does not exist\`). This may cause errors when deploying.`,
          ),
        )
      }
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const { groups, regular, allFilesForComponents } = partitionContent(content)

      const changedBaseSlugs = new Set<string>()
      const changedRegularSlugs = new Set<string>()

      for (const ev of changeEvents) {
        if (!ev.file) continue
        if (ev.type !== "add" && ev.type !== "change") continue
        const lv = ev.file.data.langVariant
        if (lv) {
          changedBaseSlugs.add(lv.baseSlug)
        } else {
          changedRegularSlugs.add(ev.file.data.slug!)
        }
      }

      const changedGroups: LangGroupMap = new Map()
      for (const [baseSlug, variants] of groups) {
        if (changedBaseSlugs.has(baseSlug)) {
          changedGroups.set(baseSlug, variants)
        }
      }
      yield* emitLangGroups(
        ctx,
        changedGroups,
        allFilesForComponents,
        opts,
        resources,
        { value: false },
      )

      for (const [tree, file] of regular) {
        const slug = file.data.slug!
        if (!changedRegularSlugs.has(slug)) continue
        if (slug.endsWith("/index") || slug.startsWith("tags/")) continue
        yield processContent(ctx, tree, file.data, allFilesForComponents, opts, resources)
      }
    },
  }
}
