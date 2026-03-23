'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { toast } from '@/components/ui/Toast';
import { X } from 'lucide-react';

interface FullReduction {
  id: string;
  name: string;
  threshold: number;
  discount: number;
  type: 'fixed' | 'percentage';
  startDate: string;
  endDate: string;
  active: boolean;
}

export default function AdminFullReductionsPage() {
  const [activities, setActivities] = useState<FullReduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FullReduction | null>(null);
  const [form, setForm] = useState({ name: '', threshold: 0, discount: 0, type: 'fixed' as 'fixed' | 'percentage', startDate: '', endDate: '', active: true });

  const loadActivities = () => {
    adminFetch('/api/admin/full-reductions')
      .then(r => r.json())
      .then(data => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadActivities(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', threshold: 0, discount: 0, type: 'fixed', startDate: '', endDate: '', active: true });
    setModalOpen(true);
  };

  const openEdit = (a: FullReduction) => {
    setEditing(a);
    setForm({ name: a.name, threshold: a.threshold, discount: a.discount, type: a.type, startDate: a.startDate || '', endDate: a.endDate || '', active: a.active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.warning('请填写活动名称'); return; }
    if (form.discount <= 0) { toast.warning('减免金额必须大于0'); return; }

    try {
      if (editing) {
        const res = await adminFetch(`/api/admin/full-reductions/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setActivities(prev => prev.map(a => a.id === editing.id ? updated : a));
      } else {
        const res = await adminFetch('/api/admin/full-reductions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setActivities(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch { toast.error('保存失败，请稍后再试'); }
  };

  const handleToggle = async (a: FullReduction) => {
    try {
      const res = await adminFetch(`/api/admin/full-reductions/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...a, active: !a.active }),
      });
      const updated = await res.json();
      setActivities(prev => prev.map(act => act.id === a.id ? updated : act));
    } catch { toast.error('操作失败'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此活动？')) return;
    try {
      await adminFetch(`/api/admin/full-reductions/${id}`, { method: 'DELETE' });
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch { toast.error('删除失败'); }
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">满减活动管理</h1>
        <button onClick={openNew} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">+ 新增活动</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activities.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-400">暂无满减活动，创建第一个吧！</div>
        )}
        {activities.map(act => (
          <div key={act.id} className={`bg-white rounded-2xl p-5 border-2 ${act.active ? 'border-green-200' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">{act.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${act.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{act.active ? '进行中' : '已停用'}</span>
            </div>
            <div className="text-3xl font-bold text-orange mb-2">
              {act.type === 'percentage' ? `${act.discount}%` : `¥${act.discount}`}
              <span className="text-sm text-gray-400 font-normal ml-1">减免</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">满 ¥{act.threshold} 可用</p>
            {act.startDate && <p className="text-xs text-gray-400">{act.startDate} ~ {act.endDate}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(act)} className="flex-1 bg-blue text-white py-2 rounded-xl text-sm">编辑</button>
              <button onClick={() => handleToggle(act)} className="px-4 py-2 border rounded-xl text-sm">{act.active ? '停用' : '启用'}</button>
              <button onClick={() => handleDelete(act.id)} className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm">删除</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? '编辑满减活动' : '新增满减活动'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">活动名称</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" placeholder="如：满300减30" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">优惠类型</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'fixed' | 'percentage'})} className="w-full px-4 py-2.5 border rounded-xl text-sm">
                  <option value="fixed">满减（固定金额）</option>
                  <option value="percentage">折扣（百分比）</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">满多少（¥）</label>
                  <input type="number" value={form.threshold} onChange={e => setForm({...form, threshold: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">{form.type === 'percentage' ? '折扣率（%）' : '减多少（¥）'}</label>
                  <input type="number" value={form.discount} onChange={e => setForm({...form, discount: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">开始时间</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">结束时间</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">{editing ? '保存' : '创建'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
