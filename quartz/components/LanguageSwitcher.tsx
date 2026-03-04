import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LanguageSwitcher: QuartzComponent = () => {
  return (
    <div class="language-switcher">
      <a href="#" data-lang="en" class="language-switcher-link" aria-label="English">
        🇬🇧 English
      </a>
      <span class="language-switcher-sep"> · </span>
      <a href="#" data-lang="ko" class="language-switcher-link" aria-label="한국어">
        🇰🇷 한국어
      </a>
    </div>
  )
}

LanguageSwitcher.css = `
.language-switcher {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}
.language-switcher-link {
  color: var(--secondary);
  text-decoration: none;
}
.language-switcher-link:hover {
  text-decoration: underline;
}
.language-switcher-sep {
  color: var(--gray);
  pointer-events: none;
}
`

export default (() => LanguageSwitcher) satisfies QuartzComponentConstructor
