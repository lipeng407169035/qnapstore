'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem { id: number; category: string; question: string; answer: string; sortOrder: number; }

export default function FAQPage() {
  const [faq, setFaq] = useState<{ category: string; items: FAQItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/faq')
      .then(r => r.json())
      .then(data => { setFaq(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-[#0d2137] to-[#006ebd] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">常见问题</h1>
          <p className="text-white/60 text-sm">快速找到您关心的问题答案</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue border-t-transparent mx-auto" /></div>
        ) : (
          <div className="space-y-8">
            {faq.map(group => (
              <div key={group.category}>
                <h2 className="font-bold text-lg mb-4">{group.category}</h2>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-sm pr-4">{item.question}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${openId === item.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openId === item.id && (
                        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t bg-gray-50">
                          <div className="pt-3" dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-blue-700 font-medium mb-3">没有找到您需要的答案？</p>
          <a href="/support" className="inline-block bg-blue text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue/90 transition-colors">
            提交技术支持工单
          </a>
        </div>
      </div>
    </>
  );
}
