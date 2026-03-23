'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({});

  useEffect(() => {
    adminFetch('/api/admin/coupons')
      .then(res => res.json())
      .then(data => {
        setCoupons(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: null,
      startDate: today,
      endDate: today,
      usageLimit: null,
      active: true,
    });
    setIsEditing(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData(coupon);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.code?.trim()) {
      toast.warning('请输入优惠券');
      return;
    }
    if (formData.discountValue === undefined || formData.discountValue <= 0) {
      toast.warning('请输入有效的折扣值');
      return;
    }

    if (formData.id) {
      await adminFetch(`/api/admin/coupons/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setCoupons(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } as Coupon : c));
    } else {
      const res = await adminFetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newCoupon = await res.json();
      setCoupons(prev => [...prev, newCoupon]);
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此优惠券吗？')) return;
    await adminFetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const handleToggle = async (coupon: Coupon) => {
    const updated = { ...coupon, active: !coupon.active };
    await adminFetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setCoupons(prev => prev.map(c => c.id === coupon.id ? updated : c));
  };

  const isExpired = (coupon: Coupon) => new Date(coupon.endDate) < new Date();
  const isNotStarted = (coupon: Coupon) => new Date(coupon.startDate) > new Date();
  const isExhausted = (coupon: Coupon) => coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  const getStatus = (coupon: Coupon) => {
    if (!coupon.active) return { label: '停用', color: 'bg-gray-100 text-gray-500' };
    if (isExhausted(coupon)) return { label: '已用完', color: 'bg-red-100 text-red-700' };
    if (isExpired(coupon)) return { label: '已过期', color: 'bg-gray-100 text-gray-500' };
    if (isNotStarted(coupon)) return { label: '未生效', color: 'bg-blue-100 text-blue-700' };
    return { label: '可使用', color: 'bg-green-100 text-green-700' };
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% off${coupon.maxDiscount ? ` (最高 ¥ ${coupon.maxDiscount})` : ''}`;
    }
    return `¥ ${coupon.discountValue} off`;
  };

  if (loading) return (
    <div>
      <AdminBreadcrumb />
      <h1 className="text-2xl font-bold mb-6">优惠券管理</h1>
      <SkeletonTable rows={8} cols={6} />
    </div>
  );

  return (
    <div>
      <AdminBreadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">优惠券管理</h1>
          <p className="text-sm text-gray-500 mt-1">创建和管理优惠券码，让顾客在结账时享有折扣</p>
        </div>
        <button onClick={handleAdd} className="bg-blue text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-dark">
          + 新增优惠券
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">优惠券</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">折扣内容</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">最低消费</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">有效期</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">使用次数</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((coupon) => {
              const status = getStatus(coupon);
              return (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-lg text-blue">{coupon.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{getDiscountDisplay(coupon)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.minOrderAmount > 0 ? `¥ ${coupon.minOrderAmount.toLocaleString()}` : '无限制'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{coupon.startDate}</div>
                    <div>~ {coupon.endDate}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">{coupon.usedCount}</div>
                    {coupon.usageLimit && (
                      <div className="text-xs text-gray-400">/ {coupon.usageLimit}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleToggle(coupon)} className="text-xs text-gray-500 hover:text-blue mr-3">
                      {coupon.active ? '停用' : '启用'}
                    </button>
                    <button onClick={() => handleEdit(coupon)} className="text-blue text-sm hover:underline mr-3">编辑</button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-red-500 text-sm hover:underline">删除</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{formData.id ? '编辑优惠券' : '新增优惠券'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">优惠券</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="例如：SUMMER2025"
                  className="w-full px-4 py-2 border rounded-xl text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">折扣类型</label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  >
                    <option value="percentage">百分比 (%)</option>
                    <option value="fixed">固定金额 (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    {formData.discountType === 'percentage' ? '折扣百分比 (%)' : '折扣金额 (¥)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue || ''}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                  <label className="text-sm text-gray-500 block mb-1">最高折扣金额 (¥)</label>
                <input
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="仅适用于百分比折扣，不填表示无上限"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                  <label className="text-sm text-gray-500 block mb-1">最低消费金额 (¥)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount || 0}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">开始日期</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">结束日期</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">使用次数上限</label>
                <input
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="不填表示无上限"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm">启用</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-dark">保存</button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
