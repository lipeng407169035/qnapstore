'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { CheckCircle2 } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  serial: string;
  purchaseDate: string;
  issue: string;
  status: string;
  notes: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
};

export default function WarrantyPage() {
  const [tab, setTab] = useState<'submit' | 'my'>('submit');
  const [form, setForm] = useState({ name: '', phone: '', email: '', product: '', serial: '', purchaseDate: '', issue: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mySubs, setMySubs] = useState<Submission[]>([]);
  const [lookupPhone, setLookupPhone] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(k: string, v: string) { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: '' }); }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = '请填写姓名';
    if (!form.phone.trim()) errs.phone = '请填写手机号';
    if (!form.product.trim()) errs.product = '请填写产品型号';
    if (!form.issue.trim()) errs.issue = '请填写故障描述';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/warranty/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); setForm({ name: '', phone: '', email: '', product: '', serial: '', purchaseDate: '', issue: '' }); }
      else toast.error('提交失败');
    } catch { toast.error('网络错误'); }
    setSubmitting(false);
  }

  function lookupMySubs() {
    if (!lookupPhone.trim()) return;
    setLoading(true);
    fetch(`/api/warranty/my-submissions?phone=${lookupPhone}`)
      .then(r => r.json())
      .then(data => { setMySubs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">质保服务</h1>
          <p className="text-white/60 text-sm">申请质保服务，查询提交记录</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="flex gap-2 mb-6">
          {[{ key: 'submit', label: '提交申请' }, { key: 'my', label: '我的提交' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'submit' ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-green-700">提交成功！</p>
                <p className="text-sm text-green-600 mt-1">我们将尽快与您联系，请保持电话畅通</p>
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓名 *</label>
                  <input value={form.name} onChange={e => updateField('name', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.name ? 'border-red-500' : ''}`} placeholder="您的姓名" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">手机号 *</label>
                  <input value={form.phone} onChange={e => updateField('phone', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.phone ? 'border-red-500' : ''}`} placeholder="联系电话" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">邮箱</label>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="可选" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">产品型号 *</label>
                  <input value={form.product} onChange={e => updateField('product', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.product ? 'border-red-500' : ''}`} placeholder="如：TS-464" />
                  {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">序列号</label>
                  <input value={form.serial} onChange={e => updateField('serial', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="产品序列号" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">购买日期</label>
                <input type="date" value={form.purchaseDate} onChange={e => updateField('purchaseDate', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">故障描述 *</label>
                <textarea value={form.issue} onChange={e => updateField('issue', e.target.value)} rows={4} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.issue ? 'border-red-500' : ''}`} placeholder="请详细描述您遇到的问题..." />
                {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue/90 disabled:opacity-50 transition-colors">
                {submitting ? '提交中...' : '提交申请'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex gap-3 mb-5">
              <input value={lookupPhone} onChange={e => setLookupPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupMySubs()} placeholder="输入手机号查询" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <button onClick={lookupMySubs} className="bg-blue text-white px-5 py-2 rounded-lg text-sm font-medium">查询</button>
            </div>
            {loading ? <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue border-t-transparent mx-auto" /></div>
             : mySubs.length === 0 && lookupPhone ? <div className="text-center py-8 text-gray-400">未找到提交记录</div>
             : <div className="space-y-4">
                {mySubs.map(s => (
                  <div key={s.id} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{s.product}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(s.createdAt).toLocaleString('zh-CN')}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[s.status]?.color || 'bg-gray-100'}`}>
                        {STATUS_MAP[s.status]?.label || s.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{s.issue}</p>
                    {s.notes && <p className="text-xs text-blue-600 mt-2 bg-blue-50 rounded px-2 py-1">处理备注：{s.notes}</p>}
                  </div>
                ))}
              </div>
            }
          </div>
        )}
      </div>
    </>
  );
}
