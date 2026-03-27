/**
 * QNAP Store 产品同步脚本 v2
 * 从 store.qnap.com.tw 获取产品信息并同步到本地商城
 * 修复价格提取和图片URL处理
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 确保图片目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// SKU 转换为 store URL 格式
function skuToStoreUrl(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-');
}

// 清理图片URL（移除 grande 等后缀）
function cleanImageUrl(url) {
  return url
    .replace(/_grande|_small|_medium|_large|_720p|_1080p|_600x/gi, '')
    .replace(/\?v=\d+/, ''); // 移除版本参数
}

// 从 store.qnap.com.tw 获取产品信息
async function fetchProductFromStore(sku) {
  const url = `https://store.qnap.com.tw/products/${skuToStoreUrl(sku)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // 提取价格 - 多种模式
    let price = null;
    const pricePatterns = [
      /¥\s*([\d,]+)/,
      /TWD\s*([\d,]+)/,
      /NT\$\s*([\d,]+)/,
      /"price":"([^"]+)"/,
      /data-price="([^"]+)"/
    ];

    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        price = parseInt(match[1].replace(/,/g, ''));
        if (price > 0) break;
      }
    }

    // 提取所有 Shopify CDN 图片
    const matches = html.match(/cdn.shopify.com\/s\/files\/[^\"'<>]+\.(png|jpg|jpeg|webp)/gi);
    let images = [];
    if (matches) {
      // 清理URL
      const cleaned = matches.map(url => 'https://' + cleanImageUrl(url));
      // 去重
      images = [...new Set(cleaned)];
      // 过滤掉非产品图片
      images = images.filter(url =>
        !url.includes('logo') &&
        !url.includes('icon') &&
        !url.includes('sprite') &&
        !url.includes('pavicon') &&
        !url.includes('swym') &&
        url.match(/\.(png|jpg|jpeg|webp)$/i) // 确保有图片扩展名
      );
    }

    return {
      price,
      images
    };
  } catch (error) {
    console.error(`获取 ${sku} 失败:`, error.message);
    return null;
  }
}

// 下载图片
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

// 处理单个产品
async function processProduct(sku, index, total) {
  process.stdout.write(`[${index + 1}/${total}] ${sku}... `);

  const skuDir = path.join(imagesDir, sku);

  // 如果产品图片目录已存在且有图片，跳过
  if (fs.existsSync(skuDir)) {
    const files = fs.readdirSync(skuDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    if (files.length > 0) {
      console.log('已有图片，跳过');
      return { sku, skipped: true };
    }
  }

  // 获取产品信息
  const productInfo = await fetchProductFromStore(sku);

  if (!productInfo || !productInfo.images || productInfo.images.length === 0) {
    console.log('未找到信息或图片');
    return { sku, success: false };
  }

  // 创建产品目录
  fs.mkdirSync(skuDir, { recursive: true });

  // 下载图片
  let downloadedCount = 0;

  // 优先下载 front 图片
  const frontImage = productInfo.images.find(url =>
    url.toLowerCase().includes('_front') ||
    url.toLowerCase().includes('-front') ||
    url.toLowerCase().includes('/front')
  );

  if (frontImage) {
    const frontPath = path.join(skuDir, 'Front.png');
    if (await downloadImage(frontImage, frontPath)) {
      downloadedCount++;
    }
  }

  // 下载其他图片
  let imgIndex = 1;
  for (const imageUrl of productInfo.images) {
    if (frontImage && imageUrl === frontImage) continue;

    const ext = imageUrl.match(/\.(png|jpg|jpeg|webp)$/i)?.[0] || '.png';
    const imagePath = path.join(skuDir, `image_${imgIndex}${ext}`);

    if (await downloadImage(imageUrl, imagePath)) {
      downloadedCount++;
      imgIndex++;
    }
  }

  // 更新数据库中的产品信息
  if (productInfo.price) {
    const productIndex = db.products.findIndex(p => p.sku === sku);
    if (productIndex >= 0) {
      db.products[productIndex].price = productInfo.price;
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  }

  console.log(`✓ (${downloadedCount} 张图片, 价格: ${productInfo.price || 'N/A'})`);
  return { sku, success: true, count: downloadedCount, price: productInfo.price };
}

// 主函数
async function main() {
  const skus = db.products.map(p => p.sku);
  const total = skus.length;

  console.log(`\n开始同步 ${total} 个产品...\n`);

  const startTime = Date.now();
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < total; i++) {
    const result = await processProduct(skus[i], i, total);

    if (result.skipped) skipCount++;
    else if (result.success) successCount++;
    else failCount++;

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n=== 同步完成 ===`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功: ${successCount}`);
  console.log(`跳过: ${skipCount}`);
  console.log(`失败: ${failCount}`);
}

main().catch(console.error);
