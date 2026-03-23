import { clsx } from 'clsx';
import { Product } from '@/types';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(`/images/products/${product.sku}/1.svg`);
  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || {});

  useEffect(() => {
    fetch(`/api/images/${product.sku}`)
      .then(r => r.json())
      .then((files: { url: string }[]) => {
        if (files.length > 0) setImageSrc(files[0].url);
      })
      .catch(() => {});
  }, [product.sku]);

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
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-36 h-24 rounded-xl flex flex-col items-center justify-center gap-2" style="background: linear-gradient(145deg, ${product.color} 0%, ${product.color}cc 100%); box-shadow: 0 12px 32px rgba(0,0,0,0.25)">
                  <div class="w-32 h-4 bg-black/20 rounded-lg flex items-center px-2 gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <div class="flex-1 h-1.5 bg-black/20 rounded" />
                    <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  </div>
                  <span class="text-[10px] text-white/40 font-mono font-bold tracking-widest">${product.sku}</span>
                </div>
              `;
            }}
          />
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
      {product.stock === 0 ? (
        <div className="mx-4 mb-4 bg-gray-200 text-gray-500 py-2.5 px-4 rounded-xl text-sm font-semibold text-center cursor-not-allowed">
          缺货
        </div>
      ) : (
        <>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart?.(); }}
            className="mx-4 mb-4 bg-blue text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all hover:bg-blue-dark active:scale-95 shadow-md hover:shadow-lg"
          >
            加入购物车
          </button>
          {product.stock < 20 && (
            <div className="absolute bottom-12 right-3 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
              仅存 {product.stock} 件
            </div>
          )}
        </>
      )}
    </div>
  );
}
