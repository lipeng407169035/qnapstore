'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const milestones = [
    { year: '2004', text: 'QNAP 成立，专注网络存储技术' },
    { year: '2006', text: '推出首款 NAS 产品，进军全球市场' },
    { year: '2010', text: '挂牌上市，资本额突破 10 亿' },
    { year: '2015', text: 'NAS 全球市占率前三，员工超过 1,500 人' },
    { year: '2018', text: '推出 QTS 4.4 操作系统，AI 智能管理' },
    { year: '2020', text: '推出 QuTS hero，ZFS 数据保护方案' },
    { year: '2023', text: '推出 QuTScloud 云端 NAS，实现混合云部署' },
    { year: '2025', text: 'AI NAS 智能存储，开创新世代数据管理' },
  ];

  const values = [
    { icon: '🏆', title: '品质优先', desc: '以最高标准打造每项产品，通过 ISO 9001 品质认证' },
    { icon: '🔒', title: '安全可信', desc: '军规级数据加密，保护用户数据安全是我们的核心使命' },
    { icon: '🌱', title: '永续创新', desc: '节能减碳设计，2025 年达成碳中和工厂认证' },
    { icon: '🤝', title: '伙伴共赢', desc: '与全球超过 3,000 家经销商建立长期合作关系' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">关于 QNAP</span>
          <h1 className="font-barlow text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            存储无界<br />智慧相随
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            QNAP 成立于 2004 年，专注于网络存储设备（NAS）、网络交换机及周边软硬件的研发与制造。
            二十年来，我们持续以创新技术，为全球超过 100 万企业与家庭用户，打造安全可靠的数据存储解决方案。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products"><Button variant="primary" size="lg">探索产品</Button></Link>
            <Link href="/contact"><Button variant="outline" size="lg">联系我们</Button></Link>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { num: '20+', label: '年专业经验' },
              { num: '100万+', label: '全球用户' },
              { num: '180+', label: '国家与地区' },
              { num: '3,000+', label: '合作经销商' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue mb-1">{item.num}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-barlow text-2xl md:text-3xl font-bold text-center mb-12">核心价值</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-barlow text-2xl md:text-3xl font-bold text-center mb-12">发展历程</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue/20" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm inline-block">
                      <span className="font-bold text-blue text-lg">{m.year}</span>
                      <p className="text-sm text-gray-600 mt-1">{m.text}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white text-sm font-bold flex-shrink-0 z-10 relative">
                    {i + 1}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue to-blue-dark text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-barlow text-2xl md:text-3xl font-bold mb-4">想了解更多 QNAP 的解决方案？</h2>
          <p className="text-white/70 mb-8">联系我们的专业团队，获得量身打造的存储建议</p>
          <Link href="/contact"><Button variant="primary" size="lg">联系业务团队</Button></Link>
        </div>
      </section>
    </>
  );
}
