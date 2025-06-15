declare module '../dist/server/entry-server.js' {
  export async function render(url: string): Promise<string>;
}
