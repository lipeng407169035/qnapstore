'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const labelMap: Record<string, string> = {
  admin: '管理后台',
  dashboard: '控制台',
  reports: '销售报表',
  products: '商品管理',
  'products/import': 'CSV 导入',
  categories: '分类管理',
  images: '图片管理',
  downloads: '下载管理',
  seo: 'SEO 设置',
  orders: '订单管理',
  'batch-ship': '批量发货',
  invoices: '发票管理',
  coupons: '优惠券',
  activities: '限时特卖',
  'full-reductions': '满减活动',
  banners: '轮播图',
  'popular-searches': '热门搜索',
  customers: '客户管理',
  users: '用户管理',
  news: '新闻管理',
  reviews: '评论管理',
  faq: 'FAQ 管理',
  announcements: '公告管理',
  'email-templates': '邮件模板',
  'support-tickets': '客服工单',
  'warranty-submissions': '售后申请',
  restock: '补货预警',
  'rma-policy': '退换政策',
  'partnership-applications': '合作申请',
  settings: '基础设置',
  shipping: '物流管理',
  'customer-service-settings': '客服设置',
  staff: '员工管理',
  'audit-logs': '操作日志',
  'product-views': '浏览统计',
  login: '登录',
  rfm: 'RFM 分析',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || seg;
    return { href, label };
  });

  return (
    <nav aria-label="面包屑" className="flex items-center gap-1.5 text-sm mb-4">
      <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
        首页
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          {i === crumbs.length - 1 ? (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
