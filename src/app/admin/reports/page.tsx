'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { SalesReport } from '@/types';

export default function AdminReportsPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadReport = (start?: string, end?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const query = params.toString() ? `?${params.toString()}` : '';
    fetch(`/api/admin/reports/sales${query}`)
      .then(r => r.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  };

  useEffect(() => { loadReport(); }, []);

  if (loading || !report) return <div className="text-center py-20">加载中...</div>;

  const revenueData = report.revenueByDay.map(([day, revenue]) => ({ day: day.slice(5), revenue }));
  const ordersData = report.revenueByDay.map(([day]) => ({ day: day.slice(5), count: report.ordersByDay.find(([d]: any) => d === day)?.[1] || 0 }));
  const categoryData = Object.entries(report.revenueByCategory).map(([name, value]) => ({ name, value }));
  const PAYMENT_COLORS = ['#006ebd', '#f7941d', '#10b981', '#8b5cf6', '#ef4444'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">销售报表</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-4">筛选日期范围</h2>
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="text-sm text-gray-500 block mb-1">开始日期</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-4 py-2 border rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">结束日期</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-4 py-2 border rounded-xl text-sm" />
          </div>
          <button onClick={() => loadReport(startDate, endDate)} className="bg-blue text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-dark">查询</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">总营收</p>
          <p className="text-2xl font-bold mt-1">¥ {report.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">总订单数</p>
          <p className="text-2xl font-bold mt-1">{report.totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">客单价</p>
          <p className="text-2xl font-bold mt-1">¥ {report.avgOrderValue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-white/80">商品种类</p>
          <p className="text-2xl font-bold mt-1">{report.topProducts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">每日营收趋势</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `¥${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip formatter={(v: any) => [`¥ ${Number(v).toLocaleString()}`, '营收']} />
                <Line type="monotone" dataKey="revenue" stroke="#006ebd" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-64 flex items-center justify-center text-gray-400">暂无数据</div>}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">品类营收占比</h2>
          {categoryData.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                    {categoryData.map((_: any, i: number) => <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`¥ ${Number(v).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map((entry: any, i: number) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: PAYMENT_COLORS[i % PAYMENT_COLORS.length] }} />
                    <span className="text-gray-600">{entry.name}</span>
                    <span className="ml-auto font-bold">¥ {entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="h-64 flex items-center justify-center text-gray-400">暂无数据</div>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">热销商品 TOP 10</h2>
        <div className="space-y-3">
          {report.topProducts.map((p: any, i: number) => (
            <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-200 text-gray-600'
              }`}>{i + 1}</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-400">销量 {p.quantity} 件</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange">¥ {p.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
