'use client';

import { adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  hot: boolean;
  active: boolean;
}

const CATEGORIES = ['产品发布', '企业动态', '合作伙伴', '优惠活动', '技术专栏', '产业趋势'];
const EMPTY_FORM: Partial<NewsItem> = {
  title: '', category: '产品发布', date: '', excerpt: '', content: '', image: '', hot: false, active: true,
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<NewsItem>>(EMPTY_FORM);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNews(); }, []);

  function fetchNews() {
    setLoading(true);
    adminFetch('/api/admin/news').then(r => r.json()).then(data => { setNews(Array.isArray(data) ? data : (data.data || [])); setLoading(false); }).catch(() => setLoading(false));
  }

  function openAdd() { setEditItem(EMPTY_FORM); setShowModal(true); }
  function openEdit(item: NewsItem) { setEditItem({ ...item }); setShowModal(true); }

  async function handleSave() {
    if (!editItem.title || !editItem.date) return;
    const method = editItem.id ? 'PUT' : 'POST';
    const url = editItem.id ? `/api/admin/news/${editItem.id}` : '/api/admin/news';
    await adminFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) });
    setShowModal(false);
    fetchNews();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除该新闻？')) return;
    await adminFetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    fetchNews();
  }

  const filtered = news.filter(n => n.title.includes(search) || n.category.includes(search));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">新闻管理</h1>
        <button onClick={openAdd} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90 transition-colors">
          + 新增新闻
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <input
          type="text"
          placeholder="搜索新闻标题..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm mb-4 w-64"
        />

        {loading ? (
          <div className="text-center py-10 text-gray-400">加载中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">标题</th>
                  <th className="pb-3 font-medium">分类</th>
                  <th className="pb-3 font-medium">日期</th>
                  <th className="pb-3 font-medium">热门</th>
                  <th className="pb-3 font-medium">发布</th>
                  <th className="pb-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 text-gray-400">{item.id}</td>
                    <td className="py-3 font-medium max-w-xs truncate">{item.title}</td>
                    <td className="py-3">
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">{item.category}</span>
                    </td>
                    <td className="py-3 text-gray-500">{item.date}</td>
                    <td className="py-3">{item.hot ? <span className="text-orange-500">是</span> : '否'}</td>
                    <td className="py-3">{item.active ? <span className="text-green-500">是</span> : <span className="text-gray-400">否</span>}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(item)} className="text-blue hover:underline mr-3">编辑</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">删除</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">暂无新闻</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">{editItem.id ? '编辑新闻' : '新增新闻'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">标题 *</label>
                <input value={editItem.title || ''} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">分类 *</label>
                <select value={editItem.category || '产品发布'} onChange={e => setEditItem({ ...editItem, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">日期 *</label>
                <input type="date" value={editItem.date || ''} onChange={e => setEditItem({ ...editItem, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">图片 URL</label>
                <input value={editItem.image || ''} onChange={e => setEditItem({ ...editItem, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">摘要</label>
                <textarea value={editItem.excerpt || ''} onChange={e => setEditItem({ ...editItem, excerpt: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">正文内容（HTML）</label>
                <textarea value={editItem.content || ''} onChange={e => setEditItem({ ...editItem, content: e.target.value })} rows={6} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editItem.hot || false} onChange={e => setEditItem({ ...editItem, hot: e.target.checked })} />
                  热门
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editItem.active !== false} onChange={e => setEditItem({ ...editItem, active: e.target.checked })} />
                  发布
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-medium hover:bg-blue/90">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
