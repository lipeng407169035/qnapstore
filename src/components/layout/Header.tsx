'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCartStore, useUserStore, useWishlistStore } from '@/store';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const { getCount } = useCartStore();
  const { user } = useUserStore();
  const { getCount: getWishlistCount } = useWishlistStore();
  const cartCount = getCount();
  const wishlistCount = getWishlistCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: '/products', label: '全部商品' },
    { href: '/products?category=home-nas', label: '家用 NAS' },
    { href: '/products?category=business-nas', label: '企业 NAS' },
    { href: '/products?category=rackmount-nas', label: '机架式 NAS' },
    { href: '/products?category=switch', label: '网络交换机' },
    { href: '/products?category=network-card', label: '网络配件' },
    { href: '/products?category=software', label: '软件授权' },
    { href: '/products?category=warranty', label: '延长质保' },
    { href: '/products?category=memory', label: '内存' },
    { href: '/compare', label: '比较' },
    { href: '/products?badge=sale', label: '限时特价', highlight: true },
  ];

  return (
    <>
      {/* Top bar - hidden on mobile */}
      <div className="bg-[#1d3557] text-[#c5d8e8] text-xs py-1.5 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <span>🇨🇳 欢迎来到 QNAP 中国官方网上商城</span>
          <div className="flex gap-4">
            <Link href="/account" className="hover:text-white transition-colors">我的账户</Link>
            <Link href="/orders" className="hover:text-white transition-colors">订单查询</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">⚙️ 管理员</Link>
            <span className="cursor-pointer hover:text-white">简体中文</span>
            <span className="cursor-pointer hover:text-white">客服中心</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 h-14 md:h-16">
            {/* Hamburger */}
            <button
              className="md:hidden p-1 text-gray-600 hover:text-blue"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue rounded-lg flex items-center justify-center text-white font-barlow font-black text-lg md:text-xl">
                Q
              </div>
              <div>
                <span className="font-barlow font-extrabold text-lg md:text-xl text-blue">QNAP</span>
                <span className="text-muted text-[10px] md:text-xs font-normal ml-0.5 hidden sm:inline">中国官方商城</span>
              </div>
            </Link>

            {/* Search - full on md+, compact on sm */}
            <form onSubmit={handleSearch} className="flex-1 relative max-w-xl hidden sm:block">
              <div className="flex bg-gray-50 border border-transparent rounded-lg overflow-hidden transition-all focus-within:border-blue focus-within:bg-white focus-within:shadow-md">
                <input
                  type="text"
                  placeholder="搜索产品型号或关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none bg-transparent px-3 md:px-4 py-2 text-sm outline-none"
                />
                <button type="submit" className="bg-blue text-white px-3 md:px-5 py-2 text-sm hover:bg-blue-dark transition-colors">
                  🔍
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <button onClick={() => router.push('/products')} className="sm:hidden p-2 text-gray-500 hover:text-blue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href={user ? '/account' : '/login'} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-blue transition-colors text-[10px] md:text-[11px] p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{user ? user.name : '登录'}</span>
              </Link>
              <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-blue transition-colors text-[10px] md:text-[11px] p-1 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden sm:inline">收藏</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-blue transition-colors text-[10px] md:text-[11px] p-1 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline">购物车</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="搜索产品型号或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-blue text-white px-4 py-2 text-sm">🔍</button>
            </div>
          </form>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b bg-blue text-white flex items-center justify-between">
              <span className="font-bold">QNAP Store</span>
              <button onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <div className="p-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                🏠 首页
              </Link>
              <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide mt-2">商品分类</div>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${link.highlight ? 'text-orange font-semibold' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t mt-2 pt-2">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  👤 我的账户
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  📦 订单查询
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  ❤️ 收藏清单
                </Link>
                <Link href="/compare" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  ⚖️ 商品对比
                </Link>
                <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide mt-2">关于 QNAP</div>
                {[
                  { href: '/about', label: '🏢 品牌介绍' },
                  { href: '/news', label: '📰 新闻中心' },
                  { href: '/partnership', label: '🤝 成为合作伙伴' },
                  { href: '/careers', label: '💼 招聘信息' },
                  { href: '/contact', label: '📞 联系我们' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="bg-blue hidden md:block relative">
        <div className="container mx-auto px-6">
          <div className="flex items-stretch overflow-x-auto">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? 'bg-white/15 text-white'
                    : link.highlight
                    ? 'ml-auto font-bold bg-orange hover:bg-orange-dark text-white'
                    : 'text-[#d4eaf7] hover:bg-white/15 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button className={`px-4 py-3 text-[13.5px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${aboutDropdownOpen ? 'bg-white/15 text-white' : 'text-[#d4eaf7] hover:bg-white/15 hover:text-white'}`}>
                关于我们
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {aboutDropdownOpen && (
                <div className="absolute left-0 top-full bg-white shadow-xl rounded-b-lg border-t z-50 min-w-[180px]">
                  {[
                    { href: '/about', label: '品牌介绍' },
                    { href: '/news', label: '新闻中心' },
                    { href: '/partnership', label: '成为合作伙伴' },
                    { href: '/careers', label: '招聘信息' },
                    { href: '/contact', label: '联系我们' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-2.5 text-[13px] text-gray-700 hover:bg-blue hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
