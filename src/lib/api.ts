const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getPopularSearches: () => fetchAPI('/popular-searches'),
  getTracking: (trackingNo: string) => fetchAPI(`/tracking/${trackingNo}`),
  applyInvoice: (data: any) => fetchAPI('/invoice/apply', { method: 'POST', body: JSON.stringify(data) }),

  getCategories: () => fetchAPI('/categories'),

  getProducts: (params?: { category?: string; search?: string; sort?: string; badge?: string; rating?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/products${query}`);
  },
  getProduct: (id: string) => fetchAPI(`/products/${id}`),
  getProductBySku: (sku: string) => fetchAPI(`/products/sku/${sku}`),
  getProductReviews: (id: string) => fetchAPI(`/products/${id}/reviews`),

  getCart: (userId: string) => fetchAPI(`/cart/${userId}`),
  addToCart: (data: { userId: string; productId: string; quantity: number }) =>
    fetchAPI('/cart', { method: 'POST', body: JSON.stringify(data) }),
  updateCartItem: (id: string, quantity: number) =>
    fetchAPI(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  deleteCartItem: (id: string) =>
    fetchAPI(`/cart/${id}`, { method: 'DELETE' }),

  createOrder: (data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    total: number;
  }) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (userId: string) => fetchAPI(`/orders/${userId}`),

  getAdminStats: () => fetchAPI('/admin/stats'),

  getProductViews: () => fetchAPI('/admin/product-views'),
  incrementProductView: (productId: string) =>
    fetchAPI('/admin/product-views', { method: 'POST', body: JSON.stringify({ productId }) }),

  getActivities: () => fetchAPI('/admin/activities'),
  createActivity: (data: any) =>
    fetchAPI('/admin/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id: string, data: any) =>
    fetchAPI(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id: string) =>
    fetchAPI(`/admin/activities/${id}`, { method: 'DELETE' }),

  getEmailTemplates: () => fetchAPI('/admin/email-templates'),
  updateEmailTemplate: (key: string, data: any) =>
    fetchAPI(`/admin/email-templates/${key}`, { method: 'PUT', body: JSON.stringify(data) }),

  batchUpdateStock: (updates: { productId: string; adjustment: number }[]) =>
    fetchAPI('/admin/batch-stock', { method: 'POST', body: JSON.stringify({ updates }) }),

  exportProductsCSV: () => '/api/admin/products/export',
  exportOrdersCSV: () => '/api/admin/orders/export',

  getSettings: () => fetchAPI('/admin/settings'),

  getBanners: () => fetchAPI('/banners'),

  getAnnouncements: () => fetchAPI('/announcements'),

  register: (data: { email: string; password: string; name: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id: string) => fetchAPI(`/users/${id}`),

  getCustomers: () => fetchAPI('/admin/customers'),
  getCustomer: (id: string) => fetchAPI(`/admin/customers/${id}`),
  getRFMCustomers: () => fetchAPI('/admin/customers/rfm'),

  getInvoices: () => fetchAPI('/admin/invoices'),
  createInvoice: (data: any) => fetchAPI('/admin/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id: string, data: any) =>
    fetchAPI(`/admin/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getStaff: () => fetchAPI('/admin/staff'),
  createStaff: (data: any) => fetchAPI('/admin/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) =>
    fetchAPI(`/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id: string) => fetchAPI(`/admin/staff/${id}`, { method: 'DELETE' }),

  getAuditLogs: (params?: { page?: number; limit?: number; action?: string; target?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/admin/audit-logs${query}`);
  },

  getSalesReport: (params?: { start?: string; end?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/admin/reports/sales${query}`);
  },

  getPopularSearchesAdmin: () => fetchAPI('/admin/popular-searches'),
  updatePopularSearches: (searches: string[]) =>
    fetchAPI('/admin/popular-searches', { method: 'PUT', body: JSON.stringify({ searches }) }),

  getRestockNotifications: () => fetchAPI('/admin/restock-notifications'),

  getShippingCompanies: () => fetchAPI('/admin/shipping-companies'),
  updateShippingCompanies: (companies: any[]) =>
    fetchAPI('/admin/shipping-companies', { method: 'PUT', body: JSON.stringify({ companies }) }),
};
