'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect, useRef } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Image, Upload } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  btnText: string;
  link: string;
  gradient: string;
  image: string;
  active: boolean;
  sort: number;
}

const GRADIENTS = [
  'linear-gradient(135deg, #0d2137 0%, #006ebd 100%)',
  'linear-gradient(135deg, #0d2a0d 0%, #0a7c3e 100%)',
  'linear-gradient(135deg, #1d3557 0%, #4a0080 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
  'linear-gradient(135deg, #0d2137 0%, #006ebd 100%)',
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Banner>>({});
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminFetch('/api/admin/banners').then(r => r.json()).then(data => { setBanners(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function openAdd() {
    setEditItem({ title: '', subtitle: '', btnText: '立即购买', link: '/products', gradient: GRADIENTS[0], image: '', active: true, sort: banners.length + 1 });
    setPreviewUrl('');
    setImageTab('url');
    setShowModal(true);
  }

  function openEdit(banner: Banner) {
    setEditItem({ ...banner, image: banner.image || '' });
    setPreviewUrl(banner.image || '');
    setImageTab('url');
    setShowModal(true);
  }

  async function handleSave() {
    if (!editItem.title) return;
    const method = editItem.id ? 'PUT' : 'POST';
    const url = editItem.id ? `/api/admin/banners/${editItem.id}` : '/api/admin/banners';
    const res = await adminFetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem),
    });
    const updated = await res.json();
    if (editItem.id) {
      setBanners(prev => prev.map(b => b.id === updated.id ? updated : b));
    } else {
      setBanners(prev => [...prev, updated]);
    }
    setShowModal(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await adminFetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    setBanners(prev => prev.filter(b => b.id !== id));
  }

  async function handleLocalUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await adminFetch('/api/admin/banners/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setEditItem({ ...editItem, image: data.url });
        setPreviewUrl(data.url);
        setImageTab('url');
      }
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function getPreviewStyle() {
    if (previewUrl) {
      return { backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties;
    }
    return { background: editItem.gradient || GRADIENTS[0] } as React.CSSProperties;
  }

  if (loading) return (
    <div>
      <AdminBreadcrumb />
      <h1 className="text-2xl font-bold mb-6">轮播图管理</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-40" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <AdminBreadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">轮播图管理</h1>
        <button onClick={openAdd} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90">
          + 新增轮播图
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Image}
              title="暂无轮播图"
              description="创建第一个首页轮播图吧"
              action={{ label: '+ 新增轮播图', onClick: openAdd }}
            />
          </div>
        ) : (
          banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-36 relative" style={banner.image ? { backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: banner.gradient } as React.CSSProperties}>
              {!banner.image && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3">
                  <p className="font-bold text-sm text-center">{banner.title}</p>
                  <p className="text-xs text-white/70 text-center mt-1">{banner.subtitle}</p>
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {banner.active ? '启用' : '停用'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium mb-1 truncate">{banner.title}</p>
              <p className="text-xs text-gray-400 mb-3">排序: {banner.sort} · 链接: {banner.link}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(banner)} className="flex-1 text-blue text-sm hover:underline">编辑</button>
                <button onClick={() => handleDelete(banner.id)} className="flex-1 text-red-500 text-sm hover:underline">删除</button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editItem.id ? '编辑轮播图' : '新增轮播图'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">预览</label>
                <div className="h-36 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={getPreviewStyle()}>
                  {!previewUrl && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <p className="font-bold">{editItem.title || '标题'}</p>
                      <p className="text-xs text-white/70 mt-1">{editItem.subtitle || '副标题'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">图片设置</label>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setImageTab('url')} className={`px-4 py-2 rounded-lg text-sm font-medium ${imageTab === 'url' ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600'}`}>图片URL</button>
                  <button onClick={() => setImageTab('upload')} className={`px-4 py-2 rounded-lg text-sm font-medium ${imageTab === 'upload' ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600'}`}>本地上传</button>
                </div>
                {imageTab === 'url' ? (
                  <div>
                    <input type="text" value={editItem.image || ''} onChange={e => { setEditItem({ ...editItem, image: e.target.value }); setPreviewUrl(e.target.value); }} placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm" />
                    <p className="text-xs text-gray-400 mt-1">支持 Unsplash 等外部图片链接</p>
                  </div>
                ) : (
                  <div>
                    <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleLocalUpload} className="hidden" id="banner-upload" />
                    <label htmlFor="banner-upload" className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer hover:border-blue transition-colors ${uploading ? 'opacity-50' : ''}`}>
                      {uploading ? '上传中...' : <><Upload className="w-4 h-4" /> 点击选择图片上传</>}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">支持 PNG、JPG、WEBP（最大 10MB）</p>
                  </div>
                )}
                {(editItem.image || previewUrl) && (
                  <button onClick={() => { setEditItem({ ...editItem, image: '' }); setPreviewUrl(''); }} className="text-xs text-red-500 hover:underline mt-1">清除图片，使用纯色背景</button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">标题 *</label>
                  <input type="text" value={editItem.title || ''} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="轮播图标题" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">副标题</label>
                  <textarea value={editItem.subtitle || ''} onChange={e => setEditItem({ ...editItem, subtitle: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="简短描述" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">按钮文字</label>
                  <input type="text" value={editItem.btnText || ''} onChange={e => setEditItem({ ...editItem, btnText: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">链接地址</label>
                  <input type="text" value={editItem.link || ''} onChange={e => setEditItem({ ...editItem, link: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="/products 或 TS-464" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">纯色背景（无图片时）</label>
                  <select value={editItem.gradient || ''} onChange={e => setEditItem({ ...editItem, gradient: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {GRADIENTS.map((g, i) => <option key={i} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input type="number" value={editItem.sort || 1} onChange={e => setEditItem({ ...editItem, sort: parseInt(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="banner-active" checked={editItem.active !== false} onChange={e => setEditItem({ ...editItem, active: e.target.checked })} className="accent-blue" />
                <label htmlFor="banner-active" className="text-sm">启用</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue/90">保存</button>
                <button onClick={() => setShowModal(false)} className="px-6 py-3 border rounded-xl hover:bg-gray-50">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
