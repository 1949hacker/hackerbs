import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>© {year} hackerbs Knowledge Base · Engineering Knowledge System</p>
        <p>
          Built on{" "}
          <a href="https://quartz.jzhao.xyz/" target="_blank" rel="noreferrer">
            Quartz v{version}
          </a>
        </p>
        <ul>
          <li><a href="https://github.com/1949hacker/hackerbs">GitHub</a></li>
          <li><a href="/index.xml">RSS</a></li>
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
