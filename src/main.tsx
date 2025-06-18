import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  } else {
    createRoot(container).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  }
}

start();
