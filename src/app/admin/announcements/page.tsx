'use client';

import { useState, useEffect } from 'react';

interface Announcement {
  id: number;
  text: string;
  active: boolean;
  sort: number;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement>>({});

  useEffect(() => {
    fetch('/api/admin/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    setFormData({ text: '', active: true, sort: announcements.length + 1 });
    setIsEditing(true);
  };

  const handleEdit = (ann: Announcement) => {
    setFormData(ann);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.text?.trim()) {
      alert('请输入公告内容');
      return;
    }
    if (formData.id) {
      await fetch(`/api/admin/announcements/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setAnnouncements(announcements.map(a => a.id === formData.id ? { ...a, ...formData } as Announcement : a));
    } else {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newAnn = await res.json();
      setAnnouncements([...announcements, newAnn]);
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此公告吗？')) return;
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleToggle = async (ann: Announcement) => {
    const updated = { ...ann, active: !ann.active };
    await fetch(`/api/admin/announcements/${ann.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setAnnouncements(announcements.map(a => a.id === ann.id ? updated : a));
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <button onClick={handleAdd} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
          + 新增公告
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">排序</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">內容</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {announcements.map((ann) => (
              <tr key={ann.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{ann.sort}</td>
                <td className="px-6 py-4 text-sm">{ann.text}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(ann)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ann.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ann.active ? '启用' : '停用'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(ann)} className="text-blue text-sm hover:underline mr-4">编辑</button>
                  <button onClick={() => handleDelete(ann.id)} className="text-red-500 text-sm hover:underline">删除</button>
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
              <h2 className="text-xl font-bold">{formData.id ? '编辑公告' : '新增公告'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">公告内容</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                  rows={3}
                  placeholder="例如：🚚 全国包邮（订单满 NT$3,000）"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">排序</label>
                <input
                  type="number"
                  value={formData.sort || 1}
                  onChange={(e) => setFormData({...formData, sort: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active" className="text-sm">启用</label>
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
