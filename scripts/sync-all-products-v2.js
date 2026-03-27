/**
 * QNAP 产品同步脚本 v4 - 改进URL匹配
 * 尝试多种 URL 格式来找到产品
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 可能的 URL 变体
function generateUrlVariants(sku) {
  const base = sku.toLowerCase().replace(/\s+/g, '-');
  const variants = [
    base,
    base + '-4g',
    base + '-8g',
    base + '-2g',
    base + '-16g',
    base + '-4gx2',
    base + '-8gx2',
    base.replace(/-rp$/i, ''),
    base.replace(/-rp$/i, '') + '-4g',
    base.replace(/-rp$/i, '') + '-8g',
  ];
  // 移除重复
  return [...new Set(variants)];
}

function cleanImageUrl(url) {
  return url
    .replace(/_grande|_small|_medium|_large|_720p|_1080p|_600x/gi, '')
    .replace(/\?v=\d+/, '');
}

async function fetchProductFromStore(sku) {
  const variants = generateUrlVariants(sku);

  // 尝试每个变体
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
      // 继续尝试下一个变体
    }
  }

  return { price: null, images: [], found: false, tried: variants };
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
    console.log('not found');
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

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

  const priceStr = productInfo.price ? `¥${productInfo.price}` : 'N/A';
  console.log(`found @ ${productInfo.url}, 价格: ${priceStr}`);

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

  console.log(`\n========== 产品同步 v4 ==========`);
  console.log(`总产品数: ${total}`);
  console.log(`\n开始同步...\n`);

  const startTime = Date.now();
  const results = { success: 0, notFound: 0, priceUpdated: 0 };

  // 只处理前30个进行测试
  const testCount = Math.min(30, total);

  for (let i = 0; i < testCount; i++) {
    const result = await processProduct(products[i].sku, i, testCount);

    if (result.status === 'success') {
      results.success++;
      if (result.priceUpdated) results.priceUpdated++;
    } else {
      results.notFound++;
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n========== 测试结果 (${testCount}个) ==========`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功找到: ${results.success}`);
  console.log(`未找到: ${results.notFound}`);
  console.log(`价格更新: ${results.priceUpdated}`);
}

main().catch(console.error);
