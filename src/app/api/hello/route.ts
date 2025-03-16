export async function GET(request: Request) {
  return new Response(
    `Hello, Next.js! From ${request.headers.get("user-agent")}`
  );
}
