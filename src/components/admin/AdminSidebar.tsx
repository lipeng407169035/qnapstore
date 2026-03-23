'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  FileUp,
  ShoppingCart,
  Truck,
  Star,
  Zap,
  BadgeDollarSign,
  Image,
  Megaphone,
  Search,
  Ticket,
  Mail,
  Users,
  TrendingUp,
  Shield,
  MessageSquare,
  Download,
  HelpCircle,
  RefreshCw,
  Phone,
  Receipt,
  UserCog,
  FileText,
  AlertTriangle,
  Settings,
  Globe,
  Newspaper,
  UserPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    title: '数据概览',
    items: [
      { href: '/admin/dashboard', label: '控制台', icon: LayoutDashboard },
      { href: '/admin/reports', label: '销售报表', icon: BarChart3 },
      { href: '/admin/product-views', label: '浏览统计', icon: TrendingUp },
    ],
  },
  {
    title: '商品管理',
    items: [
      { href: '/admin/products', label: '商品列表', icon: Package },
      { href: '/admin/products/import', label: 'CSV 导入', icon: FileUp },
      { href: '/admin/categories', label: '分类管理', icon: Globe },
      { href: '/admin/images', label: '图片管理', icon: Image },
      { href: '/admin/downloads', label: '下载管理', icon: Download },
      { href: '/admin/seo', label: 'SEO 设置', icon: Search },
    ],
  },
  {
    title: '订单管理',
    items: [
      { href: '/admin/orders', label: '订单列表', icon: ShoppingCart },
      { href: '/admin/batch-ship', label: '批量发货', icon: Truck },
      { href: '/admin/invoices', label: '发票管理', icon: Receipt },
    ],
  },
  {
    title: '营销管理',
    items: [
      { href: '/admin/coupons', label: '优惠券', icon: Ticket },
      { href: '/admin/activities', label: '限时特卖', icon: Zap },
      { href: '/admin/full-reductions', label: '满减活动', icon: BadgeDollarSign },
      { href: '/admin/banners', label: '轮播图', icon: Megaphone },
      { href: '/admin/popular-searches', label: '热门搜索', icon: Search },
    ],
  },
  {
    title: '客户管理',
    items: [
      { href: '/admin/customers', label: '客户列表', icon: Users },
      { href: '/admin/customers/rfm', label: 'RFM 分析', icon: TrendingUp },
      { href: '/admin/users', label: '用户管理', icon: UserPlus },
    ],
  },
  {
    title: '内容管理',
    items: [
      { href: '/admin/news', label: '新闻管理', icon: Newspaper },
      { href: '/admin/reviews', label: '评论管理', icon: Star },
      { href: '/admin/faq', label: 'FAQ 管理', icon: HelpCircle },
      { href: '/admin/announcements', label: '公告管理', icon: Megaphone },
      { href: '/admin/email-templates', label: '邮件模板', icon: Mail },
    ],
  },
  {
    title: '服务管理',
    items: [
      { href: '/admin/support-tickets', label: '客服工单', icon: MessageSquare },
      { href: '/admin/warranty-submissions', label: '售后申请', icon: Shield },
      { href: '/admin/restock', label: '补货预警', icon: AlertTriangle },
      { href: '/admin/rma-policy', label: '退换政策', icon: RefreshCw },
      { href: '/admin/partnership-applications', label: '合作申请', icon: Users },
    ],
  },
  {
    title: '系统设置',
    items: [
      { href: '/admin/settings', label: '基础设置', icon: Settings },
      { href: '/admin/shipping', label: '物流管理', icon: Truck },
      { href: '/admin/customer-service-settings', label: '客服设置', icon: Phone },
      { href: '/admin/staff', label: '员工管理', icon: UserCog },
      { href: '/admin/audit-logs', label: '操作日志', icon: FileText },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-slate-700/50">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            Q
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">QNAP 管理后台</div>
            <div className="text-slate-400 text-xs">QNAP Store</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-blue text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'opacity-90' : 'opacity-70'}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          查看商城
        </Link>
      </div>
    </aside>
  );
}
