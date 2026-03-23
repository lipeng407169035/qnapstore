'use client';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';

export default function AdminBatchShipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingNo, setTrackingNo] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders?status=pending').then(r => r.json()).then(d => d.data || []),
      fetch('/api/admin/orders?status=paid').then(r => r.json()).then(d => d.data || []),
    ]).then(([pending, paid]) => {
      setOrders([...pending, ...paid].filter((o: any) => ['pending', 'paid'].includes(o.status)));
      setLoading(false);
    });
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const handleBatchShip = async () => {
    if (selected.length === 0 || !shippingCompany) return;
    for (const orderId of selected) {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped', trackingNo: `${shippingCompany}${trackingNo || Date.now()}` }),
      });
    }
    toast.success(`已为 ${selected.length} 个订单批量发货！`);
    setOrders(orders.map(o => selected.includes(o.id) ? { ...o, status: 'shipped' } : o));
    setSelected([]);
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">批量发货</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="text-sm text-gray-500 block mb-1">物流公司</label>
            <select value={shippingCompany} onChange={e => setShippingCompany(e.target.value)} className="px-4 py-2 border rounded-xl text-sm">
              <option value="">选择物流</option>
              <option value="SF">顺丰速运</option>
              <option value="ZT">中通快递</option>
              <option value="YT">圆通速递</option>
              <option value="JD">京东物流</option>
              <option value="DB">德邦快递</option>
            </select>
          </div>
          <button onClick={handleBatchShip} disabled={selected.length === 0 || !shippingCompany}
            className="bg-blue text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-dark disabled:opacity-50">
            批量发货（已选 {selected.length} 单）
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {orders.filter(o => ['pending', 'paid'].includes(o.status)).map(order => (
          <div key={order.id} className="bg-white rounded-xl p-4 border flex items-center gap-4">
            <input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggleSelect(order.id)} className="w-5 h-5 accent-blue" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold">{order.orderNo}</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">待发货</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{order.shippingName} · {order.shippingPhone}</div>
              <div className="text-xs text-gray-400 truncate max-w-md">{order.shippingAddress}</div>
            </div>
            <div className="text-right">
              <p className="font-bold">¥ {order.total.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{order.items?.length || 0} 件商品</p>
            </div>
          </div>
        ))}
        {orders.filter(o => ['pending', 'paid'].includes(o.status)).length === 0 && (
          <div className="text-center py-16 text-gray-400">暂无待发货订单</div>
        )}
      </div>
    </div>
  );
}
