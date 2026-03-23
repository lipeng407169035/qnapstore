'use client';
import { useState, useEffect } from 'react';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(data => {
      setCustomers(Array.isArray(data) ? data : (data.data || []));
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(c => {
    if (search && !c.name.includes(search) && !c.email.includes(search) && !c.phone.includes(search)) return false;
    if (levelFilter && c.level !== levelFilter) return false;
    return true;
  });

  const levelColors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-200 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    diamond: 'bg-blue-100 text-blue-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">客户管理</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-4 mb-4 flex-wrap">
          <input
            type="text" placeholder="搜索客户姓名/邮箱/电话..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm flex-1"
          />
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm">
            <option value="">全部等级</option>
            <option value="bronze">铜牌</option>
            <option value="silver">银牌</option>
            <option value="gold">金牌</option>
            <option value="diamond">钻石</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">客户</th>
                <th className="pb-3">联系方式</th>
                <th className="pb-3">等级</th>
                <th className="pb-3">订单数</th>
                <th className="pb-3">累计消费</th>
                <th className="pb-3">积分</th>
                <th className="pb-3">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3 text-sm text-gray-500">
                    <div>{c.email}</div>
                    <div>{c.phone}</div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${levelColors[c.level] || 'bg-gray-100'}`}>
                      {c.level === 'bronze' ? '铜牌' : c.level === 'silver' ? '银牌' : c.level === 'gold' ? '金牌' : c.level === 'diamond' ? '钻石' : c.level}
                    </span>
                  </td>
                  <td className="py-3">{c.totalOrders}</td>
                  <td className="py-3 font-semibold">¥ {c.totalSpent.toLocaleString()}</td>
                  <td className="py-3 text-orange font-semibold">{c.points}</td>
                  <td className="py-3 text-sm text-gray-500">{c.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
