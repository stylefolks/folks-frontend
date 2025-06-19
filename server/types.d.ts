declare module './entry-server.mjs' {
  export function render(url: string): Promise<{ html: string; meta: { title?: string; metas: { name: string; content: string }[] } }>
}