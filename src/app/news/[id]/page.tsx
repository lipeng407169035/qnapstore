'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  hot: boolean;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then(r => r.json())
      .then(data => {
        setNews(data);
        return fetch('/api/news');
      })
      .then(r => r.json())
      .then(all => {
        const relatedNews = all
          .filter((n: NewsItem) => n.category === news?.category && n.id !== parseInt(id))
          .slice(0, 3);
        setRelated(relatedNews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue border-t-transparent"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">新闻不存在</p>
        <Link href="/news" className="text-blue hover:underline">返回新闻中心</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-sm text-white/60 mb-3">
            <Link href="/news" className="hover:text-white transition-colors">新闻中心</Link>
            <span className="mx-2">/</span>
            <span>{news.category}</span>
          </nav>
          <h1 className="font-barlow text-2xl md:text-3xl font-extrabold">{news.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
            <span>{news.category}</span>
            <span>{news.date}</span>
            {news.hot && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">热门</span>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {news.image && (
            <div className="mb-8 rounded-2xl overflow-hidden h-64 md:h-80">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <div
            className="prose max-w-none mb-10 text-gray-700"
            dangerouslySetInnerHTML={{ __html: news.content || `<p>${news.excerpt}</p>` }}
            style={{
              lineHeight: '1.9',
              fontSize: '15px',
            }}
          />

          <div className="border-t pt-8">
            <Link href="/news" className="inline-flex items-center gap-2 text-blue hover:underline text-sm">
              ← 返回新闻中心
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="font-barlow text-xl font-bold mb-6">相关推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(n => (
                <Link key={n.id} href={`/news/${n.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-36 bg-gray-100 relative">
                      <img src={n.image} alt={n.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-2">{n.date}</p>
                      <h3 className="font-bold text-sm line-clamp-2 hover:text-blue transition-colors">{n.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
