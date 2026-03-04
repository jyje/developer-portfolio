import Content from "./Content"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const DynamicPageBody: QuartzComponent = (props: QuartzComponentProps) => {
  const isResume = props.fileData.frontmatter?.resume === true
  const isPortfolio = props.fileData.frontmatter?.portfolio === true
  const wrapperClass = isResume ? "page-body resume-view" : isPortfolio ? "page-body portfolio-view" : "page-body"
  return (
    <div class={wrapperClass}>
      <Content {...props} />
    </div>
  )
}

export default (() => DynamicPageBody) satisfies QuartzComponentConstructor
