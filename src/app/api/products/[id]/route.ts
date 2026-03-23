export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {

  const res = await fetch(`${API_BASE}/api/products/${params.id}`);
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = await res.json();
  return NextResponse.json(data);
}
