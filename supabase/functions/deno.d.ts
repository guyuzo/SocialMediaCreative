// Shim mínimo só pra silenciar o TS server do editor (que roda o tsconfig do
// app React/Node) dentro de supabase/functions — que na verdade roda em Deno,
// fora dos projetos tsconfig.app.json/tsconfig.node.json (não entra no build).
declare const Deno: {
  serve(handler: (req: Request) => Response | Promise<Response>): void
  env: { get(key: string): string | undefined }
}
