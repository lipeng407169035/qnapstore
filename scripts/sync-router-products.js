/**
 * QNAP 路由器产品同步脚本
 * 从 QNAP 官网抓取路由器产品图片
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
const dbPath = path.join(__dirname, '..', 'server', 'db.json');

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// QNAP 路由器产品列表 (从 compare-routers 页面获取)
const PRODUCTS = [
  // QHora 系列
  { sku: 'QHora-301W', name: 'QHora-301W Wi-Fi 6 双频 AX3600', categorySlug: 'routers', categoryName: '路由器', categoryId: 9 },
  { sku: 'QHora-321', name: 'QHora-321 6x 2.5GbE 端口', categorySlug: 'routers', categoryName: '路由器', categoryId: 9 },
  { sku: 'QHora-322', name: 'QHora-322 3x 10GbE + 6x 2.5GbE', categorySlug: 'routers', categoryName: '路由器', categoryId: 9 },

  // QMiro 系列
  { sku: 'QMiro-201W', name: 'QMiro-201W Wi-Fi Mesh AC2200', categorySlug: 'routers', categoryName: '路由器', categoryId: 9 },
  { sku: 'QMiroPlus-201W', name: 'QMiroPlus-201W Wi-Fi Mesh AC2200', categorySlug: 'routers', categoryName: '路由器', categoryId: 9 },
];

// SKU 转换为 URL 格式
function skuToUrlPath(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-').replace(/%/g, '%25');
}

// 加载数据库
function loadDB() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

// 保存数据库
function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// 获取产品的正面照 URL
async function getFrontImageUrl(sku) {
  const urlPath = skuToUrlPath(sku);
  const specsUrl = `https://www.qnap.com.cn/zh-cn/product/${urlPath}/specs/hardware`;

  try {
    const response = await fetch(specsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // 方法1: 查找 og:image
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogMatch) {
      return ogMatch[1];
    }

    // 方法2: 查找 product/photo 中包含 Front 的图片
    const frontMatch = html.match(/product\/photo\/[^\"'<>]*Front[^\"'<>]*/gi);
    if (frontMatch && frontMatch.length > 0) {
      const frontUrl = frontMatch[0].replace('&amp;', '&');
      return 'https://www.qnap.com.cn/i/_attach_file/' + frontUrl;
    }

    // 方法3: 查找第一个 product/photo 图片 (通常为正面照)
    const firstMatch = html.match(/product\/photo\/[^\"'<>]+/gi);
    if (firstMatch && firstMatch.length > 0) {
      const firstUrl = firstMatch[0].replace('&amp;', '&');
      return 'https://www.qnap.com.cn/i/_attach_file/' + firstUrl;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// 下载图片
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
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
async function processProduct(product, index) {
  const { sku, name, categorySlug, categoryName, categoryId } = product;

  process.stdout.write(`[${index + 1}/${PRODUCTS.length}] ${sku}... `);

  // 1. 获取正面照 URL
  const imageUrl = await getFrontImageUrl(sku);

  if (imageUrl) {
    // 2. 创建产品图片目录
    const skuDir = path.join(imagesDir, sku);
    if (!fs.existsSync(skuDir)) {
      fs.mkdirSync(skuDir, { recursive: true });
    }

    // 3. 下载正面照
    let ext = path.extname(new URL(imageUrl).pathname) || '.png';
    if (!ext.match(/\.(png|jpg|jpeg|webp)$/i)) {
      ext = '.png';
    }
    const imagePath = path.join(skuDir, `Front${ext}`);
    const success = await downloadImage(imageUrl, imagePath);

    if (success) {
      console.log('✓');

      // 4. 更新数据库
      const db = loadDB();
      const existingIndex = db.products.findIndex(p => p.sku === sku);

      const productData = {
        id: existingIndex >= 0 ? db.products[existingIndex].id : `prod_router_${Date.now()}_${index}`,
        sku,
        name,
        series: '',
        categoryId,
        categorySlug,
        categoryName,
        price: existingIndex >= 0 ? db.products[existingIndex].price : 0,
        originalPrice: null,
        description: existingIndex >= 0 ? db.products[existingIndex].description : '',
        specs: existingIndex >= 0 ? db.products[existingIndex].specs : '{}',
        badge: null,
        color: '#006ebd',
        rating: existingIndex >= 0 ? db.products[existingIndex].rating : 0,
        reviews: existingIndex >= 0 ? db.products[existingIndex].reviews : 0,
        stock: existingIndex >= 0 ? db.products[existingIndex].stock : 100,
      };

      if (existingIndex >= 0) {
        db.products[existingIndex] = { ...db.products[existingIndex], ...productData };
      } else {
        db.products.push(productData);
      }

      saveDB(db);
    } else {
      console.log('✗ 下载失败');
    }
  } else {
    console.log('✗ 未找到图片');
  }

  // 添加延迟避免请求过快
  await new Promise(resolve => setTimeout(resolve, 500));
}

// 主函数
async function main() {
  console.log(`\n开始同步 ${PRODUCTS.length} 款路由器产品...\n`);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const imageUrl = await getFrontImageUrl(product.sku);

    if (imageUrl) {
      successCount++;
    } else {
      failCount++;
    }

    await processProduct(product, i);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n同步完成! 耗时: ${elapsed}秒, 成功: ${successCount}, 失败: ${failCount}`);
}

main().catch(console.error);
