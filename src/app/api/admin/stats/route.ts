export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
