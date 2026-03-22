'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore, useUserStore, usePointsStore } from '@/store';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { addPoints } = usePointsStore();
  
  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    paymentMethod: 'credit',
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [paymentQR, setPaymentQR] = useState<string | null>(null);

  const subtotal = getTotal();
  const shipping = subtotal >= 3000 ? 0 : 150;
  const total = subtotal + shipping;
  const pointsEarned = Math.floor(subtotal / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('请先登录');
      router.push('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      alert('购物车是空的');
      return;
    }
    if (!form.shippingName || !form.shippingPhone || !form.shippingAddress) {
      alert('请填写完整收件信息');
      return;
    }

    setLoading(true);
    try {
      const order = {
        userId: user.id,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingName: form.shippingName,
        shippingPhone: form.shippingPhone,
        shippingAddress: form.shippingAddress,
        paymentMethod: form.paymentMethod,
        total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error('Order failed');

      const orders = JSON.parse(localStorage.getItem('qnap_orders') || '[]');
      const newOrder = {
        id: `order-${Date.now()}`,
        orderNo: `QNAP${Date.now()}`,
        ...order,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: items.map(item => ({
          ...item,
          price: item.product.price,
        })),
        pointsEarned,
      };
      orders.push(newOrder);
      localStorage.setItem('qnap_orders', JSON.stringify(orders));

      addPoints(pointsEarned, `订单 ${newOrder.orderNo} 消费获得`);

      const simulatedEmail = user.email || email;

      if (form.paymentMethod === 'alipay' || form.paymentMethod === 'wechat') {
        clearCart();
        setPaymentStatus('pending');
        setPaymentQR(form.paymentMethod === 'alipay' ? 'alipay-qr' : 'wechat-qr');
        setLoading(false);
        return;
      }

      clearCart();
      alert(`✅ 订单建立成功！\n\n📧 确认信已发送至：${simulatedEmail}\n📦 订单编号：${newOrder.orderNo}\n⭐ 本次获得积分：${pointsEarned} 点\n\n💡 积分可在下次消费时折抵`);
      router.push('/orders');
    } catch (error) {
      alert('建立订单失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">购物车是空的</h2>
          <Link href="/products"><Button variant="blue">开始购物</Button></Link>
        </div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
      <h1 className="font-barlow text-xl md:text-2xl font-extrabold mb-4 md:mb-6">结账</h1>
      
      <div className="flex flex-col lg:flex-row gap-4 md:gap-7">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="font-barlow font-bold text-lg mb-5">收件信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">收件人姓名 *</label>
                <input
                  type="text"
                  value={form.shippingName}
                  onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">联络电话 *</label>
                <input
                  type="tel"
                  value={form.shippingPhone}
                  onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">收件地址 *</label>
                <input
                  type="text"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
                  required
                />
              </div>
              {!user && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email（用于发送订单确认）</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="font-barlow font-bold text-lg mb-5">付款方式</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'alipay', label: '支付宝 Alipay', desc: '中国大陆首选', icon: '💙' },
                { value: 'wechat', label: '微信支付 WeChat Pay', desc: '中国大陆首选', icon: '💚' },
                { value: 'unionpay', label: '🏦 银联支付', desc: '银行卡直接支付', icon: '🏦' },
                { value: 'cod', label: '📦 货到付款', desc: '送货上门后再付款', icon: '📦' },
              ].map(method => (
                <label key={method.value} className={`border rounded-xl p-3 cursor-pointer flex items-center gap-3 text-sm transition-all ${
                  form.paymentMethod === method.value ? 'border-blue bg-blue-50 ring-2 ring-blue' : 'border-gray-200 hover:border-blue'
                }`}>
                  <input type="radio" name="payment" value={method.value}
                    checked={form.paymentMethod === method.value}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="accent-blue"
                  />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {(form.paymentMethod === 'alipay' || form.paymentMethod === 'wechat') && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{form.paymentMethod === 'alipay' ? '💙' : '💚'}</span>
                  <div>
                    <p className="font-bold text-blue-800">{form.paymentMethod === 'alipay' ? '支付宝 Alipay' : '微信支付 WeChat Pay'}</p>
                    <p className="text-xs text-blue-600">扫描下方 QR Code 完成付款</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-5xl">
                      {form.paymentMethod === 'alipay' ? '💙' : '💚'}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">扫码支付</p>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-2">付款说明：</p>
                    <ul className="space-y-1 text-xs text-blue-600">
                      <li>1. 请使用支付宝/微信扫描上方 QR Code</li>
                      <li>2. 确认付款金额：<strong>¥ {total.toLocaleString()}</strong></li>
                      <li>3. 完成付款后，系统将自动确认</li>
                      <li>4. 付款期限：<strong>30 分钟</strong>内有效</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? '处理中...' : `确认订单 ¥ ${total.toLocaleString()}`}
          </Button>
        </form>

        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 sticky top-20">
            <h2 className="font-barlow font-bold mb-4">订单内容</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-10 rounded" style={{ background: item.product.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">¥ {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between"><span className="text-muted">小计</span><span>¥ {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted">运费</span><span>{shipping === 0 ? '免运' : `¥ ${shipping}`}</span></div>
              {pointsEarned > 0 && (
                <div className="flex justify-between text-green-600"><span>积分回馈</span><span>+{pointsEarned} 点</span></div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>总计</span>
                <span className="text-orange">¥ {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <p>📧 订单确认信将发送至您的 Email</p>
              <p>⭐ 消费 ¥{pointsEarned * 100} 可获得 {pointsEarned} 点积分</p>
              <p>💡 积分 1 点 = ¥1 可折抵</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alipay/WeChat Payment Modal */}
      {paymentStatus === 'pending' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full text-center">
            <div className="p-8">
              <div className="text-6xl mb-4">{paymentQR === 'alipay-qr' ? '💙' : '💚'}</div>
              <h2 className="text-2xl font-bold mb-2">
                {paymentQR === 'alipay-qr' ? '支付宝付款' : '微信支付'}
              </h2>
              <p className="text-gray-500 mb-1">订单金额</p>
              <p className="text-4xl font-bold text-orange mb-4">¥ {total.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mb-6">
                请使用支付宝 / 微信扫描下方 QR Code
              </p>
              <div className="bg-gray-50 rounded-xl p-4 inline-block mb-6">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mx-auto">
                  <div className="text-center">
                    <div className="text-5xl mb-2">{paymentQR === 'alipay-qr' ? '💙' : '💚'}</div>
                    <p className="text-xs text-gray-400">
                      {paymentQR === 'alipay-qr' ? '支付宝 QR Code' : '微信支付 QR Code'}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-1">付款限时 30 分钟</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6 text-sm text-gray-500">
                <p>⚠️ 请在 <strong>30 分钟</strong>内完成付款</p>
                <p>✅ 付款成功后，系统将自动发送确认邮件</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setPaymentStatus(null); setPaymentQR(null); router.push('/orders'); }}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600"
                >
                  我已付款 ✅
                </button>
                <button
                  onClick={() => { setPaymentStatus(null); setPaymentQR(null); }}
                  className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
