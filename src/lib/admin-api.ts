const ADMIN_AUTH = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123'}`);

export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  if (typeof window === 'undefined') {
    throw new Error('adminFetch can only be used in browser context');
  }
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Basic ${ADMIN_AUTH}`,
    },
  });
}
