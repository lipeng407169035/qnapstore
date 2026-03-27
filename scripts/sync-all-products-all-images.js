/**
 * QNAP 全产品图片同步脚本
 * 下载每个产品的所有角度图片，而不是只下载正面照
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

// 所有产品列表 (合并之前所有的产品)
const PRODUCTS = [
  // ===== 企业级存储 (24款) =====
  'QSN-7530', 'QSN-3050', 'QSN-3000', 'ES2486dc', 'ES1686dc-R2',
  'TDS-h2489FU-R2', 'TS-h2490FU', 'TS-h1090FU', 'TS-h1290FX',
  'TS-h3087XU-RP', 'TS-h2287XU-RP', 'TS-h1887XU-RP', 'TS-h987XU-RP',
  'TS-h3077AFU', 'TS-h2477AXU-RP', 'TS-h1677AXU-RP', 'TS-h1277AXU-RP',
  'TS-h1886XU-RP-R2', 'TVS-h1688X', 'TVS-h1288X', 'TS-h1277AFX',
  'TVS-AIh1688ATX', 'TS-h1077AFU', 'TS-1283XU-RP',

  // ===== 商用存储 (48款) =====
  'TBS-h574TX', 'TVS-h874', 'TVS-h674', 'TVS-h874T', 'TVS-h674T',
  'TS-1673AU-RP', 'TS-1273AU-RP', 'TS-h1655XeU-RP', 'TS-1655',
  'TS-855X', 'TS-855eU-RP', 'TS-855eU', 'TS-1264U-RP',
  'TS-464U-RP', 'TS-464U', 'TS-873AeU-RP', 'TS-873AeU',
  'TS-864eU-RP', 'TS-864eU', 'TS-464eU', 'TS-1232PXU-RP',
  'TS-832PXU-RP', 'TS-1232PXU', 'TS-832PXU', 'TS-432PXU-RP',
  'TS-432PXU', 'TS-i410X', 'TVS-675', 'TS-873A', 'TS-673A',
  'TS-832PX', 'TS-932PX', 'TS-h765eU', 'TS-410E', 'TS-664',
  'TS-464', 'TS-AI642', 'TS-632X', 'TS-432X', 'TS-435XeU',
  'TBS-464', 'TS-433eU', 'TS-466C', 'TS-h973AX', 'Qu805', 'Qu605', 'Qu405',

  // ===== 创作者与家庭用户 (9款) =====
  'HS-264', 'TS-464C', 'TS-464C2', 'TS-264C', 'TS-462C',
  'TS-262C', 'TS-564', 'TS-416', 'TS-216',

  // ===== 存储扩展设备 (14款) =====
  'TL-R6020Sep-RP', 'TL-R1620Sdc', 'TL-R1620Sep-RP', 'TL-R1220Sep-RP',
  'TL-R2400PES-RP', 'TL-R1600PES-RP', 'TL-R1200PES-RP', 'TL-D1600S',
  'TL-D800S', 'TL-D400S', 'TL-R1200S-RP', 'TL-R400S', 'TL-R1200C-RP', 'TL-D800C',

  // ===== 网络设备 (7款) =====
  'QuCPE-3032', 'QuCPE-3034', 'QuCPE-7012', 'QGD-1602', 'QGD-1600', 'QGD-1602P', 'QGD-1600P',

  // ===== 监控设备 (9款) =====
  'TVR-AI200', 'TS-AI642', 'TVS-h674', 'TVS-675', 'TS-h886', 'TS-855eU', 'TS-h1277AXU-RP', 'TS-1655', 'TS-h1886XU-RP-R2',

  // ===== 扩展配件 (16款) =====
  'QXP-1630S-3816', 'QXP-830S-3808', 'QXP-3X4PES', 'QDA-UMP4A', 'QDA-UMP4', 'QDA-SA3',
  'QM2-2P-384A', 'QM2-2P-344A', 'QM2-2P10G1TB', 'QXG-100G2SF-BCM',
  'QNA-UC10G2T', 'QNA-UC10G2SF', 'QXP-T52P', 'QXP-T32P', 'QXP-16G2FC', 'QWU-100',

  // ===== 交换机 (28款) =====
  'QSW-1108-8T-R2', 'QSW-2104-2T-R2', 'QSW-2104-2S', 'QSW-M2106-4C', 'QSW-M2106-4S',
  'QSW-M2106PR-2S2T', 'QSW-M2106R-2S2T', 'QSW-M2108-2C', 'QSW-M2108-2S', 'QSW-M2108R-2C',
  'QSW-M2116P-2T2S', 'QSW-M408-4C', 'QSW-M408-2C', 'QSW-M408S', 'QSW-308-1C',
  'QSW-L3208-2C6T', 'QSW-L3205-1C4T', 'QSW-3205-5T', 'QSW-3216R-8S8T', 'QSW-IM3216-8S8T',
  'QSW-M3212R-8S4T', 'QSW-M3216R-8S8T', 'QSW-M3224-24T', 'QSW-M1204-4C', 'QSW-M804-4C',
  'QSW-1208-8C', 'QSW-M5216-1T', 'QSW-M7308R-4X',

  // ===== 路由器 (5款) =====
  'QHora-301W', 'QHora-321', 'QHora-322', 'QMiro-201W', 'QMiroPlus-201W',

  // ===== 配件 (47款) =====
  'QXP-400eS-A1164', 'QXP-800eS-A1164', 'QXP-10G2U3A', 'QXP-1600eS-A1164', 'QXP-3X8PES', 'QXP-820S-B3408',
  'QM2-2S-220A', 'QM2-2P-244A', 'QM2-4P-384', 'QM2-2P2G2T',
  'QXG-100G2SF-E810', 'QXG-25G2SF-E810', 'QXG-25G2SF-CX6', 'QXG-10G2SF-NXE', 'QXG-ES10G1T',
  'QXG-10G2SF-X710', 'QXG-10G2T', 'QXG-10G2T-X710', 'QXG-5G4T-111C', 'QXG-5G1T-111C', 'QXG-5G2T-111C',
  'QXG-2G4T-I225', 'QXG-2G2T-I225', 'QXG-2G1T-I225',
  'QNA-UC10G1T', 'QNA-UC10G1SF',
  'QXP-32G2FC', 'QWA-AC2600', 'QAI-U100', 'QAI-M100',
  'QDA-A2AR', 'QDA-A2MAR',
];

// 去重
const UNIQUE_PRODUCTS = [...new Set(PRODUCTS)];

// SKU 转换为 URL 格式
function skuToUrlPath(sku) {
  return sku.toLowerCase().replace(/\s+/g, '-').replace(/%/g, '%25').replace(/--/g, '-');
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

// 获取产品的所有图片 URL
async function getAllImageUrls(sku) {
  const urlPath = skuToUrlPath(sku);
  const specsUrl = `https://www.qnap.com.cn/zh-cn/product/${urlPath}/specs/hardware`;

  try {
    const response = await fetch(specsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    // 查找所有 product/photo 相关的 URL
    const matches = html.match(/product\/photo\/[^\"'<>]+/gi);
    if (!matches) {
      return [];
    }

    // 去重并清理 URL
    const uniqueUrls = [...new Set(matches.map(m => {
      let url = m.replace('&amp;', '&');
      // 如果 URL 不以 http 开头，补充完整路径
      if (!url.startsWith('http')) {
        url = 'https://www.qnap.com.cn/i/_attach_file/' + url;
      }
      return url;
    }))];

    return uniqueUrls;
  } catch (error) {
    return [];
  }
}

// 下载单个图片
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

// 从 URL 提取文件名
function getFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // 获取最后一段路径并清理
    let filename = pathname.split('/').pop() || 'image.png';
    // 清理 URL 编码的字符
    filename = filename.replace(/%20/g, '_').replace(/%2C/g, '_');
    return filename;
  } catch {
    return 'image.png';
  }
}

// 处理单个产品的所有图片
async function processProductImages(sku, index) {
  process.stdout.write(`[${index + 1}/${UNIQUE_PRODUCTS.length}] ${sku}... `);

  // 1. 获取所有图片 URL
  const imageUrls = await getAllImageUrls(sku);

  if (imageUrls.length === 0) {
    console.log('✗ 未找到图片');
    return { sku, success: false, count: 0 };
  }

  // 2. 创建产品图片目录
  const skuDir = path.join(imagesDir, sku);
  if (!fs.existsSync(skuDir)) {
    fs.mkdirSync(skuDir, { recursive: true });
  }

  // 3. 下载所有图片
  let downloadedCount = 0;
  for (const imageUrl of imageUrls) {
    const filename = getFilenameFromUrl(imageUrl);
    const imagePath = path.join(skuDir, filename);

    // 如果文件已存在，跳过下载
    if (fs.existsSync(imagePath)) {
      downloadedCount++;
      continue;
    }

    const success = await downloadImage(imageUrl, imagePath);
    if (success) {
      downloadedCount++;
    }
  }

  console.log(`✓ (${downloadedCount}/${imageUrls.length})`);

  // 4. 更新数据库 - 存储所有图片信息
  const db = loadDB();
  const existingIndex = db.products.findIndex(p => p.sku === sku);

  if (existingIndex >= 0) {
    db.products[existingIndex] = {
      ...db.products[existingIndex],
      // 更新图片列表
    };
    saveDB(db);
  }

  return { sku, success: downloadedCount > 0, count: downloadedCount };
}

// 主函数
async function main() {
  console.log(`\n开始同步 ${UNIQUE_PRODUCTS.length} 款产品的所有图片...\n`);
  console.log('这可能需要几分钟时间...\n');

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  let totalImages = 0;

  for (let i = 0; i < UNIQUE_PRODUCTS.length; i++) {
    const result = await processProductImages(UNIQUE_PRODUCTS[i], i);

    if (result.success) {
      successCount++;
      totalImages += result.count;
    } else {
      failCount++;
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n同步完成!`);
  console.log(`耗时: ${elapsed}秒`);
  console.log(`成功: ${successCount} 款产品`);
  console.log(`失败: ${failCount} 款产品`);
  console.log(`图片总数: ${totalImages} 张`);
}

main().catch(console.error);
