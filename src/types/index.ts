export interface Product {
  id: string;
  sku: string;
  name: string;
  series: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  description: string;
  specs: string | Record<string, string | number>;
  badges: string[];
  color: string;
  rating: number;
  reviews: number;
  stock: number;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  userId: string | null;
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  level?: string;
  points?: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  desc: string;
  sort: number;
  active: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  link: string;
  gradient: string;
  btnText?: string;
  image?: string;
  imageSize?: 'cover' | 'contain' | 'left' | 'right';
}

export interface Announcement {
  id: number;
  text: string;
  active: boolean;
  priority?: number;
  sort?: number;
  startDate?: string;
  endDate?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface ImageFile {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  registeredAt: string;
  level: string;
  points: number;
  orders?: any[];
  rfmScore?: number;
  rfmSegment?: string;
  tag?: string;
  daysSinceLastOrder?: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  orderNo: string;
  type: string;
  title: string;
  taxNo: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface AuditLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  target: string;
  targetName: string;
  createdAt: string;
}

export interface ShippingCompany {
  id: string;
  name: string;
  code: string;
  trackingUrl: string;
}

export interface TrackingInfo {
  trackingNo: string;
  status: string;
  events: { time: string; location: string; description: string }[];
}

export interface RestockNotification {
  id: string;
  sku: string;
  name: string;
  stock: number;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueByDay: [string, number][];
  ordersByDay: [string, number][];
  topProducts: { id: string; name: string; revenue: number; quantity: number }[];
  revenueByCategory: Record<string, number>;
  revenueByPayment: Record<string, number>;
}
