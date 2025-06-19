import express, { Request, Response } from 'express';
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
    app.get('/mockServiceWorker.js', (_req, res) => {
      res.sendFile(path.join(root, 'public/mockServiceWorker.js'));
    });
    app.use('*', async (req: Request, res: Response) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const { appHtml, head } = await render(url);
        const html = template
          .replace('<!--app-->', appHtml)
          .replace('<!--head-->', head);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        console.error(e);
        res.status(500).end('Internal Server Error');
      }
    });
  } else {
    app.use('/assets', express.static(path.join(root, 'client/assets')));
    app.use('/public', express.static(path.join(root, 'public')));
    app.get('/mockServiceWorker.js', (_req, res) => {
      res.sendFile(path.join(root, 'public/mockServiceWorker.js'));
    });
    const template = fs.readFileSync(path.join(root, 'client/index.html'), 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { render } = require('./entry-server.mjs') as {
      render: (url: string) => Promise<{ appHtml: string; head: string }>;
    };
    app.use('*', async (req: Request, res: Response) => {
      const { appHtml, head } = await render(req.originalUrl);
      const html = template
        .replace('<!--app-->', appHtml)
        .replace('<!--head-->', head);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
