import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MetaProvider } from './lib/meta';

async function start() {
  const env = (import.meta as any).env;
  const mocking = env.PUBLIC_API_MOCKING ?? (env.DEV ? 'enabled' : 'disabled');
  if (mocking === 'enabled') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    });
  }

  const container = document.getElementById('root')!;
  const hasMarkup =
    container.innerHTML.trim() !== '' &&
    !container.innerHTML.includes('<!--app-->');

  if (hasMarkup) {
    hydrateRoot(
      container,
      <BrowserRouter>
        <MetaProvider>
          <App />
        </MetaProvider>
      </BrowserRouter>,
    );
  } else {
    createRoot(container).render(
      <BrowserRouter>
        <MetaProvider>
          <App />
        </MetaProvider>
      </BrowserRouter>,
    );
  }
}

start();
