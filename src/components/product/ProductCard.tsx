import { clsx } from 'clsx';
import { Product } from '@/types';
import Link from 'next/link';
import { useState, useEffect, useCallback, memo } from 'react';
import { useCartStore, useWishlistStore } from '@/store';
import { toast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  imageUrl?: string;
}

export const ProductCard = memo(function ProductCard({ product, onAddToCart, imageUrl }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(imageUrl || '');
  const [loaded, setLoaded] = useState(!!imageUrl);
  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || {});
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (imageUrl) {
      setImageSrc(imageUrl);
      setLoaded(true);
      return;
    }
    setLoaded(false);
    setImageSrc('');
    fetch(`/api/images/${product.sku}`)
      .then(r => r.json())
      .then((files: { url: string }[]) => {
        if (files.length > 0) setImageSrc(files[0].url);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [product.sku, imageUrl]);

  const handleAddToCart = useCallback(() => {
    if (product.stock === 0) {
      toast.warning('该商品已缺货');
      return;
    }
    addItem(product);
    toast.success('已加入购物车！');
    onAddToCart?.();
  }, [product, addItem, onAddToCart]);

  const handleWishlistToggle = useCallback(() => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      toast.success('已加入收藏！');
    }
  }, [product, isInWishlist, addToWishlist, removeFromWishlist]);

  const handleCompare = useCallback(() => {
    const current = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).getAll('s') : [];
    const sku = product.sku;
    const params = new URLSearchParams();
    if (current.includes(sku)) {
      current.filter(s => s !== sku).forEach(s => params.append('s', s));
    } else if (current.length < 4) {
      [...current, sku].forEach(s => params.append('s', s));
    } else {
      toast.warning('最多只能对比4个商品');
      return;
    }
    window.location.href = `/compare${params.toString() ? '?' + params.toString() : ''}`;
  }, [product.sku]);

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue/50 flex flex-col relative">
      {product.badge && (
        <span
          className={clsx(
            'absolute top-3 left-3 z-20 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm',
            {
              'bg-orange': product.badge === '热销' || product.badge === '热销',
              'bg-green-500': product.badge === '新品',
              'bg-red-500': product.badge === '特价' || product.badge === '限时',
              'bg-purple-600': product.badge === '旗舰',
            }
          )}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          {product.badge}
        </span>
      )}
      <Link href={`/products/${product.sku}`}>
        <div className="h-48 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center relative overflow-hidden p-4">
          {!loaded && (
            <div className="w-36 h-24 rounded-xl flex flex-col items-center justify-center gap-2" style={{ background: `linear-gradient(145deg, ${product.color} 0%, ${product.color}cc 100%)`, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
              <div className="w-32 h-4 bg-black/20 rounded-lg flex items-center px-2 gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <div className="flex-1 h-1.5 bg-black/20 rounded" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-white/40 font-mono font-bold tracking-widest">{product.sku}</span>
            </div>
          )}
          {loaded && imageSrc && (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <span className="text-xs text-blue font-semibold uppercase tracking-wider mb-1.5">
            {product.series}
          </span>
          <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {Object.entries(specs).slice(0, 3).map(([key, value]) => (
              <span key={key} className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                {String(value)}
              </span>
            ))}
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-barlow font-extrabold text-orange">
                ¥ {product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  ¥ {product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-sm">
              <span>★</span>
              <span className="text-gray-600 font-medium">{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex gap-2">
        {product.stock === 0 ? (
          <div className="flex-1 bg-gray-200 text-gray-500 py-2.5 px-4 rounded-xl text-sm font-semibold text-center cursor-not-allowed">
            缺货
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all hover:bg-blue-dark active:scale-95 shadow-md hover:shadow-lg"
          >
            加入购物车
          </button>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`w-11 h-11 border rounded-xl flex items-center justify-center text-lg transition-all flex-shrink-0 ${
            inWishlist ? 'border-red-300 bg-pink-50 text-red-500' : 'border-gray-200 hover:border-red-300 text-gray-400'
          }`}
          title={inWishlist ? '取消收藏' : '添加收藏'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
        <button
          onClick={handleCompare}
          className="w-11 h-11 border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-blue hover:text-blue transition-all flex-shrink-0"
          title="商品对比"
        >
          ⚖️
        </button>
      </div>
      {product.stock < 20 && product.stock > 0 && (
        <div className="absolute bottom-20 right-3 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
          仅存 {product.stock} 件
        </div>
      )}
    </div>
  );
});
