import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

async function start() {
  const mocking = (import.meta as any).env.PUBLIC_API_MOCKING ?? 'enabled';
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
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>,
    );
  } else {
    createRoot(container).render(
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>,
    );
  }
}

start();
