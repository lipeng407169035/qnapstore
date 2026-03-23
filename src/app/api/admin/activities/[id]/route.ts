export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {

  const body = await request.json();
  const res = await fetch(`${API_BASE}/api/admin/activities/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE}/api/admin/activities/${params.id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data);
}
