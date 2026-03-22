'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const offices = [
    {
      city: '上海总部',
      icon: '🏢',
      address: '上海市浦东新区张江高科技园区科苑路88号',
      phone: '400-888-3600',
      fax: '021-2600-1918',
      hours: '周一至周五 09:00 - 18:00',
    },
    {
      city: '北京办事处',
      icon: '🏬',
      address: '北京市海淀区中关村大街1号 8楼',
      phone: '400-888-3600',
      fax: '010-3600-1918',
      hours: '周一至周五 09:00 - 18:00',
    },
    {
      city: '深圳办事处',
      icon: '🏗️',
      address: '深圳市南山区科技园南区高新南七道 12号 12楼',
      phone: '400-888-3600',
      fax: '0755-3600-1918',
      hours: '周一至周五 09:00 - 18:00',
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#1d3557] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-barlow text-3xl md:text-4xl font-extrabold mb-3">联系我们</h1>
          <p className="text-white/70">无论是产品咨询、技术支持或商务合作，我们随时为您服务</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="font-barlow text-xl font-bold mb-6">发送消息</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-xl mb-2">消息已发出！</h3>
                <p className="text-gray-500 mb-4">感谢您的来信，我们将在 <strong>1-2 个工作天</strong>内回复您</p>
                <button onClick={() => setSubmitted(false)} className="text-blue text-sm font-medium hover:underline">
                  再次询问
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">姓名 *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue" placeholder="王小明" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue" placeholder="example@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">电话</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue" placeholder="138-0000-0000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">咨询类型</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue">
                      <option value="">请选择</option>
                      <option>产品询价</option>
                      <option>技术支持</option>
                      <option>商务合作</option>
                      <option>经销代理</option>
                      <option>其他</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">消息内容 *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue resize-none" placeholder="请描述您的需求或问题..." />
                </div>
                <button type="submit" className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark transition-colors">
                  发送消息
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-barlow text-xl font-bold mb-6">各地办事处</h2>
            <div className="space-y-4 mb-8">
              {offices.map((o, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{o.icon}</span>
                    <h3 className="font-bold">{o.city}</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📍 {o.address}</p>
                    <p>📞 <a href={`tel:${o.phone}`} className="text-blue hover:underline">{o.phone}</a></p>
                    <p>📠 传真：{o.fax}</p>
                    <p>🕒 {o.hours}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="font-bold mb-3">快速联络</h3>
              <div className="space-y-2 text-sm">
                <p>📧 <a href="mailto:store@qnap.com" className="text-blue hover:underline">store@qnap.com</a> 网上商城</p>
                <p>📧 <a href="mailto:support@qnap.com" className="text-blue hover:underline">support@qnap.com</a> 技术支持</p>
                <p>📧 <a href="mailto:partner@qnap.com" className="text-blue hover:underline">partner@qnap.com</a> 商务合作</p>
                <p>📧 <a href="mailto:hr@qnap.com" className="text-blue hover:underline">hr@qnap.com</a> 人资招募</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
