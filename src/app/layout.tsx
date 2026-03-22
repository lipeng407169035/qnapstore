import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

async function getSEO() {
  try {
    const res = await fetch('http://localhost:3001/api/seo', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch SEO');
    return res.json();
  } catch {
    return {
      homeTitle: 'QNAP Store 中国 | 官方网上商城',
      homeDescription: 'QNAP 中国官方网上商城 - 购买 NAS、网络交换机、内存等产品',
      homeKeywords: 'QNAP, NAS, 网络存储, 交换机, 中国',
      ogImage: '/images/og-default.png',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  return {
    title: seo.homeTitle || 'QNAP Store 中国 | 官方网上商城',
    description: seo.homeDescription || 'QNAP 中国官方网上商城 - 购买 NAS、网络交换机、内存等产品',
    keywords: seo.homeKeywords,
    openGraph: {
      title: seo.homeTitle,
      description: seo.homeDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
