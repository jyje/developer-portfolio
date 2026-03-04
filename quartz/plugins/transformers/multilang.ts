/**
 * MultiLang — CSS and client-side JS for language switching.
 *
 * Language block splitting is now handled at build time by the FolderLang transformer
 * (detects en.md / ko.md folder structure) and the ContentPage emitter (merges HAST trees).
 *
 * This plugin only injects:
 *   - CSS: .lang-block visibility rules and .content-lang-switcher styles
 *   - JS: applyLang() — reads ?lang= param / localStorage, shows the correct block,
 *         updates active state on switcher links, and reflects choice in the URL
 */
import { QuartzTransformerPlugin } from "../types"
import { BuildCtx } from "../../util/ctx"
import { visit } from "unist-util-visit"
import type { Root } from "hast"

const LANG_SCRIPT = `
(function(){
  var key = 'quartz-lang';
  function getInitialLang() {
    var m = location.search.match(/[?&]lang=([a-z]{2}(-[A-Z]{2})?)/i);
    return (m && m[1]) ? m[1].toLowerCase() : null;
  }
  function applyLang(lang) {
    lang = lang || 'en';
    try { localStorage.setItem(key, lang); } catch (e) {}
    var blocks = document.querySelectorAll('.lang-block');
    var hasMatch = false;
    blocks.forEach(function(el) {
      var show = el.getAttribute('data-lang') === lang;
      if (show) hasMatch = true;
      el.style.display = show ? 'block' : 'none';
    });
    if (!hasMatch && blocks.length > 0) {
      blocks[0].style.display = 'block';
    }
    document.querySelectorAll('.content-lang-switcher .lang-link').forEach(function(btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    var params = new URLSearchParams(location.search);
    if (lang === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    var qs = params.toString();
    var newUrl = location.pathname + (qs ? '?' + qs : '');
    if (location.pathname + location.search !== newUrl) {
      history.replaceState(null, '', newUrl);
    }
  }
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.content-lang-switcher .lang-link[data-lang]');
    if (btn) { applyLang(btn.getAttribute('data-lang')); }
  });
  document.addEventListener('nav', function() {
    applyLang(getInitialLang() || localStorage.getItem(key) || 'en');
  });
  applyLang(getInitialLang() || localStorage.getItem(key) || 'en');
})();
`

const LANG_BLOCK_CSS = `
.lang-block { display: none; }
.lang-block[data-lang="en"] { display: block; }
.content-lang-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}
.content-lang-switcher .lang-link {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--lightgray);
  color: var(--gray);
  text-decoration: none;
  font-size: 0.82em;
  font-weight: 500;
  transition: color 0.15s, border-color 0.15s;
}
.content-lang-switcher .lang-link:hover {
  color: var(--secondary);
  border-color: var(--secondary);
}
.content-lang-switcher .lang-link.active {
  color: var(--secondary);
  border-color: var(--secondary);
  font-weight: 700;
}
`

export const MultiLang: QuartzTransformerPlugin = () => ({
  name: "MultiLang",
  htmlPlugins(ctx) {
    return [
      () => {
        return (tree: Root, file) => {
          const lv = file.data.langVariant
          if (!lv || lv.isPrimary) return

          visit(tree, "element", (node: any) => {
            if (node.tagName === "a" && node.properties && typeof node.properties.href === "string") {
              const dest = node.properties.href as string
              if (dest.startsWith("http") || dest.startsWith("#") || dest.startsWith("mailto:")) return

              const dataSlug = node.properties["data-slug"] as string
              if (!dataSlug) return

              let base = dataSlug
              if (base.endsWith("/index")) {
                base = base.slice(0, -6)
              }
              if (base === "index") {
                base = ""
              }

              const lang = lv.lang
              const possibleSlugs = [
                base === "" ? "_index/" + lang : base + "/_index/" + lang,
                base === "" ? lang : base + "/" + lang
              ]

              const hasLang = possibleSlugs.some(s => ctx.allSlugs.includes(s as any))
              if (hasLang) {
                if (!dest.includes("lang=" + lang)) {
                  node.properties.href = dest.includes("?")
                    ? dest + "&lang=" + lang
                    : dest + "?lang=" + lang
                }
              }
            }
          })
        }
      },
    ]
  },
  externalResources(_ctx: BuildCtx) {
    return {
      css: [{ content: LANG_BLOCK_CSS.trim(), inline: true, spaPreserve: true }],
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          spaPreserve: true,
          script: LANG_SCRIPT,
        },
      ],
    }
  },
})
