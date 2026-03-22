export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get('sku');
  const url = sku ? `http://localhost:3001/api/downloads?sku=${sku}` : 'http://localhost:3001/api/downloads';
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
