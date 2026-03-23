'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/admin/dashboard', label: '仪表板', icon: '📊' },
  { href: '/admin/reports', label: '销售报表', icon: '📈' },
  { href: '/admin/products', label: '商品管理', icon: '📦' },
  { href: '/admin/products/import', label: 'CSV导入', icon: '📤' },
  { href: '/admin/orders', label: '订单管理', icon: '🛒' },
  { href: '/admin/batch-ship', label: '批量发货', icon: '🚚' },
  { href: '/admin/reviews', label: '评论管理', icon: '⭐' },
  { href: '/admin/activities', label: '活动管理', icon: '🔥' },
  { href: '/admin/full-reductions', label: '满减活动', icon: '💰' },
  { href: '/admin/news', label: '新闻管理', icon: '📰' },
  { href: '/admin/partnership-applications', label: '合作申请', icon: '🤝' },
  { href: '/admin/product-views', label: '浏览统计', icon: '👁️' },
  { href: '/admin/categories', label: '分类管理', icon: '📂' },
  { href: '/admin/banners', label: '轮播图管理', icon: '🖼️' },
  { href: '/admin/announcements', label: '公告管理', icon: '📢' },
  { href: '/admin/popular-searches', label: '热门搜索', icon: '🔍' },
  { href: '/admin/coupons', label: '优惠券管理', icon: '🎟️' },
  { href: '/admin/images', label: '图片管理', icon: '🖼️' },
  { href: '/admin/email-templates', label: '邮件模板', icon: '📧' },
  { href: '/admin/customers', label: '客户管理', icon: '👥' },
  { href: '/admin/customers/rfm', label: 'RFM分析', icon: '📊' },
  { href: '/admin/warranty-submissions', label: '质保申请', icon: '🛡️' },
  { href: '/admin/support-tickets', label: '技术支持', icon: '🎧' },
  { href: '/admin/downloads', label: '下载管理', icon: '📥' },
  { href: '/admin/faq', label: 'FAQ 管理', icon: '❓' },
  { href: '/admin/rma-policy', label: '退换货政策', icon: '🔄' },
  { href: '/admin/customer-service-settings', label: '客服设置', icon: '☎️' },
  { href: '/admin/invoices', label: '发票管理', icon: '🧾' },
  { href: '/admin/staff', label: '员工管理', icon: '👔' },
  { href: '/admin/audit-logs', label: '操作日志', icon: '📝' },
  { href: '/admin/restock', label: '库存预警', icon: '⚠️' },
  { href: '/admin/shipping', label: '物流管理', icon: '🚛' },
  { href: '/admin/users', label: '用户管理', icon: '👤' },
  { href: '/admin/seo', label: 'SEO设置', icon: '🔍' },
  { href: '/admin/settings', label: '系统设置', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      router.push('/admin/login');
    } else {
      try { setAdminUser(JSON.parse(admin)); } catch {}
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center text-white font-bold">
                Q
              </div>
              <span className="font-bold text-lg">QNAP Store 管理后台</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-blue hover:underline">查看商城</Link>
            <span className="text-sm text-gray-500" suppressHydrationWarning>欢迎，{mounted ? (adminUser?.name || '管理员') : '管理员'}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-blue text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
