import React, { createContext, useContext, useEffect } from 'react';

export interface MetaTag {
  name: string;
  content: string;
}

export interface MetaState {
  title?: string;
  metas: MetaTag[];
}

export function createMetaState(): MetaState {
  return { title: undefined, metas: [] };
}

const MetaContext = createContext<MetaState | null>(null);

export function MetaProvider({ children, context }: { children: React.ReactNode; context?: MetaState }) {
  const value = context || createMetaState();
  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
}

export function useMeta(meta: Partial<MetaState>) {
  const ctx = useContext(MetaContext);
  if (ctx) {
    if (meta.title) ctx.title = meta.title;
    if (meta.metas) ctx.metas.push(...meta.metas);
  }

  useEffect(() => {
    if (meta.title) document.title = meta.title;
    if (meta.metas) {
      for (const { name, content } of meta.metas) {
        let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      }
    }
  }, [meta.title, JSON.stringify(meta.metas)]);
}
