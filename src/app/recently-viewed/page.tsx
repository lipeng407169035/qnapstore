'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecentlyViewedStore } from '@/store';
import { Package, Star, Clock } from 'lucide-react';

export default function RecentlyViewedPage() {
  const { items, clear } = useRecentlyViewedStore();
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => { setLoading(false); }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const skus = items.map(p => p.sku);
    fetch('/api/images/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skus }),
    }).then(r => r.json()).then(imgs => setProductImages(imgs)).catch(() => {});
  }, [items]);

  if (loading) return <div className="py-20 text-center">加载中...</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">最近浏览</h1>
        {items.length > 0 && (
          <button onClick={clear} className="text-sm text-gray-400 hover:text-red-500">清空记录</button>
        )}
      </div>

      {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">暂无浏览记录</h2>
          <p className="text-gray-400 mb-6">浏览商品后会自动记录在这里</p>
          <Link href="/products" className="inline-block bg-blue text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-dark transition-colors">
            开始浏览
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(p => (
            <Link key={p.id} href={`/products/${p.sku}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="h-32 flex items-center justify-center overflow-hidden" style={{ background: p.color }}>
                {productImages[p.sku] ? (
                  <img src={productImages[p.sku]} alt={p.name} className="w-full h-full object-contain" />
                ) : (
                  <Package className="w-8 h-8 text-white/80" />
                )}
              </div>
              <div className="p-3">
                {p.badge && (
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 ${
                    p.badge === '热销' ? 'bg-orange-100 text-orange-700' :
                    p.badge === '新品' ? 'bg-green-100 text-green-700' :
                    p.badge === '特价' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{p.badge}</span>
                )}
                <p className="text-sm font-medium line-clamp-2 mb-1">{p.name}</p>
                <p className="text-xs text-gray-400 mb-2">{p.sku}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-orange">¥ {p.price.toLocaleString()}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">¥ {p.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {p.rating}
                  <span>·</span>
                  <span>已售 {p.reviews}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
