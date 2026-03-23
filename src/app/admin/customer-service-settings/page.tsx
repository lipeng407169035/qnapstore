'use client';

import { adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/Toast';

export default function AdminCustomerServiceSettingsPage() {
  const [form, setForm] = useState({ phone: '', email: '', address: '', workHours: '', wechat: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch('/api/admin/settings/customer-service-info')
      .then(r => r.json())
      .then(data => setForm(data))
      .catch(() => toast.error('加载失败，请重试'));
  }, []);

  async function handleSave() {
    setSaving(true);
    await adminFetch('/api/admin/settings/customer-service-info', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    toast.success('保存成功');
  }

  function update(k: string, v: string) { setForm({ ...form, [k]: v }); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">客服设置</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">客服热线</label>
            <input value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="400-888-3600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">电子邮箱</label>
            <input value={form.email} onChange={e => update('email', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="support_cn@qnap.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">公司地址</label>
            <input value={form.address} onChange={e => update('address', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="上海市浦东新区..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">服务时间</label>
            <input value={form.workHours} onChange={e => update('workHours', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="周一至周五 09:00-18:00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">微信公众号</label>
            <input value={form.wechat} onChange={e => update('wechat', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="QNAP-CN" />
          </div>
        </div>
      </div>
    </div>
  );
}
