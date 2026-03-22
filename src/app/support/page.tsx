'use client';

import { useEffect, useState } from 'react';

interface Ticket {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  subject: string;
  issueType: string;
  description: string;
  status: string;
  assignee: string;
  notes: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  open: { label: '待处理', color: 'bg-red-100 text-red-700' },
  in_progress: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500' },
};
const ISSUE_TYPES = ['网络问题', '软件问题', '硬件问题', '数据问题', '其他'];

export default function SupportPage() {
  const [tab, setTab] = useState<'submit' | 'my'>('submit');
  const [form, setForm] = useState({ name: '', phone: '', email: '', product: '', subject: '', issueType: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [lookupEmail, setLookupEmail] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(k: string, v: string) { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: '' }); }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = '请填写姓名';
    if (!form.phone.trim()) errs.phone = '请填写手机号';
    if (!form.subject.trim()) errs.subject = '请填写问题主题';
    if (!form.issueType) errs.issueType = '请选择问题类型';
    if (!form.description.trim()) errs.description = '请填写问题描述';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/support/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); setForm({ name: '', phone: '', email: '', product: '', subject: '', issueType: '', description: '' }); }
      else alert('提交失败');
    } catch { alert('网络错误'); }
    setSubmitting(false);
  }

  function lookupMyTickets() {
    if (!lookupEmail.trim()) return;
    setLoading(true);
    fetch(`/api/support/my-tickets?email=${lookupEmail}`)
      .then(r => r.json())
      .then(data => { setMyTickets(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">技术支持</h1>
          <p className="text-white/60 text-sm">提交技术支持工单，快速获得专业帮助</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="flex gap-2 mb-6">
          {[{ key: 'submit', label: '提交工单' }, { key: 'my', label: '我的工单' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'submit' ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-bold text-green-700">工单已提交！</p>
                <p className="text-sm text-green-600 mt-1">技术支持团队将在 24 小时内响应</p>
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
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="可选，用于查询工单" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">产品型号</label>
                <input value={form.product} onChange={e => updateField('product', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="如：TS-464" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">问题主题 *</label>
                <input value={form.subject} onChange={e => updateField('subject', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.subject ? 'border-red-500' : ''}`} placeholder="简要描述您的问题" />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">问题类型 *</label>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_TYPES.map(t => (
                    <button key={t} onClick={() => updateField('issueType', t)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.issueType === t ? 'bg-blue text-white border-blue' : 'border-gray-200 hover:border-blue'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                {errors.issueType && <p className="text-red-500 text-xs mt-1">{errors.issueType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">问题描述 *</label>
                <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={5} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.description ? 'border-red-500' : ''}`} placeholder="请详细描述您遇到的问题，包括操作步骤、错误信息等..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue/90 disabled:opacity-50 transition-colors">
                {submitting ? '提交中...' : '提交工单'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex gap-3 mb-5">
              <input value={lookupEmail} onChange={e => setLookupEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupMyTickets()} placeholder="输入邮箱查询工单" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <button onClick={lookupMyTickets} className="bg-blue text-white px-5 py-2 rounded-lg text-sm font-medium">查询</button>
            </div>
            {loading ? <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue border-t-transparent mx-auto" /></div>
             : myTickets.length === 0 && lookupEmail ? <div className="text-center py-8 text-gray-400">未找到工单记录</div>
             : <div className="space-y-4">
                {myTickets.map(t => (
                  <div key={t.id} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{t.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(t.createdAt).toLocaleString('zh-CN')}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[t.status]?.color || 'bg-gray-100'}`}>
                        {STATUS_MAP[t.status]?.label || t.status}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400 mb-2">
                      <span>{t.product || '未指定产品'}</span>
                      <span>·</span>
                      <span>{t.issueType}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{t.description}</p>
                    {t.notes && <p className="text-xs text-blue-600 mt-2 bg-blue-50 rounded px-2 py-1">处理回复：{t.notes}</p>}
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
