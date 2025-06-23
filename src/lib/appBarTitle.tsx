import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppBarTitleContextValue {
  title: string;
  setTitle: (t: string) => void;
}

const AppBarTitleContext = createContext<AppBarTitleContextValue | null>(null);

export function AppBarTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  return (
    <AppBarTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </AppBarTitleContext.Provider>
  );
}

export function useAppBarTitle() {
  const ctx = useContext(AppBarTitleContext);
  return ctx ? ctx.title : '';
}

export function useSetAppBarTitle(title: string | undefined) {
  const ctx = useContext(AppBarTitleContext);
  useEffect(() => {
    if (!ctx || title === undefined) return;
    ctx.setTitle(title);
    return () => ctx.setTitle('');
  }, [ctx, title]);
}
