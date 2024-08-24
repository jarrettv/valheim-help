import type { APIRoute } from "astro"
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({
      request: await request.json()
    })
  )
}