# Agent instructions

## Debugging and tooling

- **Use Node 24 only for builds and debugging.** Run `nvm use 24` (or equivalent) before `pnpm run build` or `pnpm run serve`. Do not change `engines.node` to accommodate other versions; keep it `>=24`.
- **Markdown changes:** Every `pnpm run build` re-reads all markdown; no cache. Edit content files and rebuild to see changes. For live reload during development, use `pnpm run serve` if it supports watch.

## Multi-language folder structure

All multi-language pages use a **folder + language file** convention:

```
content/
  {page}/
    en.md     ← English (required, default language)
    ko.md     ← Korean
    ja.md     ← Japanese (optional; add when needed)
    ...
```

**Rules:**
- Each folder represents one page. The folder name determines the URL slug.
  - `content/index/en.md` → `index.html` → URL `/`
  - `content/profile/resume/en.md` → `profile/resume.html` → URL `/profile/resume`
- **English (`en.md`) is mandatory** for every multi-language page and is shown by default.
- Other language files (`ko.md`, `ja.md`, …) are optional. Only detected languages are shown in the switcher.
- Frontmatter `title:` and `description:` should be translated per language file.
- The first heading in every language file must be **H2** (H1 = page title from frontmatter).
- Do **not** use `<!-- lang: ko -->` comment blocks inside a single file; use the folder structure instead.

**How it works at build time:**
1. `FolderLang` transformer detects files named with a 2-letter ISO code (e.g. `en`, `ko`) and sets `vfile.data.langVariant`.
2. `ContentPage` emitter groups all variants by `baseSlug`, merges HAST trees into lang-blocks, and emits **one** HTML file per slug.
3. `MultiLang` transformer injects CSS + JS for client-side language switching (`?lang=ko`).

**Supported language codes:** `en ko ja zh fr de es pt ru ar`

## Markdown–component 1:1 policy

- **All page content and UI shown to the user must come from Markdown.** Do not add components that render content not defined in Markdown (e.g. hardcoded nav, titles, links).
- **Display and Markdown must match 1:1.** What appears on the site for a page must be derivable from that page's Markdown (and shared layout). No "special" pages that use a different component and inject extra content.
- **Special or layout-only components** (e.g. sidebar, search, theme toggle, language switcher) that are not literally "content from this file" must be:
  - Documented here or in the code so it's clear they are layout/global, and
  - If they affect what the user sees in a non-obvious way, mentioned in the repo (e.g. in this file or in the theme docs) so the content author knows what is Markdown vs. what is added by the theme.

## Rules for components

1. **Content components**
   Only render data that comes from the current page's Markdown (and its frontmatter). No hardcoded body text, nav items, or links that are not in the Markdown.

2. **Layout/global components**
   Use for structure and site-wide behavior (header, footer, sidebar, search, language switcher, etc.). Do not use them to inject page-specific content that should live in Markdown.

3. **Adding or changing components**
   - Prefer expressing new "content" (titles, links, lists, copy) in Markdown.
   - If a new component is needed, decide whether it is "content" (must be 1:1 with Markdown) or "layout/global" (document it as above).
   - Do not introduce page types that render a fixed template (e.g. a dedicated "landing" component with its own nav) unless that template is clearly documented and the content author can see what is Markdown vs. component-driven.

4. **Index and list pages**
   The index page and folder/tag list pages are normal content: they use the same content pipeline and the same `Content` component as other pages. Their text and links must come from the corresponding Markdown, not from a special component.

## Summary

- **Content on the page = what's in the Markdown (1:1).**
- **Multi-language = folder per page, `en.md` required, other langs optional.**
- **Special/layout components = documented; no hidden content injection.**
