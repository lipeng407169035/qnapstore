'use client';

import { useEffect, useState } from 'react';

interface FAQItem { id: number; category: string; question: string; answer: string; sortOrder: number; }

const CATEGORIES = ['产品使用', '订购配送', '售后', '其他'];

export default function AdminFAQPage() {
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<FAQItem>>({});

  useEffect(() => { fetchFaq(); }, []);

  function fetchFaq() {
    setLoading(true);
    fetch('/api/admin/faq').then(r => r.json()).then(data => { setFaq(data); setLoading(false); });
  }

  function openAdd() { setEditItem({ category: '产品使用', sortOrder: 1 }); setShowModal(true); }
  function openEdit(item: FAQItem) { setEditItem({ ...item }); setShowModal(true); }

  async function handleSave() {
    if (!editItem.question || !editItem.answer) return;
    const method = editItem.id ? 'PUT' : 'POST';
    const url = editItem.id ? `/api/admin/faq/${editItem.id}` : '/api/admin/faq';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) });
    setShowModal(false);
    fetchFaq();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    fetchFaq();
  }

  const grouped = faq.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">FAQ 管理</h1>
        <button onClick={openAdd} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90">+ 新增 FAQ</button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? <div className="text-center py-10 text-gray-400">加载中...</div> : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-6 last:mb-0">
              <h3 className="font-bold text-sm text-blue-600 mb-3">{cat}</h3>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.question}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.answer.replace(/<[^>]+>/g, '')}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEdit(item)} className="text-blue hover:underline text-sm">编辑</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-sm">删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="font-bold text-lg mb-4">{editItem.id ? '编辑 FAQ' : '新增 FAQ'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select value={editItem.category || '产品使用'} onChange={e => setEditItem({ ...editItem, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">问题 *</label>
                <input value={editItem.question || ''} onChange={e => setEditItem({ ...editItem, question: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">回答 *</label>
                <textarea value={editItem.answer || ''} onChange={e => setEditItem({ ...editItem, answer: e.target.value })} rows={5} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">排序</label>
                <input type="number" value={editItem.sortOrder || 1} onChange={e => setEditItem({ ...editItem, sortOrder: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-medium">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
