export const dynamic = 'force-dynamic';
export async function GET() {
  const res = await fetch('http://localhost:3001/api/faq', { cache: 'no-store' });
  return Response.json(await res.json());
}
