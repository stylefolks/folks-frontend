declare module '../dist/server/entry-server.js' {
  export function render(url: string): Promise<{ appHtml: string; head: string }>;
}
