export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const url = category ? `http://localhost:3001/api/news?category=${category}` : 'http://localhost:3001/api/news';
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
