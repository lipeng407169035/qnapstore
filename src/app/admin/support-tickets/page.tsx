'use client';

import { useEffect, useState } from 'react';

interface Ticket {
  id: string; name: string; phone: string; email: string;
  product: string; subject: string; issueType: string; description: string;
  status: string; assignee: string; notes: string; createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  open: { label: '待处理', color: 'bg-red-100 text-red-700' },
  in_progress: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500' },
};
const STAFF = ['李客服', '张运营', '管理员'];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ status: '', assignee: '', notes: '' });

  useEffect(() => { fetchTickets(); }, [statusFilter]);

  function fetchTickets() {
    setLoading(true);
    const url = statusFilter ? `/api/admin/support-tickets?status=${statusFilter}` : '/api/admin/support-tickets';
    fetch(url).then(r => r.json()).then(data => { setTickets(Array.isArray(data) ? data : (data.data || [])); setLoading(false); });
  }

  async function handleUpdate() {
    if (!detail) return;
    await fetch(`/api/admin/support-tickets/${detail.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setDetail(null);
    fetchTickets();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">技术支持工单</h1>
        <div className="flex gap-2">
          {['', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === s ? 'bg-blue text-white' : 'bg-white border text-gray-600'}`}>
              {s === '' ? '全部' : STATUS_MAP[s]?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? <div className="text-center py-10 text-gray-400">加载中...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="pb-3 font-medium">主题</th>
                  <th className="pb-3 font-medium">联系人</th>
                  <th className="pb-3 font-medium">产品/类型</th>
                  <th className="pb-3 font-medium">处理人</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">提交时间</th>
                  <th className="pb-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium max-w-xs truncate">{t.subject}</td>
                    <td className="py-3 text-xs"><div>{t.name}</div><div className="text-gray-400">{t.phone}</div></td>
                    <td className="py-3 text-xs"><div>{t.product || '-'}</div><div className="text-gray-400">{t.issueType}</div></td>
                    <td className="py-3 text-xs">{t.assignee || <span className="text-gray-400">未分配</span>}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[t.status]?.color || 'bg-gray-100'}`}>{STATUS_MAP[t.status]?.label}</span></td>
                    <td className="py-3 text-gray-400 text-xs">{new Date(t.createdAt).toLocaleString('zh-CN')}</td>
                    <td className="py-3 text-right"><button onClick={() => { setDetail(t); setForm({ status: t.status, assignee: t.assignee || '', notes: t.notes || '' }); }} className="text-blue hover:underline text-sm">处理</button></td>
                  </tr>
                ))}
                {tickets.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-gray-400">暂无工单</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">处理工单</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="font-bold text-blue-600">{detail.subject}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">姓名：</span>{detail.name}</div>
                <div><span className="text-gray-400">电话：</span>{detail.phone}</div>
                <div><span className="text-gray-400">邮箱：</span>{detail.email}</div>
                <div><span className="text-gray-400">产品：</span>{detail.product || '-'}</div>
              </div>
              <div><span className="text-gray-400">问题类型：</span>{detail.issueType}</div>
              <div><span className="text-gray-400">问题描述：</span><p className="mt-1 bg-gray-50 rounded p-2">{detail.description}</p></div>
              {detail.notes && <div><span className="text-gray-400">处理记录：</span><p className="mt-1 bg-blue-50 rounded p-2 text-blue-700">{detail.notes}</p></div>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">状态</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">处理人</label>
                <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">未分配</option>
                  {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">处理回复</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="填写处理说明或回复..." />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDetail(null)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-medium">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
