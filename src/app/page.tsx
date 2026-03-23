'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Banner, Announcement, Category } from '@/types';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore, useRecentlyViewedStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import {
  Zap, Shield, Cloud, Brain,
  Package, Server, HardDrive, Network, Building,
  Tv, Box, Cpu, Globe, Router, Eye, Star,
  Truck, ShieldCheck, CreditCard, Headphones,
  ChevronLeft, ChevronRight, Flame, Search,
  Database, Building2, Monitor, Wifi, Wrench,
  Disc, Plug, Video, Battery, Rocket, Key, Clock
} from 'lucide-react';

const emojiMap: Record<string, React.ElementType> = {
  'home-nas': Database, 'business-nas': Building2, 'rackmount-nas': Monitor, 'all-flash': HardDrive,
  'switch': Wifi, 'router': Globe, 'nvr-hardware': Video, 'expansion': HardDrive,
  'network-card': Network, 'software': Package, 'warranty': Shield, 'memory': Database,
  'storage-card': HardDrive, 'm2-card': Cpu, 'fiber-card': Network, 'hdd-dock': HardDrive,
};

function stripEmoji(text: string) {
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
}

function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = emojiMap[slug] || Package;
  return <Icon className={className} />;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCartStore();
  const { items: recentItems } = useRecentlyViewedStore();
  const [recentImages, setRecentImages] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getProducts({}),
      fetch('/api/banners').then(r => r.json()),
      fetch('/api/announcements').then(r => r.json()),
      fetch('/api/popular-searches').then(r => r.json()).catch(() => []),
    ]).then(async ([cats, prods, bannersData, announcementsData, searches]) => {
      setCategories(cats as Category[]);
      const allProducts = prods as Product[];
      setProducts(allProducts.slice(0, 8));
      setHotProducts(allProducts.filter(p => p.badge === '热销' || p.rating >= 4.8).slice(0, 4));
      setAnnouncements(announcementsData);
      setBanners(bannersData);
      setPopularSearches(searches as string[]);

      const featuredSkus = [...allProducts.slice(0, 8), ...allProducts.filter(p => p.badge === '热销' || p.rating >= 4.8).slice(0, 4)].map(p => p.sku);
      if (featuredSkus.length > 0) {
        try {
          const res = await fetch('/api/images/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skus: [...new Set(featuredSkus)] }),
          });
          const imgs = await res.json();
          setProductImages(imgs);
        } catch {}
      }

      if (recentItems.length > 0) {
        try {
          const res2 = await fetch('/api/images/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skus: recentItems.map(p => p.sku) }),
          });
          const imgs2 = await res2.json();
          setRecentImages(imgs2);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success('已加入购物车！');
  };

  if (banners.length === 0) {
    return <div className="text-center py-20">加载中...</div>;
  }

  return (
    <>
      {/* Hero Slider */}
      <section className="relative overflow-hidden h-64 sm:h-80 md:h-[420px] lg:h-[480px] bg-gray-900" aria-label="精选活动轮播">
        <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full flex items-center" style={{ background: banner.gradient }}>
              <div className="container mx-auto px-6 flex items-center justify-between w-full">
                <div className="text-white max-w-lg z-10 px-4 md:pl-4">
                  <span className="inline-block bg-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">限时优惠</span>
                  <h2 className="font-barlow text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 md:mb-4">{banner.title}</h2>
                  <p className="text-xs sm:text-sm md:text-base opacity-90 leading-relaxed mb-4 md:mb-8 max-w-md">{banner.subtitle}</p>
                  <Link href={`/products${banner.link.startsWith('?') ? banner.link : '/' + banner.link}`}>
                    <Button variant="primary" size="md" md-size="lg" className="shadow-lg">{banner.btnText}</Button>
                  </Link>
                </div>
                <div className="hidden lg:flex items-center justify-center w-[360px] pr-4">
                  <div className="w-48 h-32 rounded-2xl flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                    <div className="w-36 h-5 bg-black/30 rounded-lg flex items-center px-2 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                      <div className="flex-1 h-2 bg-black/30 rounded" />
                    </div>
                    <span className="text-[10px] text-white/30 font-mono font-bold tracking-widest">NAS UNIT</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button aria-label="上一张" onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur border-none text-white cursor-pointer transition-all hover:bg-white/35 hover:scale-110 flex items-center justify-center"><ChevronLeft className="w-6 h-6" /></button>
        <button aria-label="下一张" onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)} className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur border-none text-white cursor-pointer transition-all hover:bg-white/35 hover:scale-110 flex items-center justify-center"><ChevronRight className="w-6 h-6" /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="轮播指示">
          {banners.map((_, idx) => (
            <button role="tab" aria-selected={idx === currentSlide} aria-label={`投影片 ${idx + 1}`} key={idx} onClick={() => setCurrentSlide(idx)} className={`rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      </section>

      {/* Announcement */}
      <div className="bg-blue-light border-b border-blue/20 py-3 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex gap-8 animate-scroll whitespace-nowrap">
            {announcements.map((ann) => (
              <span key={ann.id} className="text-xs text-blue-dark font-medium flex items-center gap-2">{stripEmoji(ann.text)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-6 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 text-center hover:border-blue hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <CategoryIcon slug={cat.slug} className="text-2xl md:text-3xl mb-1 md:mb-2 block mx-auto" />
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-0.5">{cat.name}</h3>
                <p className="text-[9px] md:text-[10px] text-muted line-clamp-2 hidden sm:block">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Products */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-barlow text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              热销商品
              <span className="block w-12 h-1 bg-orange rounded" />
            </h2>
            <Link href="/products" className="text-blue text-sm font-medium hover:text-blue-dark hover:underline transition-colors">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} imageUrl={productImages[product.sku]} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-[#1d3557] via-blue to-[#006ebd] rounded-xl md:rounded-2xl p-5 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white relative overflow-hidden gap-4">
            <div className="absolute rounded-full bg-white/5 w-96 h-96 -top-20 -right-20" />
            <div className="absolute rounded-full bg-white/5 w-64 h-64 -bottom-16 right-1/3" />
            <div className="relative z-10 max-w-lg">
              <h2 className="font-barlow text-xl md:text-3xl font-extrabold mb-2 md:mb-3">春季特卖现在开始</h2>
              <p className="text-xs md:text-base opacity-85 leading-relaxed hidden sm:block">精选 NAS、交换机、内存限时优惠，加购延长质保更划算！</p>
            </div>
            <div className="relative z-10 flex gap-2 md:gap-4">
              <Link href="/products?badge=sale"><Button variant="primary" size="sm">查看优惠</Button></Link>
              <Link href="/products"><Button variant="outline" size="sm">全部商品</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-6 md:py-10 pb-10 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="font-barlow text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
              <span className="text-base md:text-xl"><Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-400 text-amber-400" /></span>
              精选商品
              <span className="block w-8 md:w-12 h-0.5 md:h-1 bg-orange rounded" />
            </h2>
            <Link href="/products" className="text-blue text-xs md:text-sm font-medium hover:text-blue-dark hover:underline transition-colors">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} imageUrl={productImages[product.sku]} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-barlow text-xl md:text-2xl font-bold text-center mb-8">热门商品分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Server, name: '家用 NAS', slug: 'home-nas', desc: '2-4 槽家庭存储', color: 'from-blue-400 to-blue-600' },
              { icon: Building, name: '企业 NAS', slug: 'business-nas', desc: '高性价比企业存储', color: 'from-purple-400 to-purple-600' },
              { icon: HardDrive, name: '全快闪 NAS', slug: 'all-flash', desc: 'U.2 NVMe 全闪存', color: 'from-cyan-400 to-blue-600' },
              { icon: Router, name: '路由器', slug: 'router', desc: 'Wi-Fi 6 / SD-WAN', color: 'from-indigo-400 to-purple-600' },
              { icon: Tv, name: 'QVR 专用机', slug: 'nvr-hardware', desc: 'AI 智能录像机', color: 'from-red-400 to-orange-600' },
              { icon: Box, name: '扩展设备', slug: 'expansion', desc: 'JBOD 存储扩展', color: 'from-teal-400 to-green-600' },
              { icon: Cpu, name: 'M.2 SSD 卡', slug: 'm2-card', desc: 'NVMe 扩展加速', color: 'from-amber-400 to-orange-600' },
              { icon: Network, name: '网络交换机', slug: 'switch', desc: '2.5G/10G 高速', color: 'from-emerald-400 to-teal-600' },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.desc}</p>
                <div className="mt-4 text-xs font-medium opacity-80">查看商品 →</div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why QNAP */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-barlow text-2xl md:text-3xl font-bold mb-3">为什么选择 QNAP？</h2>
            <p className="text-gray-500 max-w-xl mx-auto">二十二年专业经验，为超过 100 万用户提供安全可靠的数据存储解决方案</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: '极速效能', desc: 'Intel 处理器 + 2.5GbE 网络，文件传输速度提升 3 倍', color: 'text-orange' },
              { icon: Shield, title: '军规安全', desc: 'AES-256 硬件加密，IP 封锁与 Two-Step 验证', color: 'text-blue' },
              { icon: Cloud, title: '混合云端', desc: '本地 NAS 结合云端备份，数据保护无死角', color: 'text-cyan-500' },
              { icon: Brain, title: 'AI 智能', desc: 'QuAI 本地 LLM 助手，智能管理照片与数据', color: 'text-purple-500' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 bg-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Banner */}
      <section className="py-10 bg-gradient-to-r from-[#0d2137] via-blue to-[#006ebd] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left flex-1">
              <span className="text-white/50 text-sm">关于 QNAP</span>
              <h2 className="font-barlow text-2xl md:text-3xl font-extrabold mt-2 mb-4">二十二年专注，存储无界</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                QNAP 成立于 2004 年，专注于网络存储设备的研发与制造。我们的 NAS 产品畅销全球 180+ 国家与地区，为超过 100 万用户提供安全可靠的数据存储解决方案。
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Link href="/about"><Button variant="primary" size="sm">认识 QNAP</Button></Link>
                <Link href="/news"><Button variant="outline" size="sm">新闻中心</Button></Link>
              </div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="text-8xl font-black opacity-20 select-none">Q</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[['20+', '年专业'], ['100万+', '全球用户'], ['180+', '国家地区'], ['3,000+', '经销商']].map(([num, label], i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3">
                    <p className="font-bold text-xl">{num}</p>
                    <p className="text-white/60 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-barlow text-2xl font-bold text-center mb-8">用户好评</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '林先生', role: 'SOHO 自由工作者', text: 'TS-464 用了一年多，备份速度非常快，QuTScloud 让我可以随时存取文件，非常推荐！', rating: 5 },
              { name: '陈小姐', role: '室内设计师', text: '公司采用 QNAP NAS 做设计文件集中管理，4K 影片编辑再也不卡顿，节省大量时间。', rating: 5 },
              { name: '王先生', role: 'IT 管理员', text: '管理 30 台 QNAP 设备，Q\'center 集中管理平台非常好用，大幅降低维护成本。', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">「{t.text}」</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center text-white font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-[#1d3557] to-[#006ebd] rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-barlow text-2xl md:text-3xl font-extrabold mb-3">订阅电子报</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">第一时间获得新产品发布、限时优惠与技术文章的独家资讯</p>
            <form className="flex gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" id="newsletter-email" name="email" placeholder="输入您的电子邮件" aria-label="电子邮件地址" className="flex-1 px-5 py-3 rounded-xl text-gray-900 text-sm outline-none" />
              <button type="submit" aria-label="订阅电子报" className="bg-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-dark transition-colors whitespace-nowrap">订阅</button>
            </form>
            <p className="text-white/40 text-xs mt-3">我们重视您的隐私，不会发送垃圾邮件</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 py-6 md:py-10 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h3 className="sr-only">服务特色</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-blue" />
              </div>
              <div>
                <h4 className="text-xs md:text-base font-semibold text-gray-900 mb-0.5">全国包邮</h4>
                <p className="text-[10px] md:text-sm text-muted">满 ¥3,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-light rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue" />
              </div>
              <div>
                <h4 className="text-xs md:text-base font-semibold text-gray-900 mb-0.5">原厂质保</h4>
                <p className="text-[10px] md:text-sm text-muted">品质有保障</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-light rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue" />
              </div>
              <div>
                <h4 className="text-xs md:text-base font-semibold text-gray-900 mb-0.5">分期免息</h4>
                <p className="text-[10px] md:text-sm text-muted">最高花呗/白条分期</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 md:w-6 md:h-6 text-blue" />
              </div>
              <div>
                <h4 className="text-xs md:text-base font-semibold text-gray-900 mb-0.5">专业客服</h4>
                <p className="text-[10px] md:text-sm text-muted">400-888-3600</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      {popularSearches.length > 0 && (
        <section className="py-8 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-barlow text-lg font-bold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> 热门搜索
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((word, i) => (
                <Link
                  key={i}
                  href={`/products?search=${encodeURIComponent(word)}`}
                  className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue rounded-full text-sm transition-colors border border-gray-200 hover:border-blue"
                >
                  {word}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {mounted && recentItems.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-barlow text-lg font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> 最近浏览
              </h2>
              <Link href="/recently-viewed" className="text-sm text-blue hover:underline">查看全部 →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentItems.slice(0, 6).map(p => (
                <Link key={p.id} href={`/products/${p.sku}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="h-20 flex items-center justify-center overflow-hidden" style={{ background: p.color }}>
                    {recentImages[p.sku] ? (
                      <img src={recentImages[p.sku]} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <Package className="w-6 h-6 text-white/80" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-1 mb-0.5">{p.name}</p>
                    <p className="text-xs font-bold text-orange">¥ {p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
