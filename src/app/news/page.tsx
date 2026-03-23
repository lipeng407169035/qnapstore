'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  hot: boolean;
}

const CATEGORIES = ['全部', '产品发布', '企业动态', '合作伙伴', '优惠活动', '技术专栏', '产业趋势'];

const CATEGORY_COLORS: Record<string, string> = {
  '产品发布': 'bg-blue-100 text-blue-700',
  '企业动态': 'bg-green-100 text-green-700',
  '合作伙伴': 'bg-purple-100 text-purple-700',
  '优惠活动': 'bg-red-100 text-red-700',
  '技术专栏': 'bg-orange-100 text-orange-700',
  '产业趋势': 'bg-indigo-100 text-indigo-700',
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [category]);

  async function fetchNews() {
    setLoading(true);
    try {
      const url = category === '全部' ? '/api/news' : `/api/news?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      setNews(data);
    } catch {
      setNews([]);
    }
    setLoading(false);
  }

  const hotNews = news.filter(n => n.hot);
  const displayNews = category === '全部' ? news.filter(n => !n.hot) : news;

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-barlow text-3xl md:text-4xl font-extrabold mb-3">新闻中心</h1>
          <p className="text-white/70">掌握 QNAP 最新动态、产品发布与产业趋势</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-blue text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue hover:text-blue'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue border-t-transparent"></div>
          </div>
        ) : (
          <>
            {category === '全部' && hotNews.length > 0 && (
              <div className="mb-8">
                <Link href={`/news/${hotNews[0].id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="h-56 md:min-h-[320px] bg-gray-100 relative overflow-hidden">
                        <img
                          src={hotNews[0].image}
                          alt={hotNews[0].title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2137]/50 to-[#006ebd]/30" />
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          热门
                        </span>
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${CATEGORY_COLORS[hotNews[0].category] || 'bg-gray-100 text-gray-600'}`}>
                            {hotNews[0].category}
                          </span>
                          <span className="text-xs text-gray-400">{hotNews[0].date}</span>
                        </div>
                        <h2 className="font-bold text-xl md:text-2xl mb-4 group-hover:text-blue transition-colors leading-snug">
                          {hotNews[0].title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                          {hotNews[0].excerpt}
                        </p>
                        <span className="text-blue text-sm font-semibold group-hover:underline">
                          阅读全文 →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNews.map(n => (
                <Link key={n.id} href={`/news/${n.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      {n.hot && (
                        <span className="absolute top-3 right-3 bg-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          热门
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                          {n.category}
                        </span>
                        <span className="text-xs text-gray-400">{n.date}</span>
                      </div>
                      <h3 className="font-bold text-base mb-2 line-clamp-2 hover:text-blue cursor-pointer transition-colors">
                        {n.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
                        {n.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {!loading && news.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <div className="mb-4 flex justify-center"><Newspaper className="w-16 h-16 text-gray-300" /></div>
                <p className="text-lg">暂无新闻</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
