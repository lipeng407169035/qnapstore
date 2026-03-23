const fs = require('fs');
const path = require('path');

const products = {
  'TS-873A': ['TVS-h675', 'QXG-10G2SF-NXE', 'TVS-AIh1688ATX'],
  'TVS-h874': ['TVS-h675', 'TBS-464'],
  'TS-264': ['TS-264C'],
  'TS-832PX': ['QXG-10G2SF-NXE'],
  'TS-1683XU-RP': ['TS-h2490FU'],
  'QSW-1105-5T': ['QSW-M2116P', 'TVS-AIh1688ATX'],
  'QSW-M2116P': ['QSW-M408-4C', 'QSW-M2108R-2C'],
  'QSW-M408S': ['QSW-M2108R-2C', 'QSW-M2116P-2T2S'],
  'QXG-10G1T': ['QXG-10G2T', 'QSW-IM3216', 'QSW-3205-5T', 'QSW-2104-2T-R2', 'QXG-10G2SF-NXE'],
};

const baseDir = path.join(__dirname, '../public/images/products');

let totalDeleted = 0;

Object.entries(products).forEach(([sku, removePatterns]) => {
  const skuDir = path.join(baseDir, sku);
  if (!fs.existsSync(skuDir)) {
    console.log(`[SKIP] ${sku}: directory not found`);
    return;
  }
  
  const files = fs.readdirSync(skuDir);
  let deleted = 0;
  
  files.forEach(file => {
    const shouldDelete = removePatterns.some(pattern => file.includes(pattern));
    if (shouldDelete) {
      fs.unlinkSync(path.join(skuDir, file));
      console.log(`[DELETE] ${sku}/${file}`);
      deleted++;
      totalDeleted++;
    }
  });
  
  const remaining = fs.readdirSync(skuDir);
  console.log(`[DONE] ${sku}: deleted ${deleted}, remaining ${remaining.length} files`);
  if (remaining.length > 0) {
    remaining.forEach(f => console.log(`   ${f}`));
  }
});

console.log(`\nTotal deleted: ${totalDeleted}`);
