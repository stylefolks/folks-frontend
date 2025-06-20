import express, { Request, Response } from 'express'
import path from 'path';
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs'
import { createServer as createViteServer, ViteDevServer } from 'vite'

async function startServer() {
  const app = express()
  const isProd = process.env.NODE_ENV === 'production'
  const root = path.resolve(__dirname, '..')
  let vite: ViteDevServer | undefined

  if (!isProd) {
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    })
    // Vite 미들웨어를 가장 먼저 등록
    app.use(vite.middlewares)
  } else {
    app.use('/assets', express.static(path.join(root, 'client/assets')))
    app.use('/public', express.static(path.join(root, 'public')))
  }

  app.get('/mockServiceWorker.js', (_req, res) => {
    res.sendFile(path.join(root, 'public/mockServiceWorker.js'))
  })

  app.use('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl
      let template: string
      let render: (url: string) => Promise<any>
      let cssLinks = ''

      if (!isProd && vite) {
        template = fs.readFileSync(path.join(root, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        // 개발서버에서는 Vite가 CSS를 <style>로 자동 삽입하므로 cssLinks 필요 없음
        // cssLinks = ''
      } else {
        template = fs.readFileSync(
          path.join(root, 'client/index.html'),
          'utf-8'
        )
        
        // entry-server.js is an ES module, so use dynamic import instead of require
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error no type definitions for js module
        render = (await import('./entry-server.js')).render

        // manifest.json에서 CSS 파일 추출
        const manifestPath = path.join(root, 'client/manifest.json')
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          const entry = manifest['index.html']
          if (entry && entry['css']) {
            cssLinks = entry['css']
              .map((href: string) => `<link rel="stylesheet" href="${href}">`)
              .join('')
          }
        }
      }

      const { html: appHtml, meta } = await render(req.originalUrl);
      const head = [
        meta.title ? `<title>${meta.title}</title>` : '',
        ...meta.metas.map((m: { name: string; content: string }) => `<meta name="${m.name}" content="${m.content}">`),
      ].join('\n');
      const html = template
        .replace('<!--head-->', `${head}${cssLinks ? `\n${cssLinks}` : ''}`)
        .replace('<!--app-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e)
      }
      console.error(e)
      res.status(500).end('Internal Server Error')
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

startServer()
