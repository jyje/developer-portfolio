# developer-portfolio

Personal portfolio and digital garden powered by [Quartz 4](https://quartz.jzhao.xyz/), with Hydejack-style landing, sidebar profile, and PDF export for resume/portfolio.

**Test site**: [me.jyje.online](https://me.jyje.online)

## Features

- **Quartz 4** — Obsidian-compatible markdown, full-text search, graph view, tags
- **Landing page** — Cover-style home with nav cards (Profile, Posts, Tags)
- **Profile sidebar** — Name, title, LinkedIn/GitHub links
- **Language switcher** — EN / KO via preference (no language in URL); one file per page with `<!-- lang: ko -->` blocks
- **Resume & portfolio** — `content/profile/resume.md`, `content/profile/portfolio.md` with print-friendly styling
- **PDF generation** — Playwright-based; en/ko PDFs per page via `?lang=` in CI, served from `/assets/`

## Development

- **Prerequisites**: Node.js 24+, pnpm 10+
  - **Why Node 24**: Development and debugging are done on Node 24. CI (e.g. GitHub Actions) should use the same version for consistent builds. The project runs on Node 24 without issues.
- **Install**: `pnpm install`
- **Build**: `pnpm run build`
- **Preview**: `pnpm run serve` → http://localhost:8080
- **Generate PDFs** (after build): `pnpm exec playwright install chromium` then `pnpm run generate-pdf`

PDFs are written to `public/assets/` by default; set `PDF_OUTPUT_DIR` to override (e.g. in CI: `PDF_OUTPUT_DIR=${{ github.workspace }}/public/assets`).

## Deployment (GitHub Pages)

1. Push to `main` — the **Deploy to GitHub Pages** workflow builds the site, generates PDFs, and deploys.
2. In the repo **Settings → Pages**: Source = **GitHub Actions**, and set **Custom domain** to `me.jyje.online` (optional).
3. At your DNS provider, add a **CNAME** record: `me.jyje.online` → `username.github.io` (or your Pages host).

The build already emits a `CNAME` file with `me.jyje.online` when `baseUrl` is set in `quartz.config.ts`.

## Content structure

Single URL per page; one markdown file can contain multiple languages separated by HTML comment:

```
content/
  index.md              # Landing (EN + KO in one file)
  profile/
    resume.md           # Resume (use <!-- lang: ko --> for Korean block)
    portfolio.md
  posts/
    index.md
```

**Multilang format**: First block = English. Start a Korean block with `<!-- lang: ko -->` on its own line; content below is wrapped in `[data-lang="ko"]` and toggled by the language switcher (and `?lang=ko` for PDF).

---

# Quartz v4

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 [Documentation](https://quartz.jzhao.xyz/) · [Discord](https://discord.gg/cRFFHYye7t)
