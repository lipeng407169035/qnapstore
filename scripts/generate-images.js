/**
 * 增强版产品图片生成器
 * 生成更逼真的 NAS、网络设备产品图片
 */

const fs = require('fs');
const path = require('path');

// 产品详细配置 - 基于真实产品设计
const productConfigs = {
  'TS-264': {
    name: 'TS-264',
    type: 'nas',
    bays: 2,
    color: '#1a2744',
    accentColor: '#006ebd',
    width: 220,
    height: 160,
    description: '2-bay NAS',
  },
  'TS-464': {
    name: 'TS-464',
    type: 'nas',
    bays: 4,
    color: '#0d1a3d',
    accentColor: '#f7941d',
    width: 220,
    height: 180,
    description: '4-bay NAS',
  },
  'TS-233': {
    name: 'TS-233',
    type: 'nas',
    bays: 2,
    color: '#2a1a0d',
    accentColor: '#006ebd',
    width: 180,
    height: 140,
    description: '2-bay NAS',
  },
  'TS-364': {
    name: 'TS-364',
    type: 'nas',
    bays: 3,
    color: '#1a2a3a',
    accentColor: '#006ebd',
    width: 200,
    height: 160,
    description: '3-bay NAS',
  },
  'TS-873A': {
    name: 'TS-873A',
    type: 'nas',
    bays: 8,
    color: '#0d1a2a',
    accentColor: '#10b981',
    width: 280,
    height: 200,
    description: '8-bay NAS',
  },
  'TS-673A': {
    name: 'TS-673A',
    type: 'nas',
    bays: 6,
    color: '#1a0d2a',
    accentColor: '#f7941d',
    width: 260,
    height: 190,
    description: '6-bay NAS',
  },
  'TVS-h874': {
    name: 'TVS-h874',
    type: 'nas',
    bays: 8,
    color: '#0d2a1a',
    accentColor: '#7c3aed',
    width: 280,
    height: 200,
    description: '8-bay NAS',
  },
  'TS-1683XU-RP': {
    name: 'TS-1683XU-RP',
    type: 'rackmount',
    bays: 16,
    color: '#0d0d1a',
    accentColor: '#006ebd',
    width: 400,
    height: 88,
    description: '16-bay Rackmount',
  },
  'TS-832PX': {
    name: 'TS-832PX',
    type: 'rackmount',
    bays: 8,
    color: '#1a1a0d',
    accentColor: '#006ebd',
    width: 320,
    height: 66,
    description: '8-bay Rackmount',
  },
  'QSW-1105-5T': {
    name: 'QSW-1105-5T',
    type: 'switch',
    ports: 5,
    color: '#0d1a0d',
    accentColor: '#10b981',
    width: 200,
    height: 40,
    description: '5-port 2.5GbE Switch',
  },
  'QSW-M408S': {
    name: 'QSW-M408S',
    type: 'switch',
    ports: 12,
    color: '#1a0d0d',
    accentColor: '#006ebd',
    width: 320,
    height: 44,
    description: '12-port Managed Switch',
  },
  'QSW-M2116P': {
    name: 'QSW-M2116P',
    type: 'switch',
    ports: 18,
    color: '#0d1a1a',
    accentColor: '#f7941d',
    width: 400,
    height: 44,
    description: '18-port PoE Switch',
  },
  'UX-1200U-RP': {
    name: 'UX-1200U-RP',
    type: 'expansion',
    bays: 12,
    color: '#1a1a2a',
    accentColor: '#006ebd',
    width: 400,
    height: 88,
    description: '12-bay Expansion',
  },
  'QXG-10G1T': {
    name: 'QXG-10G1T',
    type: 'nic',
    color: '#2a1a1a',
    accentColor: '#006ebd',
    width: 160,
    height: 120,
    description: '10GbE Network Card',
  },
  'QXG-25G2SF': {
    name: 'QXG-25G2SF',
    type: 'nic',
    color: '#1a2a1a',
    accentColor: '#10b981',
    width: 160,
    height: 120,
    description: '25GbE Network Card',
  },
  'LIC-NVR-4CH': {
    name: 'QVR Pro',
    type: 'software',
    color: '#2a2a0d',
    accentColor: '#006ebd',
    width: 200,
    height: 140,
    description: 'NVR Software',
  },
  'LIC-VJBOD-1Y': {
    name: 'VJBOD Cloud',
    type: 'software',
    color: '#2a0d2a',
    accentColor: '#7c3aed',
    width: 200,
    height: 140,
    description: 'Cloud Storage',
  },
  'QEWS-2Y': {
    name: '延長保固',
    type: 'warranty',
    color: '#0d2a2a',
    accentColor: '#10b981',
    width: 200,
    height: 140,
    description: 'Warranty Extension',
  },
  'RAM-8GDDR4': {
    name: '8GB DDR4',
    type: 'memory',
    color: '#1a1a3a',
    accentColor: '#006ebd',
    width: 140,
    height: 30,
    description: '8GB DDR4 RAM',
  },
  'RAM-16GDDR5': {
    name: '16GB DDR5',
    type: 'memory',
    color: '#1a2a3a',
    accentColor: '#f7941d',
    width: 140,
    height: 30,
    description: '16GB DDR5 RAM',
  },
};

// 生成 NAS 图片
function generateNASImage(config, imageNum) {
  const { name, bays, color, accentColor, description } = config;
  
  const bodyWidth = 180 + (bays > 4 ? (bays - 4) * 30 : 0);
  const bodyHeight = 100;
  const slotWidth = (bodyWidth - 40) / bays - 4;
  
  const ledColors = ['#00e676', '#40c4ff', '#ea80fc'];
  
  // 不同角度的图片
  let view = '';
  let slots = '';
  
  if (imageNum === 1) {
    // 正面
    view = 'FRONT VIEW';
    for (let i = 0; i < bays; i++) {
      const x = 30 + i * (slotWidth + 4);
      slots += `
  <rect x="${x}" y="35" width="${slotWidth}" height="${bodyHeight - 50}" rx="3" fill="#0a0a0a" opacity="0.9"/>
  <rect x="${x + 2}" y="37" width="${slotWidth - 4}" height="${bodyHeight - 54}" rx="2" fill="black"/>
  <circle cx="${x + slotWidth/2}" cy="${bodyHeight - 22}" r="2" fill="${ledColors[i % 3]}">
    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>`;
    }
  } else if (imageNum === 2) {
    // 背面 - 显示接口
    view = 'REAR VIEW';
    slots = `
  <rect x="30" y="40" width="30" height="15" rx="2" fill="#1a1a1a"/>
  <rect x="35" y="43" width="20" height="3" fill="#222"/>
  <rect x="35" y="48" width="20" height="3" fill="#222"/>
  <rect x="70" y="40" width="30" height="15" rx="2" fill="#1a1a1a"/>
  <rect x="110" y="35" width="40" height="25" rx="2" fill="#0a0a0a"/>
  <circle cx="145" cy="47" r="3" fill="#00e676">
    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </circle>`;
  } else if (imageNum === 3) {
    // 侧面
    view = 'SIDE VIEW';
    slots = `
  <rect x="40" y="30" width="15" height="80" rx="2" fill="#0d0d1a"/>
  <circle cx="47" cy="40" r="2" fill="#00e676">
    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="47" cy="50" r="2" fill="#40c4ff"/>
  <circle cx="47" cy="60" r="2" fill="#ea80fc"/>`;
  } else if (imageNum === 4) {
    // 内部/打开
    view = 'INTERNAL VIEW';
    for (let i = 0; i < bays; i++) {
      const x = 30 + i * (slotWidth + 4);
      slots += `
  <rect x="${x}" y="35" width="${slotWidth}" height="${bodyHeight - 50}" rx="3" fill="#1a1a2a" stroke="#333" stroke-width="1"/>
  <rect x="${x + 3}" y="38" width="${slotWidth - 6}" height="${bodyHeight - 56}" rx="2" fill="#0a0a15"/>`;
    }
    // 显示内部主板
    slots += `
  <rect x="30" y="${bodyHeight - 15}" width="${bodyWidth - 60}" height="8" fill="#1a2744"/>
  <circle cx="50" cy="${bodyHeight - 11}" r="2" fill="#00e676"/>`;
  } else if (imageNum === 5) {
    // 包装
    view = 'PACKAGE';
    slots = `
  <rect x="20" y="30" width="${bodyWidth}" height="80" rx="4" fill="#2a2a2a" stroke="#444" stroke-width="2"/>
  <rect x="25" y="35" width="${bodyWidth - 10}" height="70" rx="2" fill="#1a1a1a"/>
  <text x="${bodyWidth/2 + 20}" y="75" fill="white" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">QNAP</text>
  <text x="${bodyWidth/2 + 20}" y="90" fill="#888" font-family="Arial" font-size="10" text-anchor="middle">${name}</text>`;
  } else {
    // 配件
    view = 'ACCESSORIES';
    slots = `
  <rect x="30" y="50" width="60" height="8" rx="2" fill="#333"/>
  <rect x="100" y="50" width="60" height="8" rx="2" fill="#333"/>
  <rect x="35" y="52" width="15" height="4" fill="#c9a227"/>
  <rect x="105" y="52" width="15" height="4" fill="#c9a227"/>
  <circle cx="70" cy="35" r="15" fill="#222" stroke="#444" stroke-width="2"/>
  <circle cx="70" cy="35" r="10" fill="#1a1a1a"/>
  <text x="70" y="40" fill="${accentColor}" font-family="Arial" font-size="8" text-anchor="middle">Q</text>`;
  }
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bodyWidth + 40} ${bodyHeight + 80}" width="${bodyWidth + 40}" height="${bodyHeight + 80}">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}cc;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <!-- 白色背景 -->
  <rect width="100%" height="100%" fill="white"/>
  
  <!-- 主体 -->
  <rect x="20" y="20" width="${bodyWidth}" height="${bodyHeight}" rx="8" fill="url(#bodyGrad)" filter="url(#shadow)"/>
  
  <!-- 顶部高光 -->
  <rect x="20" y="20" width="${bodyWidth}" height="3" rx="1" fill="white" opacity="0.2"/>
  
  <!-- 硬盘槽/接口 -->
${slots}
  
  <!-- Logo -->
  <text x="30" y="${bodyHeight + 15}" fill="${accentColor}" font-family="Arial Black" font-size="10" font-weight="bold">QNAP</text>
  <text x="55" y="${bodyHeight + 15}" fill="white" font-family="Arial" font-size="8" opacity="0.6">${name}</text>
  
  <!-- 状态灯 -->
  <circle cx="${bodyWidth - 15}" cy="30" r="3" fill="#00e676">
    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${bodyWidth - 25}" cy="30" r="3" fill="#40c4ff" opacity="0.8"/>
  
  <!-- View label -->
  <text x="${bodyWidth/2 + 20}" y="${bodyHeight + 55}" fill="#666" font-family="Arial" font-size="10" text-anchor="middle">${view}</text>
</svg>`;
}

// 生成交换机图片
function generateSwitchImage(config, imageNum) {
  const { name, ports, color, accentColor } = config;
  
  const bodyWidth = 180 + ports * 15;
  const bodyHeight = 36;
  const portWidth = 12;
  
  let portsHtml = '';
  for (let i = 0; i < ports; i++) {
    const x = 30 + i * (portWidth + 3);
    const isLink = i % 2 === 0;
    portsHtml += `
  <rect x="${x}" y="26" width="${portWidth}" height="8" rx="1" fill="#1a1a1a"/>
  <rect x="${x + 2}" y="27" width="${portWidth - 4}" height="2" fill="#0a0a0a"/>
  ${isLink ? `<rect x="${x + 4}" y="28" width="4" height="4" fill="#00e676"><animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite"/></rect>` : ''}`;
  }
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bodyWidth + 40} 80" width="${bodyWidth + 40}" height="80">
  <rect width="100%" height="100%" fill="white"/>
  <rect x="20" y="20" width="${bodyWidth}" height="${bodyHeight}" rx="4" fill="${color}"/>
  <rect x="20" y="20" width="${bodyWidth}" height="3" rx="1" fill="white" opacity="0.15"/>
  ${portsHtml}
  <text x="25" y="70" fill="${accentColor}" font-family="Arial Black" font-size="8" font-weight="bold">QNAP</text>
  <text x="45" y="70" fill="white" font-family="Arial" font-size="6" opacity="0.5">${name}</text>
</svg>`;
}

// 生成内存图片
function generateMemoryImage(config, imageNum) {
  const { name, color, accentColor } = config;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="160" height="40">
  <rect width="100%" height="100%" fill="white"/>
  <rect x="10" y="8" width="140" height="24" rx="2" fill="${color}"/>
  <rect x="10" y="8" width="140" height="2" rx="1" fill="white" opacity="0.1"/>
  <rect x="20" y="12" width="20" height="16" rx="1" fill="#0a0a0a" opacity="0.8"/>
  <rect x="45" y="12" width="20" height="16" rx="1" fill="#0a0a0a" opacity="0.8"/>
  <rect x="70" y="12" width="20" height="16" rx="1" fill="#0a0a0a" opacity="0.8"/>
  <rect x="95" y="12" width="20" height="16" rx="1" fill="#0a0a0a" opacity="0.8"/>
  <rect x="120" y="28" width="25" height="4" fill="#c9a227"/>
  <rect x="12" y="28" width="8" height="4" fill="#c9a227"/>
  <text x="15" y="16" fill="white" font-family="Arial" font-size="5" opacity="0.7">${name}</text>
</svg>`;
}

// 生成软件图片
function generateSoftwareImage(config, imageNum) {
  const { name, color, accentColor } = config;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" width="200" height="140">
  <rect width="100%" height="100%" fill="white"/>
  <rect x="20" y="20" width="160" height="100" rx="8" fill="${color}"/>
  <circle cx="100" cy="70" r="30" fill="${accentColor}" opacity="0.3"/>
  <circle cx="100" cy="70" r="22" fill="${accentColor}" opacity="0.5"/>
  <text x="100" y="75" fill="white" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">Q</text>
  <text x="100" y="115" fill="white" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle">${name}</text>
</svg>`;
}

function generateImage(config, imageNum) {
  const { type } = config;
  
  switch (type) {
    case 'nas':
    case 'rackmount':
    case 'expansion':
      return generateNASImage(config, imageNum);
    case 'switch':
      return generateSwitchImage(config, imageNum);
    case 'memory':
      return generateMemoryImage(config, imageNum);
    case 'software':
    case 'warranty':
      return generateSoftwareImage(config, imageNum);
    case 'nic':
      return generateNASImage({ ...config, bays: 1 }, imageNum);
    default:
      return generateNASImage(config, imageNum);
  }
}

// 生成所有图片
function generateAllImages() {
  const outputDir = path.join(__dirname, '../public/images/products');
  
  Object.entries(productConfigs).forEach(([sku, config]) => {
    const productDir = path.join(outputDir, sku);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    for (let i = 1; i <= 6; i++) {
      const svg = generateImage(config, i);
      const filename = path.join(productDir, `${i}.svg`);
      fs.writeFileSync(filename, svg);
    }
  });
  
  console.log('✅ 生成 120 张产品图片 (20产品 × 6角度)');
}

generateAllImages();
