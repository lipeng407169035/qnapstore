'use client';

import { adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from 'react';

interface Submission {
  id: string; name: string; phone: string; email: string;
  product: string; serial: string; purchaseDate: string; issue: string;
  status: string; notes: string; createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
};

export default function AdminWarrantyPage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState<Submission | null>(null);
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => { fetchSubs(); }, [statusFilter]);

  function fetchSubs() {
    setLoading(true);
    const url = statusFilter ? `/api/admin/warranty-submissions?status=${statusFilter}` : '/api/admin/warranty-submissions';
    adminFetch(url).then(r => r.json()).then(data => { setSubs(Array.isArray(data) ? data : (data.data || [])); setLoading(false); }).catch(() => setLoading(false));
  }

  async function handleUpdate() {
    if (!detail) return;
    await adminFetch(`/api/admin/warranty-submissions/${detail.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    setDetail(null);
    fetchSubs();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">质保申请管理</h1>
        <div className="flex gap-2">
          {['', 'pending', 'processing', 'completed'].map(s => (
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
                  <th className="pb-3 font-medium">申请人</th>
                  <th className="pb-3 font-medium">产品</th>
                  <th className="pb-3 font-medium">联系方式</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">提交时间</th>
                  <th className="pb-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-xs">{s.product}{s.serial && <span className="text-gray-400 ml-1">({s.serial})</span>}</td>
                    <td className="py-3 text-xs"><div>{s.phone}</div><div className="text-gray-400">{s.email}</div></td>
                    <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[s.status]?.color || 'bg-gray-100'}`}>{STATUS_MAP[s.status]?.label}</span></td>
                    <td className="py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleString('zh-CN')}</td>
                    <td className="py-3 text-right"><button onClick={() => { setDetail(s); setNotes(s.notes || ''); setNewStatus(s.status); }} className="text-blue hover:underline text-sm">处理</button></td>
                  </tr>
                ))}
                {subs.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-400">暂无记录</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="font-bold text-lg mb-4">处理质保申请</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-400">姓名：</span>{detail.name}</div>
                <div><span className="text-gray-400">电话：</span>{detail.phone}</div>
                <div><span className="text-gray-400">产品：</span>{detail.product}</div>
                <div><span className="text-gray-400">序列号：</span>{detail.serial || '-'}</div>
                <div><span className="text-gray-400">购买日期：</span>{detail.purchaseDate || '-'}</div>
              </div>
              <div><span className="text-gray-400">故障描述：</span><p className="mt-1 bg-gray-50 rounded p-2">{detail.issue}</p></div>
              {detail.notes && <div><span className="text-gray-400">处理备注：</span>{detail.notes}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">处理状态</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">处理备注</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="填写处理说明..." />
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
