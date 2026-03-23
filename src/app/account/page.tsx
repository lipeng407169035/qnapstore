'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore, usePointsStore, useRecentlyViewedStore } from '@/store';
import { Package, Heart, Star, Lightbulb, FileText } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { points, history } = usePointsStore();
  const { items: recentItems } = useRecentlyViewedStore();
  const [activeTab, setActiveTab] = useState('info');
  const [recentImages, setRecentImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/account');
    }
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'recent' && recentItems.length > 0) {
      const skus = recentItems.map(p => p.sku);
      fetch('/api/images/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus }),
      }).then(r => r.json()).then(imgs => setRecentImages(imgs)).catch(() => {});
    }
  }, [activeTab, recentItems]);

  if (!user) {
    return <div className="py-20 text-center">加载中...</div>;
  }

  const tabs = [
    { key: 'info', label: '账户' },
    { key: 'orders', label: '订单', Icon: Package },
    { key: 'wishlist', label: '收藏', Icon: Heart },
    { key: 'points', label: '积分', Icon: Star },
    { key: 'recent', label: '浏览' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <div className="md:hidden flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'bg-blue text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {tab.Icon ? <tab.Icon className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> : null}{tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue to-blue-dark rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {(user.name || user.email || 'U').charAt(0)}
            </div>
            <p className="text-center font-semibold text-sm mb-0.5">{user.name}</p>
            <p className="text-center text-xs text-gray-400 mb-4">{user.email}</p>
            <div className="bg-gradient-to-r from-orange to-orange-dark rounded-xl p-3 text-center mb-4">
              <p className="text-2xl font-bold text-white">{points}</p>
              <p className="text-xs text-white/80">可用积分</p>
            </div>
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                      activeTab === tab.key ? 'bg-blue text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    {tab.Icon ? <tab.Icon className="w-4 h-4 inline mr-2 -mt-0.5" /> : null}{tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          {activeTab === 'info' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <h2 className="font-barlow font-bold text-lg mb-5">账户信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">姓名</label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">电子邮箱</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">电话</label>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
                {user.address && (
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">收货地址</label>
                    <p className="font-medium">{user.address}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                <Link href="/invoice" className="block text-sm text-blue hover:underline"><FileText className="w-4 h-4 inline mr-1" /> 申请发票</Link>
                <button onClick={() => { setUser(null); router.push('/'); }} className="text-sm text-red-500 hover:underline">
                  退出登录
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <h2 className="font-barlow font-bold text-lg mb-5">我的订单</h2>
              <p className="text-sm text-gray-400">请至 <Link href="/orders" className="text-blue hover:underline">订单查询页面</Link> 查看详细订单信息。</p>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <h2 className="font-barlow font-bold text-lg mb-5">我的收藏</h2>
              <p className="text-sm text-gray-400">请至 <Link href="/wishlist" className="text-blue hover:underline">收藏清单页面</Link> 管理您的收藏商品。</p>
            </div>
          )}

          {activeTab === 'points' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h2 className="font-barlow font-bold text-lg">积分中心</h2>
                <div className="bg-orange-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-orange">{points}</p>
                </div>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">暂无积分记录</p>
              ) : (
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{h.reason}</p>
                        <p className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('zh-CN')}</p>
                      </div>
                      <span className={`font-bold ${h.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {h.amount > 0 ? '+' : ''}{h.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                <p className="mb-1"><Lightbulb className="w-4 h-4 inline mr-1" /> 积分规则：</p>
                <p>• 每消费 ¥100 可获得 1 积分</p>
                <p>• 1 积分 = ¥1，下次购物可直接抵扣</p>
                <p>• 积分永久有效，不设过期</p>
              </div>
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h2 className="font-barlow font-bold text-lg">最近浏览</h2>
                <Link href="/products" className="text-sm text-blue hover:underline">继续选购 →</Link>
              </div>
              {recentItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">暂无浏览记录</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {recentItems.map(p => (
                    <Link key={p.id} href={`/products/${p.sku}`} className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                      <div className="h-16 rounded-lg flex items-center justify-center mb-2 overflow-hidden" style={{ background: p.color }}>
                        {recentImages[p.sku] ? (
                          <img src={recentImages[p.sku]} alt={p.name} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-white/60" />
                        )}
                      </div>
                      <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs font-bold text-orange">¥ {p.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
