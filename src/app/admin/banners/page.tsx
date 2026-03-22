'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  btnText: string;
  link: string;
  gradient: string;
  active: boolean;
  sort: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Banner>>({});

  useEffect(() => {
    fetch('/api/admin/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    setFormData({
      title: '',
      subtitle: '',
      btnText: '立即购买',
      link: '/products',
      gradient: 'linear-gradient(135deg, #1d3557 0%, #006ebd 100%)',
      active: true,
    });
    setIsEditing(true);
  };

  const handleEdit = (banner: Banner) => {
    setFormData(banner);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (formData.id) {
      await fetch(`/api/admin/banners/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setBanners(banners.map(b => b.id === formData.id ? { ...b, ...formData } as Banner : b));
    } else {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newBanner = await res.json();
      setBanners([...banners, newBanner]);
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此轮播图吗？')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    setBanners(banners.filter(b => b.id !== id));
  };

  const gradients = [
    'linear-gradient(135deg, #1d3557 0%, #006ebd 100%)',
    'linear-gradient(135deg, #0d2a0d 0%, #0a7c3e 100%)',
    'linear-gradient(135deg, #1d3557 0%, #4a0080 100%)',
    'linear-gradient(135deg, #0d2137 0%, #006ebd 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
  ];

  if (loading) return <div className="text-center py-20">載入中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">首页轮播图管理</h1>
        <button onClick={handleAdd} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
          + 新增轮播图
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-32" style={{ background: banner.gradient }}>
              <div className="h-full flex items-center justify-center text-white p-4 text-center">
                <div>
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-xs opacity-80 mt-1">{banner.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {banner.active ? '启用' : '停用'}
                </span>
                <span className="text-xs text-gray-400">排序: {banner.sort}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">链接: {banner.link}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(banner)} className="flex-1 text-blue text-sm hover:underline">编辑</button>
                <button onClick={() => handleDelete(banner.id)} className="flex-1 text-red-500 text-sm hover:underline">删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{formData.id ? '编辑轮播图' : '新增轮播图'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">标题</label>
                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">副标题</label>
                <textarea value={formData.subtitle || ''} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" rows={2} />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">按钮文字</label>
                <input type="text" value={formData.btnText || ''} onChange={(e) => setFormData({...formData, btnText: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">链接网址</label>
                <input type="text" value={formData.link || ''} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">背景颜色</label>
                <select value={formData.gradient || ''} onChange={(e) => setFormData({...formData, gradient: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm">
                  {gradients.map((g, i) => (
                    <option key={i} value={g}>{g.substring(0, 50)}...</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">排序</label>
                <input type="number" value={formData.sort || 1} onChange={(e) => setFormData({...formData, sort: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.active !== false} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                <label className="text-sm">启用</label>
              </div>
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
