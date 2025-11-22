export async function GET() {
  const endpoint = process.env.SERVICE_ENDPOINT || null;
  return new Response(JSON.stringify({ SERVICE_ENDPOINT: endpoint }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
