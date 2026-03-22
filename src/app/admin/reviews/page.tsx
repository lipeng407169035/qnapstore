'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false }),
    });
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: false } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此評論嗎？')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    setReviews(reviews.filter(r => r.id !== id));
  };

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);

  if (loading) return <div className="text-center py-20">載入中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">評論管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            待審核 {pending.length} 筆 · 已通過 {approved.length} 筆
          </p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-orange-600">待審核評論</h2>
          <div className="space-y-3">
            {pending.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border-l-4 border-orange-400 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('zh-TW')}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">商品 ID: {review.productId}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleApprove(review.id)} className="px-4 py-2 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-600">通過</button>
                    <button onClick={() => handleReject(review.id)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-300">略過</button>
                    <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200">刪除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold mb-4">已通過評論</h2>
        {approved.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">尚無已通過的評論</div>
        ) : (
          <div className="space-y-3">
            {approved.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('zh-TW')}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">已通過</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleReject(review.id)} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium hover:bg-yellow-200">取消通過</button>
                    <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200">刪除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
