'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { TrackingInfo } from '@/types';

interface Order {
  id: string;
  orderNo: string;
  status: string;
  total: number;
  createdAt: string;
  trackingNo?: string;
  items: { product: { name: string; sku?: string }; quantity: number; price: number }[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingMap, setTrackingMap] = useState<Record<string, TrackingInfo>>({});
  const [selectedTracking, setSelectedTracking] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/orders');
      return;
    }
    const allOrders = JSON.parse(localStorage.getItem('qnap_orders') || '[]');
    const userOrders = allOrders.filter((o: any) => o.userId === user.id);
    setOrders(userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [user, router]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待处理' },
      paid: { bg: 'bg-blue-100', text: 'text-blue-700', label: '已支付' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-700', label: '处理中' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', label: '已发货' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: '已完成' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: '已取消' },
    };
    return statusMap[status] ? (
      <span className={`${statusMap[status].bg} ${statusMap[status].text} px-2.5 py-1 rounded-full text-xs font-bold`}>
        {statusMap[status].label}
      </span>
    ) : (
      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>
    );
  };

  const fetchTracking = async (order: Order) => {
    if (trackingMap[order.id]) {
      setSelectedTracking(selectedTracking === order.id ? null : order.id);
      return;
    }
    setTrackingLoading(order.id);
    try {
      const res = await fetch(`/api/tracking/${order.trackingNo || order.orderNo}`);
      const data = await res.json();
      setTrackingMap(prev => ({ ...prev, [order.id]: data }));
      setSelectedTracking(order.id);
    } catch {
      setTrackingMap(prev => ({ ...prev, [order.id]: { trackingNo: order.trackingNo || order.orderNo, status: '暂无物流信息', events: [] } }));
      setSelectedTracking(order.id);
    }
    setTrackingLoading(null);
  };

  if (!user) {
    return <div className="py-20 text-center">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <h1 className="font-barlow text-xl md:text-2xl font-extrabold mb-4 md:mb-6">订单查询</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white border border-gray-200 rounded-xl">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">📦</div>
          <h2 className="text-lg md:text-xl font-bold mb-2">暂无订单</h2>
          <p className="text-muted text-sm mb-6">快去选购心仪的商品吧！</p>
          <Link href="/products">
            <Button variant="blue">开始购物</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-3 md:p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-xs md:text-sm">订单编号：{order.orderNo}</p>
                  <p className="text-[10px] md:text-xs text-muted mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')} {new Date(order.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {['shipped', 'delivered'].includes(order.status) && (
                    <button
                      onClick={() => fetchTracking(order)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      {trackingLoading === order.id ? '查询中...' : trackingMap[order.id] && selectedTracking === order.id ? '收起物流' : '查看物流'}
                    </button>
                  )}
                </div>
              </div>

              {selectedTracking === order.id && trackingMap[order.id] && (
                <div className="p-4 border-t border-gray-100 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-blue-800">🚚 快递追踪：{trackingMap[order.id].trackingNo}</p>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{trackingMap[order.id].status}</span>
                  </div>
                  <div className="space-y-3">
                    {trackingMap[order.id].events.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5" />
                          {i < trackingMap[order.id].events.length - 1 && <div className="w-0.5 flex-1 bg-blue-200 mt-1" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="text-sm font-medium text-gray-800">{event.description}</p>
                          <p className="text-xs text-gray-400">{event.location} · {new Date(event.time).toLocaleString('zh-CN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 md:p-4">
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold">¥ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold">总计</span>
                  <span className="text-xl font-barlow font-extrabold text-orange">¥ {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
