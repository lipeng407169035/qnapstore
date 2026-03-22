'use client';
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'operator', phone: '' });

  useEffect(() => {
    fetch('/api/admin/staff').then(r => r.json()).then(data => {
      setStaff(data);
      setLoading(false);
    });
  }, []);

  const roleLabels: Record<string, string> = {
    admin: '管理员',
    operator: '运营',
    support: '客服',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    operator: 'bg-blue-100 text-blue-700',
    support: 'bg-green-100 text-green-700',
  };

  const handleSave = async () => {
    const res = await fetch('/api/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const newStaff = await res.json();
    setStaff([...staff, newStaff]);
    setModalOpen(false);
    setForm({ name: '', email: '', role: 'operator', phone: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该员工账号吗？')) return;
    await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
    setStaff(staff.filter(s => s.id !== id));
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">员工管理</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">+ 新增员工</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue rounded-full flex items-center justify-center text-white font-bold text-lg">{s.name.charAt(0)}</div>
              <div>
                <p className="font-bold">{s.name}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleColors[s.role] || 'bg-gray-100'}`}>{roleLabels[s.role] || s.role}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>邮箱：{s.email}</p>
              {s.phone && <p>电话：{s.phone}</p>}
              <p>创建时间：{s.createdAt}</p>
              <p>最后登录：{s.lastLogin || '从未登录'}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleDelete(s.id)} className="flex-1 text-red-500 text-sm border border-red-200 rounded-xl py-2 hover:bg-red-50">删除</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">新增员工</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">姓名</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">邮箱</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">角色</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm">
                  <option value="operator">运营</option>
                  <option value="support">客服</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">电话</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                初始密码为：123456，请提醒员工首次登录后修改密码
              </div>
              <button onClick={handleSave} className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">创建员工</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
