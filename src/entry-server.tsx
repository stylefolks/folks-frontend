import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { MetaProvider, createMetaState } from './lib/meta';

export function render(url: string) {
  const meta = createMetaState();
  const html = renderToString(
    <StaticRouter location={url}>
      <MetaProvider context={meta}>
        <App />
      </MetaProvider>
    </StaticRouter>
  );
  return { html, meta };
}
