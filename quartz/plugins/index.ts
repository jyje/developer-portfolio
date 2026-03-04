import { StaticResources } from "../util/resources"
import { FilePath, FullSlug } from "../util/path"
import { BuildCtx } from "../util/ctx"

export interface LangVariant {
  lang: string
  baseSlug: FullSlug
  isPrimary: boolean
}

export function getStaticResourcesFromPlugins(ctx: BuildCtx) {
  const staticResources: StaticResources = {
    css: [],
    js: [],
    additionalHead: [],
  }

  for (const transformer of [...ctx.cfg.plugins.transformers, ...ctx.cfg.plugins.emitters]) {
    const res = transformer.externalResources ? transformer.externalResources(ctx) : {}
    if (res?.js) {
      staticResources.js.push(...res.js)
    }
    if (res?.css) {
      staticResources.css.push(...res.css)
    }
    if (res?.additionalHead) {
      staticResources.additionalHead.push(...res.additionalHead)
    }
  }

  // if serving locally, listen for rebuilds and reload the page (in head so SPA nav keeps it)
  if (ctx.argv.serve) {
    const wsUrl = ctx.argv.remoteDevHost
      ? `wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`
      : `ws://localhost:${ctx.argv.wsPort}`

    staticResources.js.push({
      loadTime: "beforeDOMReady",
      contentType: "inline",
      spaPreserve: true,
      script: `
        (function() {
          var url = '${wsUrl}';
          function connect() {
            var socket = new WebSocket(url);
            socket.addEventListener('message', function() { document.location.reload(true); });
            socket.addEventListener('close', function() { setTimeout(connect, 1000); });
          }
          connect();
        })();
      `,
    })
  }

  return staticResources
}

export * from "./transformers"
export * from "./filters"
export * from "./emitters"

declare module "vfile" {
  // inserted in processors.ts
  interface DataMap {
    slug: FullSlug
    filePath: FilePath
    relativePath: FilePath
    langVariant?: LangVariant
  }
}
