'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Order {
  id: string;
  orderNo: string;
  userId: string;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: any[];
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', String(page));
    params.set('limit', String(limit));
    const query = params.toString() ? `?${params.toString()}` : '';
    adminFetch(`/api/admin/orders${query}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : (data.data || []));
        setTotal(Array.isArray(data) ? data.length : (data.total || 0));
        setLoading(false);
      });
  }, [statusFilter, searchQuery, page]);

  const totalPages = Math.ceil(total / limit);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await adminFetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setSelectedOrder(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待处理' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', label: '已发货' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: '已完成' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: '已取消' },
    };
    const s = statusMap[status] || statusMap.pending;
    return <span className={`${s.bg} ${s.text} px-3 py-1 rounded-full text-xs font-bold`}>{s.label}</span>;
  };

  const getPaymentBadge = (method: string) => {
    const map: Record<string, string> = {
      credit: '💳 信用卡',
      atm: '🏦 ATM 转账',
      cod: '📦 货到付款',
    };
    return map[method] || method;
  };

  if (loading) {
    return <div className="text-center py-20">加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'shipped', 'delivered'].map(status => (
            <a
              key={status}
              href={`/admin/orders?status=${status}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                statusFilter === status ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'pending' ? '待处理' : status === 'shipped' ? '已发货' : '已完成'}
            </a>
          ))}
          <a
            href="/admin/orders"
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              !statusFilter ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </a>
          <a href="/api/admin/orders/export" className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
            📥 导出 CSV
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-4 flex gap-3">
        <input
          type="text"
          placeholder="搜索订单编号、客户名称或电话..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm"
        />
        <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 px-3">✕</button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-gray-500">订单编号</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">客户</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">联系方式</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">金额</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">付款方式</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">状态</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">日期</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{order.orderNo}</td>
                <td className="p-4">{order.shippingName}</td>
                <td className="p-4 text-sm text-gray-500">
                  <div>{order.shippingPhone}</div>
                  <div className="truncate max-w-[150px]">{order.shippingAddress}</div>
                </td>
                <td className="p-4 font-semibold">¥ {order.total.toLocaleString()}</td>
                <td className="p-4 text-sm">{getPaymentBadge(order.paymentMethod)}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue text-sm hover:underline"
                  >
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <p className="text-sm text-gray-500">共 {total} 条</p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${page === p ? 'bg-blue text-white border-blue' : 'hover:bg-gray-50'}`}>
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">订单详情</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">订单编号</label>
                  <p className="font-mono">{selectedOrder.orderNo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">订单状态</label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">收件人</label>
                  <p>{selectedOrder.shippingName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">联络电话</label>
                  <p>{selectedOrder.shippingPhone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">收件地址</label>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">付款方式</label>
                  <p>{getPaymentBadge(selectedOrder.paymentMethod)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">订单金额</label>
                  <p className="font-bold text-xl">¥ {selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm text-gray-500 mb-2 block">订单商品</label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || '商品'}</p>
                        <p className="text-sm text-gray-500">數量: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">¥ {item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm text-gray-500 mb-2 block">更新状态</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      selectedOrder.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
待处理
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      selectedOrder.status === 'shipped' ? 'bg-blue text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
已发货
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      selectedOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    已完成
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
