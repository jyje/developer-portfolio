import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { toHtml } from "hast-util-to-html"
import type { Root } from "hast"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  let content: ComponentChildren = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  if (content == null && tree) {
    try {
      const html = toHtml(tree as Root, { allowDangerousHtml: true })
      content = <div class="content-html" dangerouslySetInnerHTML={{ __html: html }} />
    } catch {
      content = null
    }
  }
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
