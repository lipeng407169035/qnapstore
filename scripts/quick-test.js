/**
 * 快速测试 - 只测试前20个产品
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

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

async function main() {
  const products = db.products.slice(0, 20); // 只测试前20个
  const total = products.length;

  console.log(`\n========== 快速测试 (${total}个产品) ==========\n`);

  const results = { found: 0, notFound: 0, priceUpdated: 0 };
  const prices = [];

  for (let i = 0; i < total; i++) {
    const p = products[i];
    process.stdout.write(`[${i + 1}/${total}] ${p.sku}... `);

    const productInfo = await fetchProductFromStore(p.sku);

    if (!productInfo.found) {
      console.log('not found');
      results.notFound++;
    } else {
      results.found++;
      if (productInfo.price) {
        const oldPrice = p.price;
        const newPrice = productInfo.price;
        if (oldPrice !== newPrice) {
          p.price = newPrice;
          results.priceUpdated++;
          console.log(`价格更新: ${oldPrice} -> ${newPrice}`);
        } else {
          console.log(`价格: ${newPrice} (不变)`);
        }
        prices.push({ sku: p.sku, price: newPrice });
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // 保存更新的价格
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

  console.log(`\n========== 测试结果 ==========`);
  console.log(`产品找到: ${results.found}`);
  console.log(`产品未找到: ${results.notFound}`);
  console.log(`价格更新: ${results.priceUpdated}`);

  // 导出价格列表供分析
  console.log(`\n获取到的价格:`);
  prices.forEach(({ sku, price }) => {
    console.log(`  ${sku}: ¥${price}`);
  });
}

main().catch(console.error);
