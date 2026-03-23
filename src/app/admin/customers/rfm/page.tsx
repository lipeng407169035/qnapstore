'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';

export default function RFMPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/customers/rfm').then(r => r.json()).then(data => {
      setCustomers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const tagColors: Record<string, string> = {
    '高价值客户': 'bg-red-50 text-red-700 border border-red-200',
    '潜力客户': 'bg-green-50 text-green-700 border border-green-200',
    '忠诚客户': 'bg-blue-50 text-blue-700 border border-blue-200',
    '流失风险': 'bg-orange-50 text-orange-700 border border-orange-200',
    '普通客户': 'bg-gray-50 text-gray-600 border border-gray-200',
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  const stats = {
    highValue: customers.filter(c => c.tag === '高价值客户').length,
    potential: customers.filter(c => c.tag === '潜力客户').length,
    loyal: customers.filter(c => c.tag === '忠诚客户').length,
    risk: customers.filter(c => c.tag === '流失风险').length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">RFM 客户分析</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-3xl font-bold text-red-600">{stats.highValue}</p>
          <p className="text-sm text-red-500">高价值客户</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-3xl font-bold text-green-600">{stats.potential}</p>
          <p className="text-sm text-green-500">潜力客户</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-3xl font-bold text-blue-600">{stats.loyal}</p>
          <p className="text-sm text-blue-500">忠诚客户</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <p className="text-3xl font-bold text-orange-600">{stats.risk}</p>
          <p className="text-sm text-orange-500">流失风险</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">客户分层详情</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">客户</th>
                <th className="pb-3">标签</th>
                <th className="pb-3">R(最近)</th>
                <th className="pb-3">F(频率)</th>
                <th className="pb-3">M(金额)</th>
                <th className="pb-3">RFM总分</th>
                <th className="pb-3">累计消费</th>
                <th className="pb-3">最近下单</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3">{c.name}<br/><span className="text-xs text-gray-400">{c.phone}</span></td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tagColors[c.tag] || ''}`}>{c.tag}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.recencyScore >= 4 ? 'bg-green-100 text-green-700' : c.recencyScore <= 2 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{c.recencyScore}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.frequencyScore >= 4 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{c.frequencyScore}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.monetaryScore >= 4 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{c.monetaryScore}</span>
                  </td>
                  <td className="py-3 font-bold text-blue">{c.rfmScore}</td>
                  <td className="py-3 font-semibold">¥ {c.totalSpent.toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-500">{c.daysSinceLastOrder !== 999 ? `${c.daysSinceLastOrder}天前` : '从未下单'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
