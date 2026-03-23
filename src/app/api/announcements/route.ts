export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3001/api/announcements');
  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' },
  });
}
