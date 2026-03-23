'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminRestockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(20);

  useEffect(() => {
    adminFetch('/api/admin/restock-notifications').then(r => r.json()).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">加载中...</div>;

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= threshold);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">库存预警与补货</h1>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> 缺货商品（{outOfStock.length} 项）</h2>
        {outOfStock.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStock.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-red-200">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-400">{p.sku} · 库存：<span className="text-red-600 font-bold">0</span></p>
              </div>
            ))}
          </div>
        ) : <p className="text-red-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 暂无缺货商品</p>}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-orange-800">低库存预警（{lowStock.length} 项）</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">预警阈值：</span>
            <input type="number" value={threshold} onChange={e => setThreshold(parseInt(e.target.value) || 20)}
              className="w-20 px-3 py-1 border rounded-lg text-sm" />
            <span className="text-sm text-gray-500">件</span>
          </div>
        </div>
        {lowStock.length > 0 ? (
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">{p.stock}</p>
                  <p className="text-xs text-gray-400">件</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-orange-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 暂无低库存商品</p>}
      </div>
    </div>
  );
}
