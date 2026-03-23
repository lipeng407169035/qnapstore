'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Product } from '@/types';
import { toast } from '@/components/ui/Toast';

interface SpecEntry {
  key: string;
  value: string;
}

const CATEGORIES = [
  { slug: 'home-nas', name: '家用 NAS' },
  { slug: 'business-nas', name: '企业 NAS' },
  { slug: 'rackmount-nas', name: '机架式 NAS' },
  { slug: 'switch', name: '网络交换机' },
  { slug: 'expansion', name: '扩展设备' },
  { slug: 'network-card', name: '网络配件' },
  { slug: 'software', name: '软件授权' },
  { slug: 'warranty', name: '延长质保' },
  { slug: 'memory', name: '内存' },
];

const BADGE_OPTIONS = ['', '热销', '新品', '特价', '旗舰'];

function parseSpecs(specs: string | Record<string, string | number> | undefined): SpecEntry[] {
  if (!specs) return [{ key: '', value: '' }];
  if (typeof specs === 'string') {
    try {
      const obj = JSON.parse(specs);
      return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
    } catch {
      return [{ key: '', value: '' }];
    }
  }
  return Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
}

function buildSpecs(entries: SpecEntry[]): Record<string, string> {
  const result: Record<string, string> = {};
  entries.forEach(e => {
    if (e.key.trim()) result[e.key.trim()] = e.value;
  });
  return result;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [specEntries, setSpecEntries] = useState<SpecEntry[]>([{ key: '', value: '' }]);

  useEffect(() => {
    adminFetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      });
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setSpecEntries(parseSpecs(product.specs));
    setIsEditing(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('确定要删除此商品吗？')) return;
    await adminFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    const specs = buildSpecs(specEntries);
    const payload = { ...formData, specs };

    const res = await adminFetch(`/api/admin/products/${selectedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    setProducts(prev => prev.map(p => p.id === updated.id ? { ...updated, specs: JSON.stringify(specs) } : p));
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({
      sku: '',
      name: '',
      series: '',
      categoryId: 1,
      categorySlug: 'home-nas',
      categoryName: '家用 NAS',
      price: 0,
      originalPrice: null,
      description: '',
      badge: null,
      color: '#006ebd',
      rating: 0,
      reviews: 0,
      stock: 0,
    });
    setSpecEntries([{ key: '', value: '' }]);
    setIsEditing(true);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specEntries];
    updated[index][field] = value;
    setSpecEntries(updated);
  };

  const handleAddSpec = () => {
    setSpecEntries([...specEntries, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecEntries(specEntries.filter((_, i) => i !== index));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: '缺货', color: 'bg-red-100 text-red-700' };
    if (stock < 20) return { label: '低库存', color: 'bg-orange-100 text-orange-700' };
    return { label: '有货', color: 'bg-green-100 text-green-700' };
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchItems, setBatchItems] = useState<{ productId: string; sku: string; name: string; stock: number; change: number }[]>([]);

  const handleBatchAdjust = (product: Product) => {
    setBatchItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.filter(i => i.productId !== product.id);
      return [...prev, { productId: product.id, sku: product.sku, name: product.name, stock: product.stock, change: 0 }];
    });
  };

  const submitBatchStock = async () => {
    const adjustments = batchItems.filter(i => i.change !== 0).map(i => ({ productId: i.productId, stockChange: i.change }));
    if (adjustments.length === 0) return;
    await adminFetch('/api/admin/products/batch-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adjustments }),
    });
    const res = await adminFetch('/api/admin/products').then(r => r.json());
    setProducts(Array.isArray(res) ? res : (res.data || []));
    setBatchItems([]);
    setBatchModalOpen(false);
    toast.success('库存批量调整完成！');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="flex gap-2">
          <a href="/api/admin/products/export" className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 text-sm">
            📥 导出 CSV
          </a>
          <a href="/api/admin/products/import" className="bg-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 text-sm">
            📤 导入 CSV
          </a>
          <button onClick={() => setBatchModalOpen(true)} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 text-sm">
            📦 批量库存
          </button>
          <button onClick={handleAdd} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
            + 新增商品
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-gray-500">图片</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">SKU</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">商品名称</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">分类</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">价格</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">库存</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">状态</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg" style={{ background: product.color }} />
                  </td>
                  <td className="p-4 font-mono text-sm">{product.sku}</td>
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.series}</div>
                  </td>
                  <td className="p-4 text-sm">{product.categoryName}</td>
                  <td className="p-4">
                    <div className="font-semibold">¥ {product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">¥ {product.originalPrice.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{product.stock}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.badge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.badge === '热销' ? 'bg-orange-100 text-orange-700' :
                        product.badge === '新品' ? 'bg-green-100 text-green-700' :
                        product.badge === '特价' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue text-sm hover:underline">编辑</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm hover:underline">删除</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {batchModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">批量库存调整</h2>
              <button onClick={() => { setBatchModalOpen(false); setBatchItems([]); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">勾选要调整的商品，输入增减数量（正数为增加，负数为减少）</p>
              <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                {products.map(p => {
                  const item = batchItems.find(i => i.productId === p.id);
                  const selected = !!item;
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected ? 'border-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                      onClick={() => handleBatchAdjust(p)}>
                      <input type="checkbox" checked={selected} onChange={() => {}} className="accent-blue" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">SKU: {p.sku} · 当前库存: {p.stock}</p>
                      </div>
                      {selected && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item?.change || 0}
                            onChange={e => {
                              e.stopPropagation();
                              setBatchItems(prev => prev.map(i => i.productId === p.id ? { ...i, change: parseInt(e.target.value) || 0 } : i));
                            }}
                            className="w-24 px-3 py-1.5 border rounded-lg text-sm text-center"
                            placeholder="增减量"
                          />
                          <span className="text-xs text-gray-400">→ {Math.max(0, p.stock + (item?.change || 0))}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={submitBatchStock} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">
                  确认调整 ({batchItems.filter(i => i.change !== 0).length} 项)
                </button>
                <button onClick={() => { setBatchModalOpen(false); setBatchItems([]); }} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedProduct ? '编辑商品' : '新增商品'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">SKU</label>
                  <input type="text" value={formData.sku || ''} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">系列</label>
                  <input type="text" value={formData.series || ''} onChange={(e) => setFormData({ ...formData, series: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 block mb-1">商品名稱</label>
                  <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">价格 (¥)</label>
                  <input type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">原价 (¥)</label>
                  <input type="number" value={formData.originalPrice || ''} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseInt(e.target.value) : null })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">分類</label>
                  <select value={formData.categorySlug || 'home-nas'} onChange={(e) => {
                    const cat = CATEGORIES.find(c => c.slug === e.target.value);
                    setFormData({ ...formData, categorySlug: e.target.value, categoryName: cat?.name || '' });
                  }} className="w-full px-4 py-2 border rounded-xl text-sm">
                    {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">标签</label>
                  <select value={formData.badge || ''} onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })} className="w-full px-4 py-2 border rounded-xl text-sm">
                    {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '无'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">库存数量</label>
                  <input type="number" value={formData.stock ?? 0} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">评分</label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating || 0} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">评论数</label>
                  <input type="number" value={formData.reviews || 0} onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">颜色</label>
                  <input type="color" value={formData.color || '#006ebd'} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full h-10 border rounded-xl cursor-pointer" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 block mb-1">描述</label>
                  <RichTextEditor value={formData.description || ''} onChange={(v) => setFormData({ ...formData, description: v })} />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">商品規格</label>
                <div className="space-y-2">
                  {specEntries.map((entry, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={entry.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        placeholder="規格名稱 (如：CPU)"
                        className="flex-1 px-4 py-2 border rounded-xl text-sm"
                      />
                      <input
                        type="text"
                        value={entry.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        placeholder="規格值 (如：Intel Celeron N5105)"
                        className="flex-1 px-4 py-2 border rounded-xl text-sm"
                      />
                      <button onClick={() => handleRemoveSpec(index)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm">✕</button>
                    </div>
                  ))}
                  <button onClick={handleAddSpec} className="text-sm text-blue hover:underline">+ 新增規格</button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">保存</button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
