'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, Review } from '@/types';
import { api } from '@/lib/api';
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from '@/store';
import { Button } from '@/components/ui/Button';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sku = params.sku as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<string[]>([]);

  const displayImages = productImages.length > 0
    ? productImages
    : Array.from({ length: 6 }, (_, i) => `/images/products/${sku}/${i + 1}.svg`);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addItem, items } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToRecent } = useRecentlyViewedStore();

  useEffect(() => {
    if (!sku) return;
    Promise.all([
      api.getProductBySku(sku),
      api.getProducts({}),
      fetch(`/api/images/${sku}`).then(r => r.json()),
    ]).then(([prod, allProds, images]) => {
      setProduct(prod as Product);
      const p = prod as Product;
      const all = allProds as Product[];
      setRelatedProducts(all.filter(pr => pr.categoryId === p.categoryId && pr.sku !== sku).slice(0, 4));
      setProductImages(Array.isArray(images) ? images.map((f: { url: string }) => f.url) : []);
      api.getProductReviews(p.id).then((data) => setReviews(data as Review[]));
      addToRecent(p);
      setLoading(false);
    }).catch(() => {
      router.push('/products');
    });
  }, [sku, router, addToRecent]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      alert('已加入购物车！');
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      alert('已加入收藏！');
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !reviewComment.trim() || !reviewName.trim()) {
      alert('请填写姓名和评论内容');
      return;
    }
    setReviewSubmitting(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      setReviewSuccess(true);
      setReviewComment('');
      setReviewRating(5);
      setReviewName('');
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch {
      alert('提交失败，请稍后再试');
    }
    setReviewSubmitting(false);
  };

  if (loading) return <div className="py-20 text-center">加载中...</div>;
  if (!product) return <div className="py-20 text-center">商品不存在</div>;

  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || {});
  const inCart = items.some(item => item.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const specLabels: Record<string, string> = {
    bays: '硬盘槽数', cpu: '处理器', ram: '内存', network: '网络',
    ports: '连接端口', ports_sfp: 'SFP+ 连接端口', ports_rj45: 'RJ45 连接端口',
    poe_ports: 'PoE 连接端口', uplink: '上行连接端口', total_power: 'PoE 功率',
    interface: '接口', speed: '传输速度', connector: '连接器',
    channels: '频道数', type: '类型', period: '期限',
    capacity: '容量', form: '机型', wattage: '功率', watt: '功率',
    max_capacity: '最大容量', dimensions: '尺寸', weight: '重量',
    warranty: '质保', color: '颜色', protocols: '通讯协议',
    Poe: 'PoE 供电', PoeBudget: 'PoE 供电瓦数', managed: '管理类型',
    formFactor: '外型规格', bandwidth: '带宽', flash: '闪存',
    power: '电源', ventilation: '风扇', operating: '操作系统',
  };


  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-blue">首页</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue">商品列表</Link>
            <span>/</span>
            <Link href={`/products?category=${(product as any).categorySlug}`} className="hover:text-blue">{(product as any).categoryName}</Link>
            <span>/</span>
            <span className="text-gray-700">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-5 md:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
            <div className="space-y-3 md:space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-8 aspect-square flex items-center justify-center">
                <img
                  src={displayImages[selectedImageIndex]}
                  alt={`${product.name} - 图片 ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-6 gap-1.5 md:gap-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden p-1 transition-all ${
                      selectedImageIndex === idx ? 'border-blue' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`缩图 ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-blue font-semibold uppercase tracking-wide">{(product as any).categoryName || product.series}</span>
            <h1 className="font-barlow text-3xl font-extrabold text-gray-900 mt-1 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-amber-500">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                <span className="text-muted ml-1">({product.reviews} 则评论)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <p className="text-4xl font-barlow font-extrabold text-orange">¥ {product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-lg text-gray-400 line-through">¥ {product.originalPrice.toLocaleString()}</p>
              )}
            </div>

            {product.stock === 0 ? (
              <div className="mb-4">
                <p className="text-red-500 font-medium mb-2">缺货</p>
                <button
                  onClick={() => alert('到货提醒已订阅！到货后我们会通过短信和邮件通知您')}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  🔔 到货通知
                </button>
              </div>
            ) : product.stock < 20 ? (
              <p className="text-orange-500 font-medium mb-4">仅存 {product.stock} 件，建议尽快购买</p>
            ) : (
              <p className="text-green-600 font-medium mb-4">有货</p>
            )}

            <p className="text-sm text-muted leading-relaxed mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium">数量：</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-10 bg-gray-50 font-bold hover:bg-gray-100 transition-colors">-</button>
                <input type="text" value={quantity} readOnly className="w-14 h-10 text-center border-none outline-none font-semibold" />
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-10 bg-gray-50 font-bold hover:bg-gray-100 transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button variant="primary" size="lg" onClick={handleAddToCart} className="flex-1" disabled={product.stock === 0}>
                {inCart ? '已加入购物车' : '加入购物车'}
              </Button>
              <button
                onClick={handleWishlistToggle}
                className={`w-12 h-12 border rounded-xl flex items-center justify-center text-xl transition-all ${
                  inWishlist ? 'border-red-300 bg-pink-50 text-red-500' : 'border-gray-200 hover:border-red-300 text-gray-400'
                }`}
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>
              <button
                onClick={() => router.push('/compare')}
                className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-blue hover:text-blue transition-all"
                title="商品对比"
              >
                ⚖️
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-3.5">规格</h3>
              <div className="space-y-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="w-40 text-muted font-medium flex-shrink-0">
                      {specLabels[key] || key}
                    </span>
                    <span className="text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="order-2 md:order-1">
            <section>
              <h2 className="font-barlow text-2xl font-bold text-gray-900 mb-5">商品评论 ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-muted text-center py-10 bg-white rounded-xl border border-gray-200">暂无评论，欢迎抢先评论</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {review.userName.charAt(0)}
                          </div>
                          <span className="font-semibold">{review.userName}</span>
                        </div>
                        <span className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="text-amber-500 mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h3 className="font-barlow text-xl font-bold mb-4">撰写评论</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                {reviewSuccess ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">✅</div>
                    <p className="text-green-600 font-medium">评论已提交，等待管理员审核！</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">您的姓名</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        placeholder="请输入姓名"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">评分</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-2xl transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted self-center">
                          {['很差', '差', '一般', '满意', '非常满意'][reviewRating - 1]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">评论内容</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="分享您的使用心得..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue resize-none"
                      />
                    </div>
                    <Button variant="blue" size="md" onClick={handleSubmitReview} disabled={reviewSubmitting}>
                      {reviewSubmitting ? '提交中...' : '提交评论'}
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="order-1 md:order-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <h3 className="font-bold text-sm mb-3">配送信息</h3>
              <div className="space-y-2 text-sm text-muted">
                <p>🚚 满 ¥3,000 免运</p>
                <p>📦 现货 1-2 个工作天出货</p>
                <p>🛡️ 原厂质保 2 年</p>
                <p>💳 花呗/白条分期</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <h3 className="font-bold text-sm mb-3">热销排行</h3>
              {relatedProducts.slice(0, 3).map(p => (
                <Link key={p.id} href={`/products/${p.sku}`} className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color }}>
                    <img src={`/images/products/${p.sku}/1.svg`} alt={p.name} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                    <p className="text-xs font-bold text-orange">¥ {p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-barlow text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-5">相关商品</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.sku}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue hover:shadow-lg transition-all">
                  <div className="h-32 flex items-center justify-center mb-3 p-2">
                    <img src={`/images/products/${p.sku}/1.svg`} alt={p.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 mb-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-barlow font-extrabold text-orange">¥ {p.price.toLocaleString()}</p>
                    <span className="text-amber-500 text-xs">★ {p.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
