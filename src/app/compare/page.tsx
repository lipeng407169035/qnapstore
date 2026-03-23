'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { toast } from '@/components/ui/Toast';

function parseSpecs(specs: string | Record<string, string | number> | undefined): Record<string, string> {
  if (!specs) return {};
  if (typeof specs === 'string') {
    try { return JSON.parse(specs); } catch { return {}; }
  }
  return Object.fromEntries(Object.entries(specs).map(([k, v]) => [k, String(v)]));
}

function CompareInner() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialSkus = searchParams.getAll('s');
    setSelected(initialSkus);
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const updateUrl = useCallback((skus: string[]) => {
    const params = new URLSearchParams();
    skus.forEach(s => params.append('s', s));
    const query = params.toString();
    window.history.replaceState(null, '', `/compare${query ? '?' + query : ''}`);
  }, []);

  const toggleProduct = (sku: string) => {
    if (selected.includes(sku)) {
      const next = selected.filter(s => s !== sku);
      setSelected(next);
      updateUrl(next);
    } else if (selected.length < 4) {
      const next = [...selected, sku];
      setSelected(next);
      updateUrl(next);
    } else {
      toast.warning('最多只能对比4个商品');
    }
  };

  const compareProducts = selected.map(sku => products.find(p => p.sku === sku)).filter(Boolean) as Product[];
  
  const allSpecs = new Set<string>();
  compareProducts.forEach(p => {
    Object.keys(parseSpecs(p.specs)).forEach(k => allSpecs.add(k));
  });

  const specLabels: Record<string, string> = {
    bays: '硬盘槽数', cpu: '处理器', ram: '内存', network: '网络',
    ports: '连接端口', ports_sfp: 'SFP+ 连接端口', ports_rj45: 'RJ45 连接端口',
    poe_ports: 'PoE 连接端口', uplink: '上行连接端口', total_power: 'PoE 功率',
    interface: '接口', speed: '传输速度', connector: '连接器',
    channels: '频道数', type: '类型', period: '期限',
    capacity: '容量', form: '机型', wattage: '功率', watt: '功率',
    max_capacity: '最大容量', dimensions: '尺寸', weight: '重量',
    warranty: '质保', color: '颜色', protocols: '通讯协议',
    Poe: 'PoE 供电', PoeBudget: 'PoE 供电瓦数', managed: '管理类型',
    formFactor: '外型规格', bandwidth: '带宽', flash: '闪存',
    power: '电源', ventilation: '风扇', operating: '操作系统',
  };

  const formatSpecValue = (value: string | number) => String(value);

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <h1 className="text-xl md:text-2xl font-bold mb-2">商品比较</h1>
      <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">选择 2-4 个商品进行比较</p>

      <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 overflow-x-auto">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.sku)}
              className={`border rounded-xl p-2 md:p-3 text-left transition-all ${
                selected.includes(p.sku)
                  ? 'border-blue bg-blue-50 ring-2 ring-blue'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="h-12 md:h-16 rounded-lg flex items-center justify-center mb-1 md:mb-2" style={{ background: p.color }}>
                <img
                  src={`/images/products/${p.sku}/1.svg`}
                  alt={p.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <p className="text-[10px] md:text-xs font-medium line-clamp-1">{p.name}</p>
              <p className="text-[10px] md:text-xs font-bold text-orange">¥ {p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {compareProducts.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 bg-gray-50 w-40">项目</th>
                  {compareProducts.map(p => (
                    <th key={p.id} className="p-4 text-center min-w-[180px]">
                      <Link href={`/products/${p.sku}`} className="font-semibold text-sm hover:text-blue line-clamp-2">
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">图片</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <div className="w-24 h-20 rounded-lg mx-auto flex items-center justify-center" style={{ background: p.color }}>
                        <img
                          src={`/images/products/${p.sku}/1.svg`}
                          alt={p.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">价格</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <span className="text-lg font-bold text-orange">¥ {p.price.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="block text-xs text-gray-400 line-through">¥ {p.originalPrice.toLocaleString()}</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">评分</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <span className="text-amber-500">★</span> <span className="font-bold">{p.rating}</span>
                      <span className="text-gray-400 text-xs ml-1">({p.reviews}条)</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">库存</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock < 20 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {p.stock === 0 ? '缺货' : p.stock < 20 ? `仅存 ${p.stock} 件` : '有货'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">分类</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center text-sm">{p.categoryName}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">简述</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center text-sm text-gray-600 line-clamp-3">{p.description}</td>
                  ))}
                </tr>
                {Array.from(allSpecs).map(specKey => (
                  <tr key={specKey} className="border-b">
                    <td className="p-4 text-sm font-medium text-gray-500 bg-gray-50">{specLabels[specKey] || specKey}</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-4 text-center text-sm">
                        {formatSpecValue(parseSpecs(p.specs)[specKey] || '—')}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 bg-gray-50"></td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <Link href={`/products/${p.sku}`}>
                        <button className="bg-blue text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-dark">
                          查看详情
                        </button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {compareProducts.length === 0 && (
        <div className="bg-white rounded-xl md:rounded-2xl p-12 md:p-20 text-center">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4">⚖️</div>
          <p className="text-gray-400 text-sm">请选择商品进行比较</p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
      <CompareInner />
    </Suspense>
  );
}
