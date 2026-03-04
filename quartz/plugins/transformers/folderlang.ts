/**
 * FolderLang transformer.
 *
 * Two supported conventions for multilingual content:
 *
 * 1. Folder article (_index pattern) — the folder IS the page:
 *      content/{slug}/_index/en.md  → langVariant { lang: "en", baseSlug: "{slug}" }
 *      content/_index/en.md         → langVariant { lang: "en", baseSlug: "index" }  (root)
 *
 * 2. Leaf post — the folder is the slug:
 *      content/{slug}/en.md  → langVariant { lang: "en", baseSlug: "{slug}" }
 *
 * In both cases the ContentPage emitter merges all variants of the same
 * baseSlug into a single HTML page with lang-block wrappers and a language switcher.
 *
 * The _index directory is invisible to the Explorer and folder listings.
 */
import type { Root } from "hast"
import { QuartzTransformerPlugin } from "../types"
import { FullSlug } from "../../util/path"

export const LANG_CODES = new Set(["en", "ko", "ja", "zh", "fr", "de", "es", "pt", "ru", "ar"])

export const LANG_LABELS: Record<string, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  ar: "العربية",
}

export const FolderLang: QuartzTransformerPlugin = () => ({
  name: "FolderLang",
  htmlPlugins() {
    return [
      () => (_tree: Root, vfile) => {
        const slug = vfile.data.slug
        if (!slug) return

        const parts = slug.split("/")
        const last = parts[parts.length - 1]

        if (LANG_CODES.has(last) && parts.length >= 2) {
          let baseParts = parts.slice(0, -1)

          // _index pattern: strip the _index segment to get the real page slug.
          // e.g. "profile/portfolio/_index/en" → baseSlug "profile/portfolio"
          //      "_index/en"                   → baseSlug "index" (Quartz root)
          if (baseParts[baseParts.length - 1] === "_index") {
            baseParts = baseParts.slice(0, -1)
            if (baseParts.length === 0) {
              baseParts = ["index"]
            }
          }

          const baseSlug = baseParts.join("/") as FullSlug
          vfile.data.langVariant = {
            lang: last,
            baseSlug,
            isPrimary: last === "en",
          }
        }
      },
    ]
  },
})
