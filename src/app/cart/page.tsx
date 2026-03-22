'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore, useUserStore } from '@/store';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLabel, setCouponLabel] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setCouponError('');

    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(promoCode.toUpperCase())}&amount=${getTotal()}`);
      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || '优惠码无效');
        setDiscount(0);
        setCouponLabel('');
        return;
      }

      setDiscount(data.discount);
      setCouponLabel(data.coupon.discountType === 'percentage'
        ? `${data.coupon.discountValue}% off${data.coupon.maxDiscount ? ` (上限 ¥${data.coupon.maxDiscount})` : ''}`
        : `¥ ${data.coupon.discountValue} 折抵`
      );
    } catch {
      setCouponError('验证失败，请稍后再试');
    }
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 3000 ? 0 : 150;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-2">购物车是空的</h2>
          <p className="text-muted mb-6">快去选购心仪的商品吧！</p>
          <Link href="/products">
            <Button variant="blue">开始购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <h1 className="font-barlow text-xl md:text-2xl font-extrabold mb-4 md:mb-6">购物车</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-7">
        {/* Items */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-barlow font-bold">商品清单</h2>
              <button onClick={clearCart} className="text-xs text-muted hover:text-red-500">清空购物车</button>
            </div>
            {items.map((item) => (
              <div key={item.productId} className="p-3 md:p-5 border-b border-gray-50 flex items-center gap-3 md:gap-4 hover:bg-gray-50 transition-colors">
                <div 
                  className="w-16 md:w-20 h-12 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.product.color, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.sku}`} className="font-semibold text-xs md:text-sm hover:text-blue block truncate">{item.product.name}</Link>
                  <p className="text-[10px] md:text-xs text-muted mt-0.5">{item.product.sku}</p>
                  <p className="font-barlow font-bold text-orange text-sm md:hidden">¥ {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 rounded font-bold hover:bg-gray-200">-</button>
                  <span className="w-6 md:w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 rounded font-bold hover:bg-gray-200">+</button>
                </div>
                <div className="text-right w-24 md:w-28 flex-shrink-0 hidden md:block">
                  <p className="font-barlow font-bold text-orange">¥ {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-500 p-1 flex-shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 sticky top-20">
            <h2 className="font-barlow font-bold text-lg mb-4">订单摘要</h2>
            
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted">小计</span>
                <span>¥ {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>折扣{couponLabel && ` (${couponLabel})`}</span>
                  <span>- ¥ {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">运费</span>
                <span>{shipping === 0 ? '免运' : `¥ ${shipping}`}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-lg">
                <span>总计</span>
                <span className="text-orange">¥ {Math.max(0, total).toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="输入优惠码"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setCouponError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-1"
              />
              {couponError && <p className="text-xs text-red-500 mb-1">{couponError}</p>}
              <button onClick={handleApplyPromo} className="w-full text-sm text-blue hover:underline">套用优惠码</button>
            </div>

            <Link href={user ? '/checkout' : '/login?redirect=/checkout'}>
              <Button variant="primary" size="lg" className="w-full">前往结账</Button>
            </Link>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-muted space-y-1">
              <p>🚚 满 ¥3,000 免运</p>
              <p>🛡️ 原厂质保</p>
              <p>💳 花呗/白条分期</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
