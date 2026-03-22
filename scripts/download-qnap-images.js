/**
 * QNAP 官网图片下载工具
 * 由于 QNAP 官网有反爬虫机制，需要手动下载图片
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 尝试的 URL 格式
const urlFormats = [
  'https://www.qnap.com/uploads/images/Product/{SKU}/500x500.jpg',
  'https://www.qnap.com/uploads/images/Product/{SKU}/hero.jpg',
  'https://cdn.qnap.com/images/Product/{SKU}/500x500.jpg',
  'https://img.qnap.com/images/Product/{SKU}/500x500.jpg',
  'https://www.qnap.com/i/images/Product/{SKU}/500x500.jpg',
];

const products = [
  'TS-264', 'TS-464', 'TS-233', 'TS-364',
  'TS-873A', 'TS-673A', 'TVS-h874',
  'TS-1683XU-RP', 'TS-832PX',
  'QSW-1105-5T', 'QSW-M408S', 'QSW-M2116P',
  'UX-1200U-RP',
  'QXG-10G1T', 'QXG-25G2SF',
  'LIC-NVR-4CH', 'LIC-VJBOD-1Y',
  'QEWS-2Y',
  'RAM-8GDDR4', 'RAM-16GDDR5',
];

const outputDir = path.join(__dirname, '../public/images/products');

// 创建目录
products.forEach(sku => {
  const skuDir = path.join(outputDir, sku);
  if (!fs.existsSync(skuDir)) {
    fs.mkdirSync(skuDir, { recursive: true });
  }
});

console.log('=======================================');
console.log('QNAP 官网图片手动下载说明');
console.log('=======================================\n');

console.log('由于 QNAP 官网有反爬虫保护机制，图片需要手动下载。\n');

console.log('手动下载步骤：');
console.log('1. 访问 QNAP 台湾官网：https://www.qnap.com/zh-tw/product/');
console.log('2. 找到对应产品页面');
console.log('3. 右键保存页面中的产品图片');
console.log('4. 将图片保存到以下目录：\n');

products.forEach(sku => {
  console.log(`   public/images/products/${sku}/`);
});

console.log('\n=======================================');
console.log('已生成的产品图片目录结构：');
console.log('=======================================\n');

products.forEach(sku => {
  console.log(`${sku}/`);
  for (let i = 1; i <= 6; i++) {
    console.log(`  ├── ${i}.jpg  (或 .png)`);
  }
});

console.log('\n=======================================');
console.log('快速下载链接（部分产品可用）：');
console.log('=======================================\n');

// 显示可能的下载链接
products.forEach(sku => {
  console.log(`${sku}:`);
  console.log(`  https://www.qnap.com/zh-tw/product/${sku.toLowerCase()}`);
});
