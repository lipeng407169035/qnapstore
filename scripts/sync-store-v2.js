/**
 * QNAP Store 图片同步脚本 v2
 * 从 store.qnap.com.tw 下载缺失的产品图片
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

// 缺失图片的产品列表
const MISSING_PRODUCTS = [
  'TS-264', 'TS-364', 'TS-433', 'TS-216G',
  'TS-1683XU-RP', 'QSW-1105-5T', 'QSW-M2116P', 'QSW-2108-8S2T',
  'QSW-3226-8T2S', 'QSW-M4524-8T2S', 'UX-1200U-RP', 'TR-004',
  'QXG-10G1T', 'QXG-25G2SF', 'QNA-UC5G1T', 'LIC-NVR-4CH',
  'LIC-VJBOD-1Y', 'LIC-QVRPro-8CH', 'QEWS-2Y', 'QEWS-3Y',
  'QEWS-5Y', 'RAM-8GDDR4', 'RAM-16GDDR5', 'RAM-32GDDR4',
  'RAM-32GDDR5', 'TR-002', 'TR-004U', 'ES1686dc-R2',
  'TDS-h2489FU-R2'
];

// SKU 到 store URL handle 的映射
function skuToStoreUrl(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-');
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 获取产品的所有图片 URL
async function getProductImagesFromStore(sku) {
  const handle = skuToStoreUrl(sku);
  const url = `https://store.qnap.com.tw/products/${handle}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    // 查找所有 Shopify CDN 图片
    const matches = html.match(/cdn.shopify.com\/s\/files\/[^\"'<>]+\.(png|jpg|jpeg|webp)/gi);
    if (!matches) {
      return [];
    }

    // 去重并过滤非产品图片
    const uniqueUrls = [...new Set(matches)].filter(url => {
      if (url.includes('logo') || url.includes('icon') || url.includes('sprite') || url.includes('pavicon')) {
        return false;
      }
      return true;
    });

    return uniqueUrls.map(url => 'https://' + url);
  } catch (error) {
    return [];
  }
}

// 下载单个图片
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

// 处理单个产品
async function processProduct(sku, index) {
  process.stdout.write(`[${index + 1}/${MISSING_PRODUCTS.length}] ${sku}... `);

  // 检查是否已有图片
  const skuDir = path.join(imagesDir, sku);
  if (fs.existsSync(skuDir) && fs.readdirSync(skuDir).length > 0) {
    console.log('已有图片，跳过');
    return { sku, success: true, count: 0, skipped: true };
  }

  // 获取图片 URL
  const imageUrls = await getProductImagesFromStore(sku);

  if (imageUrls.length === 0) {
    console.log('未找到图片');
    return { sku, success: false, count: 0 };
  }

  // 创建目录
  ensureDir(skuDir);

  // 下载所有图片
  let downloadedCount = 0;
  let frontImageUrl = null;

  // 优先找 front 图片
  for (const imageUrl of imageUrls) {
    const urlLower = imageUrl.toLowerCase();
    if (urlLower.includes('_front') || urlLower.includes('-front') || urlLower.includes('/front') || urlLower.includes('front_')) {
      frontImageUrl = imageUrl;
      break;
    }
  }

  // 下载 front 图片
  if (frontImageUrl) {
    const frontPath = path.join(skuDir, 'Front.png');
    const success = await downloadImage(frontImageUrl, frontPath);
    if (success) downloadedCount++;
  }

  // 下载其他图片
  let imgIndex = 1;
  for (const imageUrl of imageUrls) {
    if (frontImageUrl === imageUrl) continue; // skip front as we already downloaded

    const imagePath = path.join(skuDir, `image_${imgIndex}.png`);
    const success = await downloadImage(imageUrl, imagePath);
    if (success) {
      downloadedCount++;
      imgIndex++;
    }
  }

  // 如果没有 front.png，用第一张图片
  if (!fs.existsSync(path.join(skuDir, 'Front.png')) && downloadedCount > 0) {
    const files = fs.readdirSync(skuDir);
    if (files.length > 0) {
      const content = fs.readFileSync(path.join(skuDir, files[0]));
      fs.writeFileSync(path.join(skuDir, 'Front.png'), content);
    }
  }

  console.log(`✓ (${downloadedCount} 张)`);
  return { sku, success: downloadedCount > 0, count: downloadedCount };
}

// 主函数
async function main() {
  console.log(`\n开始从 store.qnap.com.tw 下载 ${MISSING_PRODUCTS.length} 款缺失产品的图片...\n`);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  let totalImages = 0;

  for (let i = 0; i < MISSING_PRODUCTS.length; i++) {
    const result = await processProduct(MISSING_PRODUCTS[i], i);

    if (result.skipped) {
      skipCount++;
    } else if (result.success) {
      successCount++;
      totalImages += result.count;
    } else {
      failCount++;
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n同步完成!`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功: ${successCount} 款产品`);
  console.log(`跳过: ${skipCount} 款产品`);
  console.log(`失败: ${failCount} 款产品`);
  console.log(`新增图片: ${totalImages} 张`);
}

main().catch(console.error);
