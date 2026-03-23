'use client';

import { adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from 'react';

interface App {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  tier: string;
  businessType: string;
  revenueScale: string;
  employeeCount: string;
  brandExp: string;
  customerTypes: string[];
  status: string;
  notes: string;
  createdAt: string;
  address?: string;
}

const TIER_COLORS: Record<string, string> = {
  silver: 'bg-gray-100 text-gray-700',
  gold: 'bg-yellow-100 text-yellow-700',
  platinum: 'bg-purple-100 text-purple-700',
};
const TIER_LABELS: Record<string, string> = {
  silver: '银级', gold: '金级', platinum: '白金',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};
const STATUS_LABELS: Record<string, string> = {
  pending: '待审核', approved: '已通过', rejected: '已拒绝',
};

export default function AdminPartnershipPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailApp, setDetailApp] = useState<App | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchApps(); }, [statusFilter]);

  function fetchApps() {
    setLoading(true);
    const url = statusFilter ? `/api/admin/partnership-applications?status=${statusFilter}` : '/api/admin/partnership-applications';
    adminFetch(url).then(r => r.json()).then(data => { setApps(data); setLoading(false); });
  }

  async function handleApprove(app: App) {
    await adminFetch(`/api/admin/partnership-applications/${app.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', notes }),
    });
    setDetailApp(null);
    fetchApps();
  }

  async function handleReject(app: App) {
    await adminFetch(`/api/admin/partnership-applications/${app.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', notes }),
    });
    setDetailApp(null);
    fetchApps();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">合作伙伴申请</h1>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {s === '' ? '全部' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {loading ? (
          <div className="text-center py-10 text-gray-400">加载中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="pb-3 font-medium">公司名称</th>
                  <th className="pb-3 font-medium">联系人</th>
                  <th className="pb-3 font-medium">合作等级</th>
                  <th className="pb-3 font-medium">业务类型</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">提交时间</th>
                  <th className="pb-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{app.company}</td>
                    <td className="py-3">
                      <div>{app.contact}</div>
                      <div className="text-xs text-gray-400">{app.phone}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${TIER_COLORS[app.tier] || 'bg-gray-100'}`}>
                        {TIER_LABELS[app.tier] || app.tier}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{app.businessType || '-'}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100'}`}>
                        {STATUS_LABELS[app.status] || app.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">{new Date(app.createdAt).toLocaleString('zh-CN')}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => { setDetailApp(app); setNotes(app.notes || ''); }} className="text-blue hover:underline text-sm">查看详情</button>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">暂无申请记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">申请详情</h2>
              <button onClick={() => setDetailApp(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">公司名称：</span>{detailApp.company}</div>
                <div><span className="text-gray-400">合作等级：</span><span className="font-bold">{TIER_LABELS[detailApp.tier] || detailApp.tier}</span></div>
                <div><span className="text-gray-400">联系人：</span>{detailApp.contact}</div>
                <div><span className="text-gray-400">业务类型：</span>{detailApp.businessType || '-'}</div>
                <div><span className="text-gray-400">联系电话：</span>{detailApp.phone}</div>
                <div><span className="text-gray-400">年营收：</span>{detailApp.revenueScale || '-'}</div>
                <div><span className="text-gray-400">邮箱：</span>{detailApp.email}</div>
                <div><span className="text-gray-400">员工人数：</span>{detailApp.employeeCount || '-'}</div>
                {detailApp.address && <div className="col-span-2"><span className="text-gray-400">地址：</span>{detailApp.address}</div>}
                <div className="col-span-2"><span className="text-gray-400">客户类型：</span>{detailApp.customerTypes?.join(' / ') || '-'}</div>
              </div>
              {detailApp.brandExp && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">代理品牌经验：</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3">{detailApp.brandExp}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400 mb-1">状态：<span className={`font-medium ${STATUS_COLORS[detailApp.status]?.split(' ')[1] || 'text-gray-700'}`}>{STATUS_LABELS[detailApp.status]}</span></p>
              </div>
              {detailApp.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium mb-1">审核备注</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="可选，填写审核备注" />
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handleApprove(detailApp)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600">审核通过</button>
                    <button onClick={() => handleReject(detailApp)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">拒绝申请</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
