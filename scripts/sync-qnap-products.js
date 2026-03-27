/**
 * QNAP 产品同步脚本 v2
 * 从 QNAP 官网抓取产品正面照并更新数据库
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

// QNAP 产品列表
const PRODUCTS = [
  // 企业级存储 (24款)
  { sku: 'QSN-7530', name: '高性能横向扩展节点', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'QSN-3050', name: '高容量横向扩展节点', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'QSN-3000', name: '入门级横向扩展节点', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'ES2486dc', name: '24-bay SAS 全快闪数组', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'ES1686dc-R2', name: '16-bay NAS', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TDS-h2489FU-R2', name: '24-bay U.2 NVMe 全快闪数组', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h2490FU', name: '24-bay U.2 NVMe 全快闪数组', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1090FU', name: '10-bay U.2 NVMe 全快闪数组', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1290FX', name: '12-bay U.2 NVMe / SATA 全快闪存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h3087XU-RP', name: '24x HDD与6x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h2287XU-RP', name: '16x HDD与6x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1887XU-RP', name: '12x HDD与6x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h987XU-RP', name: '4x HDD与5x U.2 SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h3077AFU', name: 'AMD Ryzen 7000系列处理器', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h2477AXU-RP', name: 'AMD Ryzen 7 PRO 7000系列', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1677AXU-RP', name: 'AMD Ryzen 7000系列', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1277AXU-RP', name: 'AMD Ryzen 7000系列', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1886XU-RP-R2', name: '12x HDD与6x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TVS-h1688X', name: '12x HDD与4x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TVS-h1288X', name: '8x HDD与4x SSD混合式存储', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1277AFX', name: '12-bay SATA全快闪数组', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TVS-AIh1688ATX', name: 'Intel Core Ultra处理器AI NAS', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-h1077AFU', name: '10盘位SATA全快闪NAS', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },
  { sku: 'TS-1283XU-RP', name: 'Intel Xeon E处理器', categorySlug: 'enterprise', categoryName: '企业级存储', categoryId: 3 },

  // 商用存储 (48款)
  { sku: 'TBS-h574TX', name: 'Intel Core混合式架构处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TVS-h874', name: '第12代Intel Core处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TVS-h674', name: '第12代Intel Core处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TVS-h874T', name: '第12代Intel Core Thunderbolt 4', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TVS-h674T', name: '第12代Intel Core Thunderbolt 4', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1673AU-RP', name: 'AMD Ryzen V1000系列处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1273AU-RP', name: 'AMD Ryzen V1000系列处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-h1655XeU-RP', name: '3U精巧短机身双备援电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1655', name: '12x HDD与4x SSD混合式存储', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-855X', name: '6x HDD与2x SSD混合式存储', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-855eU-RP', name: '2U精巧短机身双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-855eU', name: '2U精巧短机身', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1264U-RP', name: 'Intel Celeron四核心双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-464U-RP', name: 'Intel Celeron四核心双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-464U', name: 'Intel Celeron四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-873AeU-RP', name: '2U精巧短机身双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-873AeU', name: '2U精巧短机身', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-864eU-RP', name: '短机箱Intel四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-864eU', name: '短机箱Intel四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-464eU', name: '短机箱2x 2.5GbE', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1232PXU-RP', name: 'ARM Cortex-A57四核心双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-832PXU-RP', name: 'ARM Cortex-A57四核心双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-1232PXU', name: 'ARM Cortex-A57四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-832PXU', name: 'ARM Cortex-A57四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-432PXU-RP', name: 'ARM Cortex-A57四核心双电源', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-432PXU', name: 'ARM Cortex-A57四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-i410X', name: '工业级NAS 4x SATA SSD', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TVS-675', name: '八核心2.5 GHz处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-873A', name: 'AMD Ryzen四核心2.2 GHz', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-673A', name: 'AMD Ryzen四核心2.2 GHz', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-832PX', name: '四核心1.7 GHz处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-932PX', name: '5x HDD与4x SSD混合式存储', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-h765eU', name: '1U短机箱Intel Atom四核心', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-410E', name: '无声NAS 4x SATA SSD', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-664', name: 'Intel四核心处理器内置GPU', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-464', name: 'Intel四核心处理器内置GPU', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-AI642', name: 'ARM八核心内置6 TOPS NPU', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-632X', name: '四核心2.0 GHz处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-432X', name: '四核心2.0 GHz处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-435XeU', name: '1U短机箱主机深度292mm', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TBS-464', name: '全快闪NASbook轻薄可携', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-433eU', name: '1U短机箱ARM Cortex-A55', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-466C', name: 'Intel Pentium Silver N6005', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'TS-h973AX', name: '5x HDD与4x SSD混合式存储', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'Qu805', name: 'Intel酷睿3八核心处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'Qu605', name: 'Intel酷睿3八核心处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },
  { sku: 'Qu405', name: 'Intel酷睿3八核心处理器', categorySlug: 'business', categoryName: '商用存储', categoryId: 2 },

  // 创作者与家庭用户 (9款)
  { sku: 'HS-264', name: '无风扇轻量美型Silent NAS', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-464C', name: 'Intel Celeron N5095四核心', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-464C2', name: 'Intel Celeron N5095四核心', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-264C', name: 'Intel Celeron N5095四核心', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-462C', name: 'Intel Celeron双核心处理器', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-262C', name: 'Intel Celeron双核心处理器', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-564', name: 'Intel四核心2.5GbE多媒体NAS', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-416', name: 'ARM四核心Cortex-A55 2.0 GHz', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
  { sku: 'TS-216', name: 'ARM四核心Cortex-A55 2.0 GHz', categorySlug: 'home-nas', categoryName: '创作者与家庭用户', categoryId: 1 },
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
      console.log(`    HTTP ${response.status}`);
      return null;
    }

    const html = await response.text();
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (match) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.log(`    错误: ${error.message}`);
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
    console.log(`    下载错误: ${error.message}`);
    return false;
  }
}

// 处理单个产品
async function processProduct(product, index) {
  const { sku, name, categorySlug, categoryName, categoryId } = product;

  process.stdout.write(`[${index + 1}/${PRODUCTS.length}] ${sku} - ${name.substring(0, 20)}... `);

  // 1. 获取正面照 URL
  const imageUrl = await getFrontImageUrl(sku);

  if (imageUrl) {
    // 2. 创建产品图片目录
    const skuDir = path.join(imagesDir, sku);
    if (!fs.existsSync(skuDir)) {
      fs.mkdirSync(skuDir, { recursive: true });
    }

    // 3. 下载正面照
    const ext = path.extname(new URL(imageUrl).pathname) || '.png';
    const imagePath = path.join(skuDir, `Front${ext}`);
    const success = await downloadImage(imageUrl, imagePath);

    if (success) {
      console.log('✓');

      // 4. 更新数据库
      const db = loadDB();
      const existingIndex = db.products.findIndex(p => p.sku === sku);

      const productData = {
        id: existingIndex >= 0 ? db.products[existingIndex].id : `prod_${Date.now()}_${index}`,
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
  console.log(`\n开始同步 ${PRODUCTS.length} 款产品的正面照...\n`);

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
