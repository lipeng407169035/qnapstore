'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from '@/components/ui/Toast';

export default function ProductImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/products/import', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('导入失败');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-blue hover:underline text-sm">← 返回商品管理</Link>
        <h1 className="text-2xl font-bold">CSV 批量匯入商品</h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">CSV 格式說明</h2>
          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono overflow-x-auto">
            <p className="text-gray-500 mb-2">第一列為欄位名稱（表頭），必須包含以下欄位：</p>
            <p className="text-blue font-semibold">sku,name,series,categorySlug,categoryName,price,originalPrice,description,badge,color,rating,reviews,stock</p>
            <p className="text-gray-400 mt-2">範例：</p>
            <p>TS-264,TS-264 雙槽 NAS,Turbo NAS,home-nas,家用 NAS,9900,,Intel 四核心,熱賣,#006ebd,4.7,42,100</p>
          </div>
          <ul className="text-sm text-gray-500 mt-3 space-y-1">
            <li>• <strong>sku</strong>：必填，唯一識別碼，已有 SKU 會更新，無則新增</li>
            <li>• <strong>categorySlug</strong>：分類縮寫，如 home-nas、switch、memory</li>
            <li>• <strong>description</strong>：含逗號時請加引號包圍</li>
            <li>• <strong>color</strong>：HEX 色碼，如 #006ebd</li>
            <li>• <strong>rating / reviews / stock</strong>：數字</li>
          </ul>
          <a href="/api/admin/products/export" className="inline-block mt-4 text-sm text-blue hover:underline">
            📥 下載目前商品 CSV 範本
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">上傳 CSV 檔案</h2>
          <form onSubmit={handleImport}>
            <input
              type="file"
              accept=".csv"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full mb-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue file:text-white file:font-medium hover:file:bg-blue-dark cursor-pointer"
            />
            <button type="submit" disabled={!file || loading} className="bg-blue text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-dark disabled:opacity-50">
              {loading ? '匯入中...' : '開始匯入'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-xl ${result.errors.length > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-bold mb-2">匯入結果</p>
              <p className="text-sm">✅ 新增：{result.created} 項</p>
              <p className="text-sm">🔄 更新：{result.updated} 項</p>
              {result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">⚠️ 錯誤：{result.errors.length} 項</p>
                  <ul className="text-xs text-red-500 mt-1 space-y-0.5">
                    {result.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                    {result.errors.length > 5 && <li>...還有 {result.errors.length - 5} 項錯誤</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
