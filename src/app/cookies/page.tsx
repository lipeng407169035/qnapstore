'use client';

import { useState } from 'react';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const handleSave = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    alert('Cookie 设置已保存');
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">Cookie 设置</h1>
          <p className="text-white/60 text-sm">管理您的 Cookie 偏好</p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Cookie 是存储在您设备上的小型文本文件，用于提升网站使用体验。我们使用以下类型的 Cookie：
          </p>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-sm mb-1">必要 Cookie</h3>
                <p className="text-xs text-gray-500">确保网站正常运行，无法关闭</p>
              </div>
              <input type="checkbox" checked disabled className="mt-0.5" />
            </div>
            <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-xl">
              <div>
                <h3 className="font-semibold text-sm mb-1">分析 Cookie</h3>
                <p className="text-xs text-gray-500">帮助我们了解访客如何与网站互动</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                className="mt-0.5 accent-blue"
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-xl">
              <div>
                <h3 className="font-semibold text-sm mb-1">营销 Cookie</h3>
                <p className="text-xs text-gray-500">用于个性化广告推荐</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                className="mt-0.5 accent-blue"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full mt-6 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark transition-colors"
          >
            保存设置
          </button>
        </div>
      </div>
    </>
  );
}
