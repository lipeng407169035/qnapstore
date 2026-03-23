'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import '@/components/ui/Toast.css';

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

  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && (
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
              <div className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    欢迎回来，<span className="font-medium text-gray-700">{mounted ? (adminUser?.name || '管理员') : ''}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    查看商城
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    退出登录
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      )}
      {isLoginPage && children}
      <ToastContainer />
    </div>
  );
}
