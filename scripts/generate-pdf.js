#!/usr/bin/env node
/**
 * Generate PDFs from built Quartz site using Playwright.
 * Run after `npx quartz build`. Set PDF_OUTPUT_DIR to override output (default: public/assets).
 */

import { chromium } from "playwright"
import { createServer } from "http"
import handler from "serve-handler"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import yaml from "js-yaml"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const publicDir = path.join(rootDir, "public")
const outputDir = process.env.PDF_OUTPUT_DIR ? path.resolve(process.env.PDF_OUTPUT_DIR) : path.join(publicDir, "assets")

const configPath = path.join(rootDir, "pdf-config.yml")
let config

try {
  config = yaml.load(fs.readFileSync(configPath, "utf8"))
} catch (e) {
  console.error("Failed to load pdf-config.yml:", e.message)
  process.exit(1)
}

const { targets, pdf_options: pdfOptions, viewport, timeout: timeouts, server } = config
const port = server?.port ?? 8080

// Ensure .html path for Quartz (emits .html files)
function toUrlPath(targetPath) {
  const p = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath
  return p.endsWith(".html") ? `/${p}` : `/${p}.html`
}

async function serveStatic() {
  return new Promise((resolve, reject) => {
    const s = createServer((req, res) => {
      handler(req, res, { public: publicDir, cleanUrls: true })
    })
    s.listen(port, "127.0.0.1", () => resolve(s))
    s.on("error", reject)
  })
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true })

  const serverInstance = await serveStatic()
  console.log(`Serving ${publicDir} at http://127.0.0.1:${port}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: viewport ?? { width: 1200, height: 800 },
    deviceScaleFactor: viewport?.deviceScaleFactor ?? 2,
  })

  const page = await context.newPage()

  for (const target of targets) {
    const targetPath = target.path
    const output = target.output
    const lang = target.lang
    const url = `http://127.0.0.1:${port}${toUrlPath(targetPath)}${lang ? `?lang=${lang}` : ""}`
    console.log(`Generating ${output} from ${url}`)
    try {
      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: timeouts?.navigation ?? 30000,
      })
      if (lang) await page.waitForTimeout(500)
      await page.waitForTimeout(timeouts?.render ?? 2000)
      const outPath = path.join(outputDir, output)
      await page.pdf({
        path: outPath,
        ...pdfOptions,
      })
      console.log(`  -> ${outPath}`)
    } catch (e) {
      console.error(`  Failed: ${e.message}`)
    }
  }

  await browser.close()
  serverInstance.close()
  console.log("PDF generation done.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
