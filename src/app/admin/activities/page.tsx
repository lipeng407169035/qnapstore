'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface Activity {
  id: string;
  name: string;
  type: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  active: boolean;
  createdAt: string;
}

const TYPE_OPTIONS = [
  { value: 'flash_sale', label: '限時特賣' },
  { value: 'discount', label: '全站折扣' },
  { value: 'bundle', label: '捆綁銷售' },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState({
    name: '', type: 'flash_sale', discountValue: 10,
    startDate: '', endDate: '', productIds: [] as string[], active: true,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/activities').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
    ]).then(([acts, prods]) => {
      setActivities(acts);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', type: 'flash_sale', discountValue: 10, startDate: '', endDate: '', productIds: [], active: true });
    setModalOpen(true);
  };

  const openEdit = (act: Activity) => {
    setEditing(act);
    setForm({
      name: act.name, type: act.type, discountValue: act.discountValue,
      startDate: act.startDate, endDate: act.endDate, productIds: act.productIds, active: act.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const url = editing ? `/api/admin/activities/${editing.id}` : '/api/admin/activities';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (editing) {
      setActivities(prev => prev.map(a => a.id === data.id ? data : a));
    } else {
      setActivities(prev => [...prev, data]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此活動？')) return;
    await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' });
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const toggleActive = async (act: Activity) => {
    const res = await fetch(`/api/admin/activities/${act.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...act, active: !act.active }),
    });
    const data = await res.json();
    setActivities(prev => prev.map(a => a.id === data.id ? data : a));
  };

  if (loading) return <div className="text-center py-20">載入中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活動管理</h1>
        <button onClick={openNew} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
          + 新增活動
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {activities.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-400">
            尚無活動，新增一個限時特賣吧！
          </div>
        )}
        {activities.map(act => (
          <div key={act.id} className={`bg-white rounded-2xl p-5 border-2 ${act.active ? 'border-green-200' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{act.name}</h3>
                <span className="text-xs text-gray-400">
                  {TYPE_OPTIONS.find(t => t.value === act.type)?.label || act.type}
                </span>
              </div>
              <button
                onClick={() => toggleActive(act)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${act.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {act.active ? '進行中' : '已停用'}
              </button>
            </div>
            <div className="text-3xl font-bold text-orange mb-2">
              {act.type === 'percentage' || act.type === 'flash_sale' ? `${act.discountValue}%` : `NT$ ${act.discountValue}`}
              <span className="text-sm text-gray-400 font-normal ml-1">優惠</span>
            </div>
            <div className="text-xs text-gray-400 space-y-0.5 mb-4">
              {act.startDate && <p>開始：{act.startDate}</p>}
              {act.endDate && <p>結束：{act.endDate}</p>}
              <p>商品：{act.productIds.length} 項</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(act)} className="flex-1 bg-blue text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-dark">
                編輯
              </button>
              <button onClick={() => handleDelete(act.id)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-red-500 hover:bg-red-50">
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? '編輯活動' : '新增活動'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">活動名稱</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm" placeholder="如：春季限時特賣 8 折" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">活動類型</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm">
                    {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">折扣值</label>
                  <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">開始時間</label>
                  <input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">結束時間</label>
                  <input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">參與商品</label>
                <div className="max-h-40 overflow-y-auto border rounded-xl p-3 space-y-1">
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                      <input type="checkbox" checked={form.productIds.includes(p.id)}
                        onChange={e => {
                          if (e.target.checked) setForm({ ...form, productIds: [...form.productIds, p.id] });
                          else setForm({ ...form, productIds: form.productIds.filter(id => id !== p.id) });
                        }}
                        className="accent-blue" />
                      <span className="text-sm">{p.sku} - {p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-blue" />
                <span className="text-sm">活動啟用</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">
                  {editing ? '儲存修改' : '建立活動'}
                </button>
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
