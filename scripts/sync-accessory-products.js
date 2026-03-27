/**
 * QNAP 配件产品同步脚本
 * 从 QNAP 官网抓取配件产品图片
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

// QNAP 配件产品列表 (从 compare-accessory 页面获取)
const PRODUCTS = [
  // 连接存储扩展设备 (9款)
  { sku: 'QXP-400eS-A1164', name: 'QXP-400eS-A1164 Quad-port SATA expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-800eS-A1164', name: 'QXP-800eS-A1164 8-port SATA expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-10G2U3A', name: 'QXP-10G2U3A USB 3.2 Gen 2 dual-port PCIe expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-1630S-3816', name: 'QXP-1630S-3816 Quad-port External SAS 12Gb/s storage expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-830S-3808', name: 'QXP-830S-3808 Dual-port External SAS 12Gb/s storage expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-1600eS-A1164', name: 'QXP-1600eS-A1164 16-port SATA expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-3X4PES', name: 'QXP-3X4PES 2-port PCIe Gen3 x4 expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-3X8PES', name: 'QXP-3X8PES 2-port PCIe Gen3 x8 expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-820S-B3408', name: 'QXP-820S-B3408 Dual-port External SAS 12Gb/s storage expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },

  // 扩充存储空间 (7款)
  { sku: 'QM2-2P-344A', name: 'QM2-2P-344A Dual M.2 22110/2280 PCIe NVMe SSD expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-2P-384A', name: 'QM2-2P-384A Dual M.2 22110/2280 PCIe NVMe SSD expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-2S-220A', name: 'QM2-2S-220A Dual M.2 22110/2280 SATA SSD expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-2P-244A', name: 'QM2-2P-244A Dual M.2 22110/2280 PCIe NVMe SSD expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-4P-384', name: 'QM2-4P-384 Quad M.2 2280 PCIe NVMe SSD expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-2P10G1TB', name: 'QM2-2P10G1TB Dual M.2 2280 PCIe NVMe SSD & single-port 10GbE expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QM2-2P2G2T', name: 'QM2-2P2G2T Dual M.2 2280 PCIe SSD & dual-port 2.5GbE expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },

  // 增加网络端口 (19款)
  { sku: 'QXG-100G2SF-BCM', name: 'QXG-100G2SF-BCM Dual-port 100 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-100G2SF-E810', name: 'QXG-100G2SF-E810 Dual-port 100 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-25G2SF-E810', name: 'QXG-25G2SF-E810 Dual-port 25 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-25G2SF-CX6', name: 'QXG-25G2SF-CX6 Dual-port 25 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-10G2SF-NXE', name: 'QXG-10G2SF-NXE Dual-port 10 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-ES10G1T', name: 'QXG-ES10G1T Single-port, 5-speed 10 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-10G2SF-X710', name: 'QXG-10G2SF-X710 Dual-port 10 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-10G2T', name: 'QXG-10G2T Dual-port, 5-speed 10 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-10G2T-X710', name: 'QXG-10G2T-X710 Dual-port, 5-speed 10 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-5G4T-111C', name: 'QXG-5G4T-111C Quad-port, 4-speed 5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-5G1T-111C', name: 'QXG-5G1T-111C Single-port, 4-speed 5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-5G2T-111C', name: 'QXG-5G2T-111C Dual-port, 4-speed 5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-2G4T-I225', name: 'QXG-2G4T-I225 Quad-port 2.5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-2G2T-I225', name: 'QXG-2G2T-I225 Dual-port 2.5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXG-2G1T-I225', name: 'QXG-2G1T-I225 Single-port 2.5 GbE network expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QNA-UC10G2T', name: 'QNA-UC10G2T USB 4 Type C to dual-port 10GBASE-T adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QNA-UC10G2SF', name: 'QNA-UC10G2SF USB 4 Type C to dual-port 10GbE SFP+ adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QNA-UC10G1T', name: 'QNA-UC10G1T USB 4 Type C to single-port 10GBASE-T adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QNA-UC10G1SF', name: 'QNA-UC10G1SF USB 4 Type C to single-port 10GbE SFP+ adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },

  // 更方便地传输资料 (5款)
  { sku: 'QXP-T52P', name: 'QXP-T52P Thunderbolt 5 Expansion Card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-16G2FC', name: 'QXP-16G2FC Dual-port 16Gb Enhanced Gen 5 Fibre Channel expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-32G2FC', name: 'QXP-32G2FC Dual-port 32Gb Gen 6 Fibre Channel expansion card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QXP-T32P', name: 'QXP-T32P Thunderbolt 3 Expansion Card', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QWA-AC2600', name: 'QWA-AC2600 2.4/5 GHz Dual Band Dual Concurrent wireless adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },

  // 加速运算性能 (2款)
  { sku: 'QAI-U100', name: 'QAI-U100 USB AI Accelerator', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QAI-M100', name: 'QAI-M100 M.2 2280 PCIe AI Accelerator', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },

  // 灵活搭配多款硬盘 (5款)
  { sku: 'QDA-UMP4A', name: 'QDA-UMP4A M.2 PCIe NVMe SSD to U.2 adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QDA-UMP4', name: 'QDA-UMP4 M.2 PCIe NVMe SSD to U.2 adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QDA-SA3', name: 'QDA-SA3 2.5-inch 6Gbps SAS to SATA drive adapter', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QDA-A2AR', name: 'QDA-A2AR 2x 2.5-inch SATA drives in 3.5-inch bay with RAID', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
  { sku: 'QDA-A2MAR', name: 'QDA-A2MAR 2x M.2 SATA SSDs in 2.5-inch SATA bay with RAID', categorySlug: 'accessories', categoryName: '配件', categoryId: 10 },
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
        id: existingIndex >= 0 ? db.products[existingIndex].id : `prod_acc_${Date.now()}_${index}`,
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
  console.log(`\n开始同步 ${PRODUCTS.length} 款配件产品...\n`);

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
