export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { key: string } }) {
  const body = await request.json();
  const res = await fetch(`http://localhost:3001/api/admin/email-templates/${params.key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
