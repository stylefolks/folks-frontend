'use client';
import { useEffect } from 'react';

export default function MswInit() {
  useEffect(() => {
    const enabled =
      typeof window === 'undefined'
        ? process.env.PUBLIC_API_MOCKING
        : (import.meta as any).env.PUBLIC_API_MOCKING;
    if ((enabled ?? 'enabled') === 'enabled') {
      import('./browser').then(({ worker }) => {
        worker.start({
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
          onUnhandledRequest: 'bypass',
        });
      });
    }
  }, []);
  return null;
}
