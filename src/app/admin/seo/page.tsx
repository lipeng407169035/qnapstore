'use client';

import { useState, useEffect } from 'react';

interface SEOData {
  homeTitle: string;
  homeDescription: string;
  homeKeywords: string;
  ogImage: string;
}

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<SEOData>({
    homeTitle: '',
    homeDescription: '',
    homeKeywords: '',
    ogImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/seo')
      .then(res => res.json())
      .then(data => {
        setSeo(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seo),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const charCount = (text: string) => text.length;
  const descOptimal = charCount(seo.homeDescription) >= 50 && charCount(seo.homeDescription) <= 160;

  if (loading) return <div className="text-center py-20">載入中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SEO 設定</h1>
          <p className="text-sm text-gray-500 mt-1">優化網站在搜尋引擎的排名表現</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${saved ? 'bg-green text-white' : 'bg-blue text-white hover:bg-blue-dark'} disabled:opacity-50`}
        >
          {saving ? '儲存中...' : saved ? '已儲存 ✓' : '儲存設定'}
        </button>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">首頁 SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={seo.homeTitle}
                onChange={(e) => setSeo({ ...seo, homeTitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="QNAP Store Taiwan | 官方網路商城"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">建議 50-60 字元</p>
                <p className={`text-xs ${charCount(seo.homeTitle) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {charCount(seo.homeTitle)} / 60
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={seo.homeDescription}
                onChange={(e) => setSeo({ ...seo, homeDescription: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                rows={3}
                placeholder="QNAP 台灣官方網路商城，提供 NAS、網路交換器..."
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">建議 120-158 字元</p>
                <p className={`text-xs ${!descOptimal ? 'text-red-500' : 'text-gray-400'}`}>
                  {charCount(seo.homeDescription)} / 158
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">關鍵字 Keywords</label>
              <input
                type="text"
                value={seo.homeKeywords}
                onChange={(e) => setSeo({ ...seo, homeKeywords: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="QNAP, NAS, 網路儲存, 交換器, 台灣"
              />
              <p className="text-xs text-gray-400 mt-1">多個關鍵字請用逗號分隔</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG 圖片路徑</label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="/images/og-default.png"
              />
              <p className="text-xs text-gray-400 mt-1">建議尺寸 1200×630 像素</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-blue mb-2">SEO 小技巧</h3>
          <ul className="text-sm text-blue space-y-1">
            <li>• Title 應包含主要關鍵字，且每個頁面都應該不同</li>
            <li>• Description 應該清楚描述頁面內容，鼓勵用戶點擊</li>
            <li>• 關鍵字不需要過多，選擇與內容最相關的即可</li>
            <li>• OG 圖片用於社群分享時的預覽圖片</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
