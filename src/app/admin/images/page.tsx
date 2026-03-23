'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ImageFile } from '@/types';
import { toast } from '@/components/ui/Toast';

export default function AdminImagesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showAddSku, setShowAddSku] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newSkuName, setNewSkuName] = useState('');
  const [addingSku, setAddingSku] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ sku: string; name: string } | null>(null);

  const fetchProducts = useCallback(() => {
    adminFetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchImages = useCallback((sku: string) => {
    adminFetch(`/api/images/${sku}`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(() => setImages([]));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedSku) {
      fetchImages(selectedSku);
    } else {
      setImages([]);
    }
  }, [selectedSku, fetchImages]);

  const handleAddSku = async () => {
    if (!newSku.trim() || !newSkuName.trim()) {
      toast.warning('请填写型号和名称');
      return;
    }
    setAddingSku(true);
    const sku = newSku.trim().toUpperCase();
    await adminFetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku,
        name: newSkuName.trim(),
        series: 'Turbo NAS',
        categoryId: 1,
        categorySlug: 'home-nas',
        categoryName: '家用 NAS',
        price: 0,
        description: '',
        specs: {},
        badge: null,
        color: '#006ebd',
        rating: 0,
        reviews: 0,
        stock: 0,
      }),
    });
    setAddingSku(false);
    setNewSku('');
    setNewSkuName('');
    setShowAddSku(false);
    fetchProducts();
    setSelectedSku(sku);
  };

  const handleDeleteSku = async (sku: string) => {
    await adminFetch(`/api/admin/products/${products.find(p => p.sku === sku)?.id}`, { method: 'DELETE' });
    fetchProducts();
    if (selectedSku === sku) setSelectedSku('');
    setConfirmDelete(null);
    router.refresh();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedSku) return;
    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await adminFetch(`/api/admin/images/${selectedSku}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        await fetchImages(selectedSku);
      }
    } catch (err) {
      toast.error('上传失败，请重试');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteImage = async (filename: string) => {
    if (!confirm(`确定要删除 ${filename} 吗？`)) return;
    setDeleting(filename);
    try {
      await adminFetch(`/api/admin/images/${selectedSku}/${filename}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.name !== filename));
    } catch (err) {
      toast.error('删除失败，请重试');
    }
    setDeleting(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">图片管理</h1>
        <button
          onClick={() => setShowAddSku(true)}
          className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark"
        >
          + 新增型号
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-2">选择型号</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm"
            >
              <option value="">-- 请选择型号 --</option>
              {products.map((p) => (
                <option key={p.id} value={p.sku}>
                  {p.sku} - {p.name}
                </option>
              ))}
            </select>
          </div>
          {selectedSku && (
            <div className="flex items-end gap-2 pb-0.5">
              <button
                onClick={() => setConfirmDelete({ sku: selectedSku, name: products.find(p => p.sku === selectedSku)?.name || selectedSku })}
                className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50"
              >
删除型号
              </button>
            </div>
          )}
        </div>

        {selectedSku && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                multiple
                onChange={handleUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-blue-dark transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? '上传中...' : '+ 上传图片'}
              </label>
              <span className="text-xs text-gray-400">支持 SVG, PNG, JPG, WEBP（最多 20 张，每张 10MB）</span>
            </div>
            <span className="text-sm text-gray-500">{images.length} 张图片</span>
          </div>
        )}
      </div>

      {selectedSku ? (
        images.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-gray-400">尚无图片，请上传图片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.name} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
                <div className="relative aspect-square bg-gray-50">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full text-gray-400 text-4xl">📷</div>`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100"
                    >
                      查看大图
                    </a>
                    <button
                      onClick={() => handleDeleteImage(img.name)}
                      disabled={deleting === img.name}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting === img.name ? '删除中...' : '删除'}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-mono text-gray-600 truncate" title={img.name}>{img.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(img.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-gray-400">请选择一个型号以管理图片</p>
        </div>
      )}

      {/* Add SKU Modal */}
      {showAddSku && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">新增型号</h2>
              <button onClick={() => setShowAddSku(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">型号 SKU</label>
                <input
                  type="text"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                  placeholder="例如：TS-464"
                  className="w-full px-4 py-2 border rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">商品名称</label>
                <input
                  type="text"
                  value={newSkuName}
                  onChange={(e) => setNewSkuName(e.target.value)}
                  placeholder="例如：TS-464 四槽 NAS"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddSku}
                  disabled={addingSku}
                  className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark disabled:opacity-50"
                >
                  {addingSku ? '新增中...' : '新增'}
                </button>
                <button onClick={() => setShowAddSku(false)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete SKU Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">确定要删除型号吗？</h2>
              <p className="text-gray-500 mb-1">
                型号：<span className="font-mono font-bold">{confirmDelete.sku}</span>
              </p>
              <p className="text-gray-500 mb-6 text-sm">
                包含 {images.length} 张图片也会一并删除
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteSku(confirmDelete.sku)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600"
                >
                  确认删除
                </button>
                <button onClick={() => setConfirmDelete(null)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
