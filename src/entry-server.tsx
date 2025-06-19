import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import App from './App';

export function render(url: string) {
  const helmetContext: FilledContext = {} as FilledContext;
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  const head = helmet
    ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
    : '';
  return { appHtml, head };
}
