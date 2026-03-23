'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/store';
import { toast } from '@/components/ui/Toast';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const badge = searchParams.get('badge') || '';
  const sort = searchParams.get('sort') || '';
  const rating = searchParams.get('rating') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addItem } = useCartStore();

  const categoryName = category 
    ? categories.find(c => c.slug === category)?.name || category 
    : '全部商品';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCategories(),
      api.getProducts({ category, search, badge, sort, rating }),
    ]).then(([cats, prods]) => {
      setCategories(cats as Category[]);
      setProducts(prods as Product[]);
      setLoading(false);
    });
  }, [category, search, badge, sort, rating]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success('已加入购物车！');
  };

  const buildUrl = useCallback((overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (badge) params.set('badge', badge);
    if (sort) params.set('sort', sort);
    if (rating) params.set('rating', rating);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return `/products?${params.toString()}`;
  }, [category, search, badge, sort, rating]);

  const navigateTo = useCallback((url: string) => {
    router.push(url);
  }, [router]);

  const Sidebar = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-sm mb-3 text-gray-900">商品分类</h3>
        <div className="space-y-1">
          <a href="/products" className={`block py-1.5 text-[13px] ${!category ? 'text-blue font-semibold' : 'text-gray-600 hover:text-blue'}`}>全部商品</a>
          {categories.map((cat) => (
            <a key={cat.id} href={`/products?category=${cat.slug}`} className={`block py-1.5 text-[13px] ${category === cat.slug ? 'text-blue font-semibold' : 'text-gray-600 hover:text-blue'}`}>
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">筛选</h3>
        <div className="space-y-2">
          <a href="/products?badge=sale" className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-blue">
            🔥 特价商品
          </a>
          <a href="/products?sort=rating" className={`flex items-center gap-2 text-[13px] ${sort === 'rating' ? 'text-blue font-semibold' : 'text-gray-600 hover:text-blue'}`}>
            ⭐ 评价最高
          </a>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">评分</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(stars => (
            <a key={stars} href={`/products?rating=${stars}`} className={`flex items-center gap-2 text-[13px] hover:text-blue ${rating === String(stars) ? 'text-blue font-semibold' : 'text-gray-600'}`}>
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} <span className="text-xs text-gray-400">{stars}星以上</span>
            </a>
          ))}
          {rating && (
            <a href="/products" className="flex items-center gap-2 text-[13px] text-red-500 hover:text-red-600">
              ✕ 清除筛选
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-[#1d3a5f] text-white py-7 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-barlow text-2xl md:text-3xl font-extrabold mb-1">{categoryName}</h1>
          <p className="text-xs md:text-sm opacity-80">
            {search ? `搜索结果: "${search}"` : categories.find(c => c.slug === category)?.desc || '浏览所有商品'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
        {/* Mobile filter bar */}
        <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm whitespace-nowrap"
          >
            ☰ 筛选
          </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'price_asc' }))} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'price_asc' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                价格↑
              </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'price_desc' }))} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'price_desc' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                价格↓
              </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'rating' }))} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'rating' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                ⭐评价
              </button>
              <button onClick={() => navigateTo('/products')} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${!sort ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                默认
              </button>
        </div>

        <div className="flex gap-5 md:gap-7">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between bg-blue text-white">
                  <span className="font-bold">筛选</span>
                  <button onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                <div className="p-5">
                  <Sidebar />
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            <div className="hidden md:flex items-center justify-between mb-4 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-500">共 {products.length} 件商品</span>
              <select 
                className="border-none text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
                value={sort}
                onChange={(e) => {
                  navigateTo(buildUrl({ sort: e.target.value }));
                }}
              >
                <option value="">默认排序</option>
                <option value="price_asc">价格: 低到高</option>
                <option value="price_desc">价格: 高到低</option>
                <option value="rating">评价最高</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl h-72 md:h-80 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 md:py-20">
                <p className="text-gray-500 text-base md:text-lg mb-3">找不到符合的商品</p>
                <a href="/products" className="text-blue hover:underline text-sm">回全部商品</a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">加载中...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
