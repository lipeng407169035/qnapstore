'use client';

import { useEffect, useState } from 'react';

export default function RmaPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/rma-policy')
      .then(r => r.json())
      .then(data => { setContent(data.content || ''); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">退换货政策</h1>
          <p className="text-white/60 text-sm">了解 QNAP 退换货服务政策与流程</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue border-t-transparent mx-auto" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ lineHeight: '1.9', fontSize: '15px' }}
              />
            </div>
          )}
          <div className="mt-6 bg-blue-50 rounded-2xl p-5 text-center">
            <p className="text-sm text-blue-700 mb-3">如有疑问，请联系客服</p>
            <a href="tel:400-888-3600" className="text-blue-600 font-bold text-lg hover:underline">400-888-3600</a>
          </div>
        </div>
      </div>
    </>
  );
}
