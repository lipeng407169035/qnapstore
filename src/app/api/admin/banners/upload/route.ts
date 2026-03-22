export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const formData = await req.formData();
  const res = await fetch('http://localhost:3001/api/admin/banners/upload', {
    method: 'POST',
    body: formData,
  });
  return Response.json(await res.json());
}
