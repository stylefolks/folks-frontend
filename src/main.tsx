import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root')!;
if (container.hasChildNodes()) {
  hydrateRoot(container, (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ));
} else {
  createRoot(container).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
