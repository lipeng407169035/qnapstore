'use client';
import { useState, useEffect } from 'react';
import { ShippingCompany } from '@/types';
import { toast } from '@/components/ui/Toast';

export default function AdminShippingPage() {
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/shipping-companies').then(r => r.json()).then(data => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/shipping-companies', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companies }) });
    setSaving(false);
    toast.success('保存成功！');
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">物流管理</h1>
        <button onClick={() => setCompanies([...companies, { id: `ship_${Date.now()}`, name: '', code: '', trackingUrl: '' }])} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">+ 添加物流</button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-3">
          {companies.map((c, i) => (
            <div key={c.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-3 border border-gray-200 rounded-xl">
              <div>
                <label className="text-xs text-gray-400 block mb-1">物流名称</label>
                <input value={c.name} onChange={e => { const updated = [...companies]; updated[i] = { ...updated[i], name: e.target.value }; setCompanies(updated); }} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="如：顺丰速运" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">代码</label>
                <input value={c.code} onChange={e => { const updated = [...companies]; updated[i] = { ...updated[i], code: e.target.value }; setCompanies(updated); }} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="如：SF" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-gray-400 block mb-1">查询链接</label>
                <input value={c.trackingUrl} onChange={e => { const updated = [...companies]; updated[i] = { ...updated[i], trackingUrl: e.target.value }; setCompanies(updated); }} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." />
              </div>
              <button onClick={() => setCompanies(companies.filter((_, j) => j !== i))} className="text-red-500 text-sm hover:underline self-end mb-1">删除</button>
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-4 bg-blue text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-dark disabled:opacity-50">
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
}
