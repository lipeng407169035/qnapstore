'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';

export default function AdminAuditLogsPage() {
  const [data, setData] = useState<{ logs: any[]; total: number; page: number }>({ logs: [], total: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');

  const load = (page = 1, action?: string, target?: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (action) params.set('action', action);
    if (target) params.set('target', target);
    adminFetch(`/api/admin/audit-logs?${params}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const actionColors: Record<string, string> = {
    '创建': 'bg-green-100 text-green-700',
    '修改': 'bg-blue-100 text-blue-700',
    '删除': 'bg-red-100 text-red-700',
    '调整': 'bg-orange-100 text-orange-700',
    '登录': 'bg-purple-100 text-purple-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">操作日志</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-3 mb-4 flex-wrap">
          <select value={targetFilter} onChange={e => { setTargetFilter(e.target.value); load(1, actionFilter, e.target.value); }} className="px-4 py-2 border rounded-xl text-sm">
            <option value="">全部模块</option>
            <option value="商品">商品</option>
            <option value="订单">订单</option>
            <option value="优惠活动">优惠活动</option>
            <option value="库存">库存</option>
            <option value="员工">员工</option>
          </select>
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); load(1, e.target.value, targetFilter); }} className="px-4 py-2 border rounded-xl text-sm">
            <option value="">全部操作</option>
            <option value="创建">创建</option>
            <option value="修改">修改</option>
            <option value="删除">删除</option>
            <option value="调整">调整</option>
            <option value="登录">登录</option>
          </select>
        </div>

        <div className="space-y-2">
          {data.logs.map(log => (
            <div key={log.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl border border-gray-100">
              <span className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${actionColors[log.action] || 'bg-gray-100'}`}>{log.action}</span>
              <span className="text-sm text-gray-500 flex-shrink-0">{log.target}</span>
              <span className="flex-1 text-sm font-medium">{log.targetName}</span>
              <span className="text-xs text-gray-400">{log.staffName}</span>
              <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString('zh-CN')}</span>
            </div>
          ))}
          {data.logs.length === 0 && <div className="text-center py-12 text-gray-400">暂无操作记录</div>}
        </div>

        {data.total > 20 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(data.total / 20) }, (_, i) => (
              <button key={i} onClick={() => load(i + 1, actionFilter, targetFilter)}
                className={`w-9 h-9 rounded-lg text-sm ${data.page === i + 1 ? 'bg-blue text-white' : 'border hover:bg-gray-50'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
