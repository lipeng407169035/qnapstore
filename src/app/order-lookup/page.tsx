'use client';

import { useState } from 'react';

interface Order {
  orderNo: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500' },
};

export default function OrderLookupPage() {
  const [searchType, setSearchType] = useState<'orderNo' | 'phone'>('orderNo');
  const [keyword, setKeyword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const allOrders: Order[] = [];
      for (let i = 0; i < 100; i++) {
        const stored = localStorage.getItem(`qnap_order_${i}`);
        if (stored) {
          try { allOrders.push(JSON.parse(stored)); } catch {}
        }
      }
      let results = allOrders;
      if (searchType === 'orderNo') {
        results = results.filter(o => o.orderNo.toLowerCase().includes(keyword.toLowerCase()));
      } else {
        results = results.filter(o => (o.shippingPhone || '').includes(keyword));
      }
      setOrders(results);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">订单查询</h1>
          <p className="text-white/60 text-sm">输入订单号或手机号查询您的订单状态</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex gap-2 mb-4">
            {[{ key: 'orderNo', label: '按订单号' }, { key: 'phone', label: '按手机号' }].map(t => (
              <button key={t.key} onClick={() => setSearchType(t.key as any)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${searchType === t.key ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={searchType === 'orderNo' ? '请输入订单号，如 QNAP... ' : '请输入下单时的手机号'}
              className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
            />
            <button onClick={handleSearch} disabled={loading} className="bg-blue text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue/90 disabled:opacity-50">
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue border-t-transparent mx-auto" /></div>
        ) : searched && orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-2">未找到相关订单</p>
            <p className="text-sm text-gray-400">请确认订单号或手机号是否正确</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.orderNo} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-medium text-gray-600">{o.orderNo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[o.status]?.color || 'bg-gray-100'}`}>
                    {STATUS_MAP[o.status]?.label || o.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {o.shippingName} · {o.shippingPhone}
                </div>
                <div className="text-sm text-gray-500 mb-3">{o.shippingAddress}</div>
                {o.items && o.items.length > 0 && (
                  <div className="border-t pt-3 mb-3">
                    {o.items.slice(0, 2).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm py-0.5">
                        <span className="text-gray-600">{item.product?.name || '商品'} × {item.quantity}</span>
                        <span className="font-medium">¥{item.price}</span>
                      </div>
                    ))}
                    {o.items.length > 2 && <p className="text-xs text-gray-400">... 共 {o.items.length} 件商品</p>}
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString('zh-CN')}</span>
                  <span className="font-bold text-lg text-blue">¥{o.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
