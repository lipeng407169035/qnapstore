'use client';

import { useEffect, useState, useRef } from 'react';

interface Download {
  id: string; sku: string; fileName: string; fileType: string;
  version: string; size: string; url: string; createdAt: string;
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Download>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchDownloads(); }, []);

  function fetchDownloads() {
    setLoading(true);
    fetch('/api/admin/downloads').then(r => r.json()).then(data => { setDownloads(data); setLoading(false); });
  }

  function openAdd() { setEditItem({}); setShowModal(true); }

  async function handleSave() {
    if (!editItem.sku || !editItem.fileName) return;
    const formData = new FormData();
    formData.append('sku', editItem.sku);
    formData.append('fileName', editItem.fileName);
    formData.append('fileType', editItem.fileType || '其他');
    formData.append('version', editItem.version || '');
    if (fileRef.current?.files?.[0]) formData.append('file', fileRef.current.files[0]);
    setUploading(true);
    await fetch('/api/admin/downloads', { method: 'POST', body: formData });
    setShowModal(false);
    setUploading(false);
    fetchDownloads();
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除？')) return;
    await fetch(`/api/admin/downloads/${id}`, { method: 'DELETE' });
    fetchDownloads();
  }

  const grouped = downloads.reduce((acc, d) => {
    if (!acc[d.sku]) acc[d.sku] = [];
    acc[d.sku].push(d);
    return acc;
  }, {} as Record<string, Download[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">下载文件管理</h1>
        <button onClick={openAdd} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90">+ 新增文件</button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? <div className="text-center py-10 text-gray-400">加载中...</div> : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-10 text-gray-400">暂无文件</div>
        ) : (
          Object.entries(grouped).map(([sku, files]) => (
            <div key={sku} className="mb-6 last:mb-0">
              <h3 className="font-bold text-sm mb-3 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg inline-block">{sku}</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-gray-500 text-xs">
                    <th className="pb-2 font-medium">文件名</th>
                    <th className="pb-2 font-medium">类型</th>
                    <th className="pb-2 font-medium">版本</th>
                    <th className="pb-2 font-medium">大小</th>
                    <th className="pb-2 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(f => (
                    <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2.5 font-medium">{f.fileName}</td>
                      <td className="py-2.5"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f.fileType}</span></td>
                      <td className="py-2.5 text-gray-500">{f.version || '-'}</td>
                      <td className="py-2.5 text-gray-400">{f.size}</td>
                      <td className="py-2.5 text-right"><button onClick={() => handleDelete(f.id)} className="text-red-500 hover:underline text-sm">删除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-4">新增下载文件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">产品型号 *</label>
                <input value={editItem.sku || ''} onChange={e => setEditItem({ ...editItem, sku: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="如：TS-464" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">文件名 *</label>
                <input value={editItem.fileName || ''} onChange={e => setEditItem({ ...editItem, fileName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="文件显示名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">文件类型</label>
                  <select value={editItem.fileType || ''} onChange={e => setEditItem({ ...editItem, fileType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="PDF">PDF</option><option value="BIN">BIN</option><option value="ZIP">ZIP</option><option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">版本号</label>
                  <input value={editItem.version || ''} onChange={e => setEditItem({ ...editItem, version: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">上传文件</label>
                <input ref={fileRef} type="file" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
              <button onClick={handleSave} disabled={uploading} className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-medium disabled:opacity-50">{uploading ? '上传中...' : '保存'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
