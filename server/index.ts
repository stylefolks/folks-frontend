import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const root = path.resolve(__dirname, '..');

  if (!isProd) {
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
    app.use('/public', express.static(path.join(root, 'public')));
    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const appHtml = await render(url);
        const html = template.replace(`<!--app-->`, appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        console.error(e);
        res.status(500).end('Internal Server Error');
      }
    });
  } else {
    app.use('/assets', express.static(path.join(root, 'dist/client/assets')));
    app.use('/public', express.static(path.join(root, 'public')));
    const template = fs.readFileSync(path.join(root, 'dist/client/index.html'), 'utf-8');
    const { render } = await import('../dist/server/entry-server.js');
    app.use('*', async (req, res) => {
      const appHtml = await render(req.originalUrl);
      const html = template.replace('<!--app-->', appHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
