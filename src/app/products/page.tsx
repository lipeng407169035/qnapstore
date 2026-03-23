'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/store';
import { toast } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { LucideIcon } from 'lucide-react';
import {
  Flame, Star, X as XIcon, Menu, SlidersHorizontal, ArrowUpDown,
  Search, Package, Building2, Monitor, HardDrive, Wifi, Shield,
  Globe, Network, Video, Cloud, Sliders, Battery, Zap, Smartphone,
  Laptop, Disc, Camera, Wrench, Cpu, Home, Printer, Plug, Settings,
  Lock, Database, Gamepad2, Lightbulb, Microscope, Brain, BarChart3, Key,
  Rocket, ShoppingCart, ArrowUp, ArrowDown
} from 'lucide-react';

const categoryIconMap: Record<string, LucideIcon> = {
  'home-nas': Home, 'business-nas': Building2, 'rackmount-nas': Monitor, 'all-flash': HardDrive,
  'switch': Wifi, 'router': Globe, 'nvr-hardware': Video, 'expansion': HardDrive,
  'network-card': Network, 'software': Package, 'warranty': Shield, 'memory': Database,
  'storage-card': HardDrive, 'm2-card': Cpu, 'fiber-card': Network, 'hdd-dock': HardDrive,
};

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
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const { addItem } = useCartStore();

  const categoryName = category 
    ? categories.find(c => c.slug === category)?.name || category 
    : '全部商品';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCategories(),
      api.getProducts({ category, search, badge, sort, rating }),
    ]).then(async ([cats, prods]) => {
      setCategories(cats as Category[]);
      setProducts(prods as Product[]);

      const prodsData = prods as Product[];
      const skus = prodsData.map(p => p.sku);
      if (skus.length > 0) {
        try {
          const res = await fetch('/api/images/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skus }),
          });
          const imgs = await res.json();
          setProductImages(imgs);
        } catch {}
      }

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
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.slug] || Package;
            return (
              <a key={cat.id} href={`/products?category=${cat.slug}`} className={`flex items-center gap-2 py-1.5 text-[13px] ${category === cat.slug ? 'text-blue font-semibold' : 'text-gray-600 hover:text-blue'}`}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cat.name}</span>
              </a>
            );
          })}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">筛选</h3>
        <div className="space-y-2">
          <a href="/products?badge=sale" className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-blue">
            <Flame className="w-3.5 h-3.5 text-orange-500" /> 特价商品
          </a>
          <a href="/products?sort=rating" className={`flex items-center gap-2 text-[13px] ${sort === 'rating' ? 'text-blue font-semibold' : 'text-gray-600 hover:text-blue'}`}>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 评价最高
          </a>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-3">评分</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(stars => (
            <a key={stars} href={`/products?rating=${stars}`} className={`flex items-center gap-2 text-[13px] hover:text-blue ${rating === String(stars) ? 'text-blue font-semibold' : 'text-gray-600'}`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className={`w-3 h-3 ${si < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-400">{stars}星以上</span>
            </a>
          ))}
          {rating && (
            <a href="/products" className="flex items-center gap-2 text-[13px] text-red-500 hover:text-red-600">
              <XIcon className="w-3.5 h-3.5" /> 清除筛选
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
            <Menu className="w-4 h-4" /> 筛选
          </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'price_asc' }))} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'price_asc' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                <ArrowUp className="w-3.5 h-3.5" /> 价格
              </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'price_desc' }))} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'price_desc' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                <ArrowDown className="w-3.5 h-3.5" /> 价格
              </button>
              <button onClick={() => navigateTo(buildUrl({ sort: 'rating' }))} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${sort === 'rating' ? 'bg-blue text-white' : 'bg-white border border-gray-200'}`}>
                <Star className="w-3.5 h-3.5" /> 评价
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
                  <button onClick={() => setSidebarOpen(false)}><XIcon className="w-5 h-5" /></button>
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
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Search}
                title="找不到符合的商品"
                description="试试调整筛选条件或浏览全部商品"
                action={{ label: '回全部商品', href: '/products' }}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} imageUrl={productImages[product.sku]} onAddToCart={() => handleAddToCart(product)} />
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
