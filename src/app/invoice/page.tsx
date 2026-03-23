'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store';
import { toast } from '@/components/ui/Toast';
import { Lightbulb, FileText, ClipboardList, Building2, Receipt } from 'lucide-react';

function InvoiceApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const { items } = useCartStore();
  
  const [form, setForm] = useState({
    orderNo: searchParams.get('orderNo') || '',
    type: '电子发票',
    title: user?.name || '',
    taxNo: '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orderNo || !form.email) {
      toast.warning('请填写订单编号和邮箱');
      return;
    }

    setSubmitting(true);
    try {
      const allOrders = JSON.parse(localStorage.getItem('qnap_orders') || '[]');
      const matchedOrder = allOrders.find((o: any) => o.orderNo === form.orderNo);
      const total = matchedOrder ? matchedOrder.total : 0;
      const res = await fetch('/api/invoice/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: total || 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        toast.error(data.error || '提交失败');
      }
    } catch {
      toast.error('提交失败，请稍后重试');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="mb-4 flex justify-center"><Receipt className="w-16 h-16 text-blue-light" /></div>
          <h2 className="text-2xl font-bold mb-2">发票申请已提交</h2>
          <p className="text-gray-500 mb-6">我们将在 1-3 个工作日内处理您的发票申请，开票成功后会将电子发票发送至您的邮箱。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/orders">
              <Button variant="blue">查看订单</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline">返回账户</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/account" className="text-blue hover:underline text-sm">← 返回账户</Link>
          <h1 className="text-2xl font-bold">申请发票</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" /> 支持<strong>电子发票</strong>和<strong>增值税专用发票</strong>两种类型。电子发票将发送至您提供的邮箱，专用发票需提供完整税号信息。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">订单编号 *</label>
              <input
                type="text"
                value={form.orderNo}
                onChange={e => setForm({ ...form, orderNo: e.target.value })}
                placeholder="请输入需要开票的订单编号"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">发票类型</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '电子发票', label: '电子发票', desc: '个人/无需报销', Icon: FileText },
                  { value: '增值税普通发票', label: '增值税普通发票', desc: '企业可报销', Icon: ClipboardList },
                  { value: '增值税专用发票', label: '增值税专用发票', desc: '企业可抵扣', Icon: Building2 },
                ].map(opt => (
                  <label key={opt.value} className={`border rounded-xl p-3 cursor-pointer transition-all ${form.type === opt.value ? 'border-blue bg-blue-50 ring-2 ring-blue' : 'border-gray-200 hover:border-blue'}`}>
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={form.type === opt.value}
                      onChange={() => setForm({ ...form, type: opt.value })}
                      className="sr-only"
                    />
                    <p className="text-sm font-medium flex items-center gap-2">{opt.Icon && <opt.Icon className="w-4 h-4" />}{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">发票抬头 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="个人姓名或公司名称"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                required
              />
            </div>

            {form.type === '增值税专用发票' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">纳税人识别号（税号）*</label>
                <input
                  type="text"
                  value={form.taxNo}
                  onChange={e => setForm({ ...form, taxNo: e.target.value })}
                  placeholder="请输入18位统一社会信用代码"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                  maxLength={18}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">增值税专用发票需提供：营业执照、开户许可证、一般纳税人证明</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">接收邮箱 *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="用于接收电子发票"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">联系电话</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="用于发票问题联络"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? '提交中...' : '提交发票申请'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceApplyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">加载中...</div>}>
      <InvoiceApplyContent />
    </Suspense>
  );
}
