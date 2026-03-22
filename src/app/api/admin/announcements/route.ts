export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3001/api/admin/announcements');
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch('http://localhost:3001/api/admin/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
