/**
 * QNAP 产品同步脚本 v3 - 综合版本
 * 1. 从 store.qnap.com.tw 同步产品价格
 * 2. 验证产品图片状态
 * 3. 报告同步结果
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function skuToStoreUrl(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-');
}

function cleanImageUrl(url) {
  return url
    .replace(/_grande|_small|_medium|_large|_720p|_1080p|_600x/gi, '')
    .replace(/\?v=\d+/, '');
}

async function fetchProductFromStore(sku) {
  const url = `https://store.qnap.com.tw/products/${skuToStoreUrl(sku)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return { price: null, images: [], found: false };
    }

    const html = await response.text();

    let price = null;
    const priceMatch = html.match(/"price":"([^"]+)"/);
    if (priceMatch) {
      price = parseInt(parseFloat(priceMatch[1]).toString());
    }

    const matches = html.match(/cdn.shopify.com\/s\/files\/[^\"'<>]+\.(png|jpg|jpeg|webp)/gi);
    let images = [];
    if (matches) {
      const cleaned = matches.map(url => 'https://' + cleanImageUrl(url));
      images = [...new Set(cleaned)];
      images = images.filter(url =>
        !url.includes('logo') && !url.includes('icon') &&
        !url.includes('sprite') && !url.includes('pavicon') &&
        !url.includes('swym') && url.match(/\.(png|jpg|jpeg|webp)$/i)
      );
    }

    return { price, images, found: true };
  } catch (error) {
    return { price: null, images: [], found: false, error: error.message };
  }
}

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

async function processProduct(sku, index, total) {
  process.stdout.write(`[${index + 1}/${total}] ${sku}... `);

  const skuDir = path.join(imagesDir, sku);
  const hasImages = fs.existsSync(skuDir) &&
    fs.readdirSync(skuDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).length > 0;

  const productInfo = await fetchProductFromStore(sku);

  if (!productInfo.found) {
    console.log('产品在store上不存在');
    return { sku, status: 'not_found', hasImages };
  }

  // 更新价格
  let priceUpdated = false;
  if (productInfo.price) {
    const productIndex = db.products.findIndex(p => p.sku === sku);
    if (productIndex >= 0 && db.products[productIndex].price !== productInfo.price) {
      const oldPrice = db.products[productIndex].price;
      db.products[productIndex].price = productInfo.price;
      priceUpdated = true;
    }
  }

  // 下载图片（如果没有）
  let downloadedCount = 0;
  if (!hasImages && productInfo.images.length > 0) {
    fs.mkdirSync(skuDir, { recursive: true });

    const frontImage = productInfo.images.find(url =>
      url.toLowerCase().includes('_front') || url.toLowerCase().includes('-front')
    );

    if (frontImage) {
      const frontPath = path.join(skuDir, 'Front.png');
      if (await downloadImage(frontImage, frontPath)) downloadedCount++;
    }

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
  }

  // 保存数据库
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

  const priceStr = productInfo.price ? `¥${productInfo.price}` : 'N/A';
  const imgStr = hasImages ? '(已有图片)' : downloadedCount > 0 ? `(下载${downloadedCount}张)` : '(无图片)';
  console.log(`价格: ${priceStr} ${imgStr}`);

  return {
    sku,
    status: 'success',
    hasImages,
    priceUpdated,
    price: productInfo.price,
    imagesDownloaded: downloadedCount
  };
}

async function main() {
  const products = db.products;
  const total = products.length;

  console.log(`\n========== 产品同步 ==========`);
  console.log(`总产品数: ${total}`);
  console.log(`图片目录: ${fs.readdirSync(imagesDir).length}`);
  console.log(`\n开始同步...\n`);

  const startTime = Date.now();
  const results = {
    success: 0,
    notFound: 0,
    priceUpdated: 0,
    imagesDownloaded: 0,
    noChange: 0
  };

  for (let i = 0; i < total; i++) {
    const result = await processProduct(products[i].sku, i, total);

    if (result.status === 'success') {
      results.success++;
      if (result.priceUpdated) results.priceUpdated++;
      if (result.imagesDownloaded > 0) results.imagesDownloaded++;
    } else if (result.status === 'not_found') {
      results.notFound++;
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n========== 同步完成 ==========`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功获取: ${results.success}`);
  console.log(`产品未找到: ${results.notFound}`);
  console.log(`价格更新: ${results.priceUpdated}`);
  console.log(`图片下载: ${results.imagesDownloaded}`);
}

main().catch(console.error);
