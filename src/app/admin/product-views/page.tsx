'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductView {
  id: string;
  sku: string;
  name: string;
  views: number;
  stock: number;
}

export default function ProductViewsPage() {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'views' | 'stock'>('views');

  useEffect(() => {
    adminFetch('/api/admin/product-views')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const sorted = [...products].sort((a, b) => {
    return sortBy === 'views' ? b.views - a.views : a.stock - b.stock;
  });

  const totalViews = products.reduce((sum, p) => sum + p.views, 0);

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">商品浏览统计</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">总浏览量</p>
          <p className="text-3xl font-bold mt-1">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">平均浏览</p>
          <p className="text-3xl font-bold mt-1">{products.length > 0 ? Math.round(totalViews / products.length) : 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">热门商品</p>
          <p className="text-lg font-bold mt-1 truncate">{products[0]?.name || '-'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">商品浏览排行</h2>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'views' | 'stock')}
            className="px-4 py-2 border rounded-xl text-sm"
          >
            <option value="views">按浏览量排序</option>
            <option value="stock">按库存排序</option>
          </select>
        </div>

        <div className="space-y-2">
          {sorted.map((p, i) => {
            const maxViews = sorted[0]?.views || 1;
            const barWidth = p.views > 0 ? Math.round((p.views / maxViews) * 100) : 0;
            return (
              <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.sku}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock <= 20 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        库存: {p.stock}
                      </span>
                      <span className="text-sm font-bold text-blue w-16 text-right">{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue h-2 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
