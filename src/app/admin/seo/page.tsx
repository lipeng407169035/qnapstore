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

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SEO 设置</h1>
          <p className="text-sm text-gray-500 mt-1">优化网站在搜索引擎的排名表现</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${saved ? 'bg-green text-white' : 'bg-blue text-white hover:bg-blue-dark'} disabled:opacity-50`}
        >
          {saving ? '保存中...' : saved ? '已保存 ✓' : '保存设置'}
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
                placeholder="QNAP Store 中国 | 官方网上商城"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">建议 50-60 字符</p>
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
                placeholder="QNAP 中国官方网上商城，提供 NAS、网络交换机..."
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">建议 120-158 字符</p>
                <p className={`text-xs ${!descOptimal ? 'text-red-500' : 'text-gray-400'}`}>
                  {charCount(seo.homeDescription)} / 158
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关键字 Keywords</label>
              <input
                type="text"
                value={seo.homeKeywords}
                onChange={(e) => setSeo({ ...seo, homeKeywords: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="QNAP, NAS, 网络存储, 交换机, 中国"
              />
              <p className="text-xs text-gray-400 mt-1">多个关键字请用逗号分隔</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG 图片路径</label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="/images/og-default.png"
              />
              <p className="text-xs text-gray-400 mt-1">建议尺寸 1200×630 像素</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-blue mb-2">SEO 小技巧</h3>
          <ul className="text-sm text-blue space-y-1">
            <li>• Title 应包含主要关键字，且每个页面都应该不同</li>
            <li>• Description 应该清楚描述页面内容，鼓励用户点击</li>
            <li>• 关键字不需要过多，选择与内容最相关的即可</li>
            <li>• OG 图片用于社交分享时的预览图片</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
