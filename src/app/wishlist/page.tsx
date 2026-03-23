'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store';
import { useCartStore } from '@/store';
import { useRecentlyViewedStore } from '@/store';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

function WishlistContent() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/popular-searches').then(r => r.json()).catch(() => []),
      fetch('/api/products').then(r => r.json()).catch(() => []),
    ]).then(([searches, prods]) => {
      setPopularSearches(searches as string[]);
      const allProds = prods as Product[];
      setRecommendations(allProds.filter(p => !items.some(i => i.productId === p.id)).slice(0, 8));
    });
  }, []);

  const handleAddToCart = (item: any) => {
    addItem(item.product);
    removeItem(item.productId);
    toast.success('已加入购物车！');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-bold mb-2">收藏夹是空的</h2>
          <p className="text-muted mb-6">快去收藏心仪的商品吧！</p>
          <Link href="/products">
            <Button variant="blue">开始购物</Button>
          </Link>
        </div>
        
        {popularSearches.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">🔥 热门搜索</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 12).map((word, i) => (
                <Link key={i} href={`/products?search=${encodeURIComponent(word)}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue rounded-full text-sm transition-colors">
                  {word}
                </Link>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">为你推荐</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recommendations.map(p => (
                <Link key={p.id} href={`/products/${p.sku}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="h-28 flex items-center justify-center" style={{ background: p.color }}>
                    <span className="text-3xl text-white/80">📦</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-1 mb-1">{p.name}</p>
                    <p className="text-sm font-bold text-orange">¥ {p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="font-barlow text-xl md:text-2xl font-extrabold">❤️ 我的收藏</h1>
        <span className="text-xs md:text-sm text-gray-500">{items.length} 件商品</span>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
              <Link href={`/products/${item.product.sku}`} className="flex-shrink-0">
                <div className="w-14 md:w-20 h-12 md:h-16 rounded-lg flex items-center justify-center" 
                  style={{ background: item.product.color }}>
                  <img
                    src={`/images/products/${item.product.sku}/1.svg`}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.sku}`} className="font-semibold text-xs md:text-sm hover:text-blue line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden md:block">
                  SKU: {item.product.sku} · {new Date(item.addedAt).toLocaleDateString('zh-CN')} 加入
                </p>
                {item.product.stock === 0 && (
                  <span className="text-xs text-red-500 font-medium">缺货 · 到货通知</span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base md:text-lg font-barlow font-extrabold text-orange">
                  ¥ {item.product.price.toLocaleString()}
                </p>
                {item.product.originalPrice && (
                  <p className="text-[10px] md:text-xs text-gray-400 line-through hidden md:block">
                    ¥ {item.product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-1 md:gap-2 flex-shrink-0">
                {item.product.stock === 0 ? (
                    <Button variant="outline" size="sm" onClick={() => toast.success('到货通知已订阅！缺货时我们会通知您')}>
                    到货通知
                  </Button>
                ) : (
                  <Button variant="blue" size="sm" onClick={() => handleAddToCart(item)}>
                    加入购物车
                  </Button>
                )}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">加载中...</div>}>
      <WishlistContent />
    </Suspense>
  );
}
