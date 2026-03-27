/**
 * QNAP 扩展产品同步脚本
 * 从 QNAP 官网抓取扩展设备、网络设备、监控设备、配件等产品图片
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

// QNAP 扩展产品列表 (从 compare-expansion 页面获取)
const PRODUCTS = [
  // ===== 存储扩展设备 (14款) =====
  { sku: 'TL-R6020Sep-RP', name: 'TL-R6020Sep-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1620Sdc', name: 'TL-R1620Sdc', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1620Sep-RP', name: 'TL-R1620Sep-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1220Sep-RP', name: 'TL-R1220Sep-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R2400PES-RP', name: 'TL-R2400PES-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1600PES-RP', name: 'TL-R1600PES-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1200PES-RP', name: 'TL-R1200PES-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-D1600S', name: 'TL-D1600S', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-D800S', name: 'TL-D800S', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-D400S', name: 'TL-D400S', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1200S-RP', name: 'TL-R1200S-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R400S', name: 'TL-R400S', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-R1200C-RP', name: 'TL-R1200C-RP', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },
  { sku: 'TL-D800C', name: 'TL-D800C', categorySlug: 'expansion', categoryName: '存储扩展设备', categoryId: 4 },

  // ===== 网络设备 (7款) =====
  { sku: 'QuCPE-3032', name: 'QuCPE-3032', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QuCPE-3034', name: 'QuCPE-3034', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QuCPE-7012', name: 'QuCPE-7012', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QGD-1602', name: 'QGD-1602', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QGD-1600', name: 'QGD-1600', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QGD-1602P', name: 'QGD-1602P', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },
  { sku: 'QGD-1600P', name: 'QGD-1600P', categorySlug: 'network', categoryName: '网络设备', categoryId: 5 },

  // ===== 监控设备 (9款) =====
  { sku: 'TVR-AI200', name: 'TVR-AI200', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-AI642', name: 'TS-AI642', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TVS-h674', name: 'TVS-h674', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TVS-675', name: 'TVS-675', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-h886', name: 'TS-h886', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-855eU', name: 'TS-855eU', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-h1277AXU-RP', name: 'TS-h1277AXU-RP', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-1655', name: 'TS-1655', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },
  { sku: 'TS-h1886XU-RP-R2', name: 'TS-h1886XU-RP R2', categorySlug: 'surveillance', categoryName: '监控设备', categoryId: 6 },

  // ===== 扩展配件 (16款) =====
  { sku: 'QXP-1630S-3816', name: 'QXP-1630S-3816', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXP-830S-3808', name: 'QXP-830S-3808', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXP-3X4PES', name: 'QXP-3X4PES', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QDA-UMP4A', name: 'QDA-UMP4A', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QDA-UMP4', name: 'QDA-UMP4', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QDA-SA3', name: 'QDA-SA3', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QM2-2P-384A', name: 'QM2-2P-384A', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QM2-2P-344A', name: 'QM2-2P-344A', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QM2-2P10G1TB', name: 'QM2-2P10G1TB', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXG-100G2SF-BCM', name: 'QXG-100G2SF-BCM', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QNA-UC10G2T', name: 'QNA-UC10G2T', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QNA-UC10G2SF', name: 'QNA-UC10G2SF', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXP-T52P', name: 'QXP-T52P', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXP-T32P', name: 'QXP-T32P', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QXP-16G2FC', name: 'QXP-16G2FC', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
  { sku: 'QWU-100', name: 'QWU-100', categorySlug: 'accessories', categoryName: '扩展配件', categoryId: 7 },
];

// SKU 转换为 URL 格式
function skuToUrlPath(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-').replace(/%/g, '%25').replace(/  /g, '-');
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
    // 确保扩展名正确
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
        id: existingIndex >= 0 ? db.products[existingIndex].id : `prod_exp_${Date.now()}_${index}`,
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
  console.log(`\n开始同步 ${PRODUCTS.length} 款扩展产品...\n`);

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
