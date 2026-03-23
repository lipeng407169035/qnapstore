'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SkeletonStatCard } from '@/components/ui/Skeleton';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  DollarSign, TrendingUp, ShoppingCart, Package, Clock, Users,
  AlertTriangle, AlertCircle
} from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: any[];
  revenueByDay: Record<string, number>;
  ordersByStatus: Record<string, number>;
  topProducts: { id: string; sku: string; name: string; count: number; revenue: number }[];
  lowStockProducts: any[];
  outOfStockProducts: any[];
  stockAlertThreshold: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  completed: '#10b981',
  cancelled: '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => { setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <AdminBreadcrumb />
      <h1 className="text-2xl font-bold mb-6">控制台</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
    </div>
  );

  const pieData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus)
        .filter(([_, count]) => (count as number) > 0)
        .map(([status, count]) => ({
          name: STATUS_LABELS[status] || status,
          value: count as number,
          color: STATUS_COLORS[status] || '#6b7280',
        }))
    : [];

  const barData = stats?.revenueByDay
    ? Object.entries(stats.revenueByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, revenue]) => ({
          day: day.slice(5),
          revenue: revenue as number,
        }))
    : [];

  const statCards = [
    { label: '总营收', value: `¥ ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-orange-400 to-orange-600' },
    { label: '本月营收', value: `¥ ${(stats?.monthlyRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'from-green-400 to-green-600' },
    { label: '总订单', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-blue-400 to-blue-600' },
    { label: '本月订单', value: stats?.monthlyOrders || 0, icon: Package, color: 'from-purple-400 to-purple-600' },
    { label: '待处理', value: stats?.pendingOrders || 0, icon: Clock, color: 'from-yellow-400 to-yellow-600' },
    { label: '总用户', value: stats?.totalUsers || 0, icon: Users, color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div>
      <AdminBreadcrumb />
      <h1 className="text-2xl font-bold mb-6">控制台</h1>

      {/* Low Stock Alert */}
      {stats && ((stats.lowStockProducts?.length ?? 0) > 0 || (stats.outOfStockProducts?.length ?? 0) > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2">库存预警</h3>
              {(stats.outOfStockProducts?.length ?? 0) > 0 && (
                <p className="text-red-600 text-sm mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  缺货商品：{(stats.outOfStockProducts ?? []).map((p: any) => p.sku).join('、')}
                </p>
              )}
              {(stats.lowStockProducts?.length ?? 0) > 0 && (
                <p className="text-orange-600 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  低库存（≤ {stats.stockAlertThreshold} 件）：{(stats.lowStockProducts ?? []).map((p: any) => `${p.sku}(${p.stock})`).join('、')}
                </p>
              )}
            </div>
            <Link href="/admin/products" className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 whitespace-nowrap">
              处理库存
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-white/80">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">近30天每日营收</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip formatter={(v) => [`¥ ${Number(v).toLocaleString()}`, '营收']} />
                <Bar dataKey="revenue" fill="#006ebd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">暂无数据</div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">订单状态分布</h2>
          {pieData.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                    <span className="text-gray-600">{entry.name}</span>
                    <span className="ml-auto font-bold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">暂无数据</div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">热销商品 TOP 10</h2>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {stats.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.count} 件 · {p.sku}</p>
                  </div>
                  <div className="text-xs font-bold text-orange whitespace-nowrap">¥ {(p.revenue / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">暂无数据</div>
          )}
        </div>
      </div>

      {stats && stats.pendingOrders > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-orange-800">有待处理订单</h3>
              <p className="text-orange-600">目前有 {stats.pendingOrders} 笔订单等待处理</p>
            </div>
            <Link href="/admin/orders?status=pending" className="bg-orange text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-dark">
              查看详情
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">最近订单</h2>
          <Link href="/admin/orders" className="text-blue text-sm hover:underline">查看全部 →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">订单编号</th>
                <th className="pb-3 font-medium">客户</th>
                <th className="pb-3 font-medium">金额</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">日期</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-sm">{order.orderNo}</td>
                  <td className="py-3">{order.shippingName}</td>
                  <td className="py-3 font-semibold">¥ {order.total.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">暂无订单</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
