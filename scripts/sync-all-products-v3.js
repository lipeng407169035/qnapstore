/**
 * QNAP 产品同步脚本 v5 - 最终版
 * 1. 改进 URL 匹配逻辑
 * 2. 同步价格
 * 3. 下载缺失图片
 * 4. 生成详细报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 扩展 URL 变体
function generateUrlVariants(sku) {
  const base = sku.toLowerCase().replace(/\s+/g, '-');
  const variants = [
    // 基本变体
    base,
    // 带内存后缀
    base + '-4g',
    base + '-8g',
    base + '-2g',
    base + '-16g',
    base + '-4gx2',
    base + '-8gx2',
    base + '-4g x 2',
    base + '-8g x 2',
    // 移除 -RP 后缀
    base.replace(/-rp$/i, ''),
    base.replace(/-rp$/i, '') + '-4g',
    base.replace(/-rp$/i, '') + '-8g',
    base.replace(/-rp$/i, '') + '-2g',
    base.replace(/-rp$/i, '') + '-16g',
    // 特定型号变体
    base.replace(/-xeu$/i, '-xeu-2g'),
    base.replace(/-xeu$/i, '-xeu-8g'),
    base.replace(/-xeu$/i, '-xeu-4g'),
    // 处理 TBS 型号
    base.replace(/-tx$/i, '-tx-8g'),
    base.replace(/-tx$/i, '-tx-16g'),
    // 处理 TVS 型号
    base.replace(/-t$/i, '-t-8g'),
    base.replace(/-t$/i, '-t-16g'),
    // 企业级型号
    base.replace(/-r2$/i, ''),
    base.replace(/-r2$/i, '') + '-8g',
  ];
  // 移除重复并返回
  return [...new Set(variants)];
}

function cleanImageUrl(url) {
  return url
    .replace(/_grande|_small|_medium|_large|_720p|_1080p|_600x/gi, '')
    .replace(/\?v=\d+/, '');
}

async function fetchProductFromStore(sku) {
  const variants = generateUrlVariants(sku);

  for (const variant of variants) {
    const url = `https://store.qnap.com.tw/products/${variant}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (response.ok) {
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

        return { price, images, found: true, url: variant };
      }
    } catch (error) {
      // 继续
    }
  }

  return { price: null, images: [], found: false, tried: variants.slice(0, 3) };
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

async function processProduct(sku, index, total, forceUpdate) {
  process.stdout.write(`[${index + 1}/${total}] ${sku}... `);

  const skuDir = path.join(imagesDir, sku);
  const existingFiles = fs.existsSync(skuDir) ?
    fs.readdirSync(skuDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)) : [];
  const hasImages = existingFiles.length > 0;

  const productInfo = await fetchProductFromStore(sku);

  if (!productInfo.found) {
    console.log('NOT FOUND');
    return { sku, status: 'not_found', hasImages };
  }

  // 更新价格（如果强制更新或价格不同）
  let priceUpdated = false;
  if (productInfo.price) {
    const productIndex = db.products.findIndex(p => p.sku === sku);
    if (productIndex >= 0) {
      const oldPrice = db.products[productIndex].price;
      if (forceUpdate || oldPrice !== productInfo.price) {
        if (oldPrice !== productInfo.price) {
          db.products[productIndex].price = productInfo.price;
          priceUpdated = true;
        }
      }
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

  if (priceUpdated || forceUpdate) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  }

  const priceStr = productInfo.price ? `¥${productInfo.price}` : 'N/A';
  const updateStr = priceUpdated ? ' [UPDATED]' : '';
  const imgStr = hasImages ? '' : `[${downloadedCount} IMGS]`;
  console.log(`OK @ ${productInfo.url} ${priceStr}${updateStr}${imgStr}`);

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
  const forceUpdate = process.argv.includes('--force');

  console.log(`\n========================================`);
  console.log(`  QNAP 产品同步脚本 v5`);
  console.log(`========================================`);
  console.log(`总产品数: ${total}`);
  console.log(`Force update: ${forceUpdate}`);
  console.log(`\n开始同步...\n`);

  const startTime = Date.now();
  const results = {
    success: 0,
    notFound: 0,
    priceUpdated: 0,
    imagesDownloaded: 0,
    noChange: 0
  };

  const notFoundProducts = [];

  for (let i = 0; i < total; i++) {
    const result = await processProduct(products[i].sku, i, total, forceUpdate);

    if (result.status === 'success') {
      results.success++;
      if (result.priceUpdated) results.priceUpdated++;
      if (result.imagesDownloaded > 0) results.imagesDownloaded++;
    } else {
      results.notFound++;
      notFoundProducts.push(result.sku);
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n========================================`);
  console.log(`  同步完成`);
  console.log(`========================================`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功找到: ${results.success}`);
  console.log(`未找到: ${results.notFound}`);
  console.log(`价格更新: ${results.priceUpdated}`);
  console.log(`图片下载: ${results.imagesDownloaded}`);

  if (notFoundProducts.length > 0) {
    console.log(`\n未找到的产品 (${notFoundProducts.length}):`);
    notFoundProducts.slice(0, 20).forEach(sku => console.log(`  - ${sku}`));
    if (notFoundProducts.length > 20) {
      console.log(`  ... 还有 ${notFoundProducts.length - 20} 个`);
    }
  }

  // 验证数据库
  const updatedDirs = fs.readdirSync(imagesDir);
  console.log(`\n验证:`);
  console.log(`- 数据库产品: ${total}`);
  console.log(`- 图片目录: ${updatedDirs.length}`);
  console.log(`- 产品有图片: ${updatedDirs.filter(d => d !== 'placeholder.jpg').length}`);
}

main().catch(console.error);
