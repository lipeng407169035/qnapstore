'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    adminFetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setFormData({
      name: '',
      slug: '',
      icon: '📦',
      desc: '',
      sort: categories.length + 1,
      active: true,
    });
    setIsEditing(true);
  };

  const handleEdit = (cat: Category) => {
    setFormData(cat);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (formData.id) {
      await adminFetch(`/api/admin/categories/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setCategories(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } as Category : c));
    } else {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newCat = await res.json();
      setCategories(prev => [...prev, newCat]);
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要停用此分类吗？')) return;
    await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: false } : c));
  };

  const icons = ['🗄️', '🏢', '🖥️', '🌐', '💾', '📡', '🔑', '🛡️', '🧠', '📦', '💿', '🔧'];

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">商品分类管理</h1>
        <button onClick={handleAdd} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
          + 新增分类
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-gray-500">排序</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">图标</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">分类名称</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">slug</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">说明</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">状态</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{cat.sort}</td>
                <td className="p-4 text-2xl">{cat.icon}</td>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 font-mono text-sm text-gray-500">{cat.slug}</td>
                <td className="p-4 text-sm text-gray-500">{cat.desc}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.active ? '启用' : '停用'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue text-sm hover:underline">编辑</button>
                    {cat.active && <button onClick={() => handleDelete(cat.id)} className="text-red-500 text-sm hover:underline">停用</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{formData.id ? '编辑分类' : '新增分类'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">分类名称</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">URL Slug</label>
                <input type="text" value={formData.slug || ''} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">图标</label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(icon => (
                    <button key={icon} type="button" onClick={() => setFormData({...formData, icon})} className={`w-10 h-10 rounded-lg text-xl ${formData.icon === icon ? 'bg-blue text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">说明</label>
                <textarea value={formData.desc || ''} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" rows={2} />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">排序</label>
                <input type="number" value={formData.sort || 1} onChange={(e) => setFormData({...formData, sort: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              {formData.id && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.active !== false} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                  <label className="text-sm">启用</label>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">保存</button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
