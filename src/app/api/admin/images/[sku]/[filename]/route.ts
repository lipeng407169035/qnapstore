export const dynamic = 'force-dynamic';
export async function DELETE(req: Request, { params }: { params: { sku: string; filename: string } }) {
  const res = await fetch(`http://localhost:3001/api/admin/images/${params.sku}/${params.filename}`, {
    method: 'DELETE',
  });
  return Response.json(await res.json());
}
