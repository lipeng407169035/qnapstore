'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerServicePage() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings/customer-service-info')
      .then(r => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  const services = [
    { icon: '📦', title: '订单查询', desc: '查询订单状态、物流信息', href: '/order-lookup', color: 'from-blue-500 to-blue-600' },
    { icon: '🔄', title: '退换货政策', desc: '了解退换货流程与条件', href: '/rma', color: 'from-green-500 to-green-600' },
    { icon: '🛡️', title: '质保服务', desc: '申请质保、维修服务', href: '/warranty', color: 'from-purple-500 to-purple-600' },
    { icon: '🎧', title: '技术支持', desc: '提交技术支持工单', href: '/support', color: 'from-orange-500 to-orange-600' },
    { icon: '📥', title: '下载中心', desc: '驱动、手册、固件下载', href: '/downloads', color: 'from-red-500 to-red-600' },
    { icon: '❓', title: '常见问题', desc: 'FAQ 常见问题解答', href: '/faq', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-barlow text-3xl md:text-4xl font-extrabold mb-3">客户服务</h1>
          <p className="text-white/70">我们随时为您提供帮助</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {services.map(s => (
            <Link key={s.href} href={s.href}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-4 text-white`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="font-barlow text-xl font-bold mb-6 flex items-center gap-2">
            <span>📞</span> 联系方式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue mt-0.5">📞</span>
                <div>
                  <p className="text-sm text-gray-500">客服热线</p>
                  <p className="font-bold text-lg">{info.phone || '400-888-3600'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue mt-0.5">✉️</span>
                <div>
                  <p className="text-sm text-gray-500">电子邮箱</p>
                  <p className="font-medium">{info.email || 'support_cn@qnap.com'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue mt-0.5">💬</span>
                <div>
                  <p className="text-sm text-gray-500">微信公众号</p>
                  <p className="font-medium">{info.wechat || 'QNAP-CN'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue mt-0.5">🏢</span>
                <div>
                  <p className="text-sm text-gray-500">公司地址</p>
                  <p className="font-medium">{info.address || '上海市浦东新区张江高科技园区碧波路 690 号'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue mt-0.5">🕐</span>
                <div>
                  <p className="text-sm text-gray-500">服务时间</p>
                  <p className="font-medium">{info.workHours || '周一至周五 09:00-18:00（节假日除外）'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
