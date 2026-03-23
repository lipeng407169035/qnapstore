'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

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
    adminFetch('/api/admin/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await adminFetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const handleReject = async (id: string) => {
    await adminFetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此评论吗？')) return;
    await adminFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);

  if (loading) return (
    <div>
      <AdminBreadcrumb />
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>
      <SkeletonTable rows={8} cols={6} />
    </div>
  );

  return (
    <div>
      <AdminBreadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">评论管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            待审核 {pending.length} 条 · 已通过 {approved.length} 条
          </p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-orange-600">待审核评论</h2>
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
                    <button onClick={() => handleApprove(review.id)} className="px-4 py-2 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-600">通过</button>
                    <button onClick={() => handleReject(review.id)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-300">忽略</button>
                    <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200">删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold mb-4">已通过评论</h2>
        {approved.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">暂无已通过的评论</div>
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
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">已通过</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                      <button onClick={() => handleReject(review.id)} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium hover:bg-yellow-200">取消通过</button>
                    <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200">删除</button>
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
