export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3001/api/admin/orders');
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id } = body;
  const res = await fetch(`http://localhost:3001/api/admin/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
