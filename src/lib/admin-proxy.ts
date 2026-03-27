import { API_BASE } from '@/lib/api-base';
import { NextRequest } from 'next/server';

const ADMIN_AUTH = Buffer.from(`${process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123'}`).toString('base64');

export async function proxyToAdmin(req: NextRequest, path: string, method?: string): Promise<Response> {
  const fetchOptions: RequestInit = {
    headers: {
      'Authorization': `Basic ${ADMIN_AUTH}`,
      'Content-Type': 'application/json',
    },
  };
  if (method && method !== 'GET') {
    fetchOptions.method = method;
    const body = await req.text();
    fetchOptions.body = body;
  }
  return fetch(`${API_BASE}${path}`, fetchOptions);
}

export function adminAuthHeader(): string {
  return `Basic ${ADMIN_AUTH}`;
}
