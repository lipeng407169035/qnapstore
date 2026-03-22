import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'home-nas' },
      update: {},
      create: { slug: 'home-nas', name: '家用 NAS', icon: '🗄️', desc: '2-4槽家庭個人備份儲存' },
    }),
    prisma.category.upsert({
      where: { slug: 'business-nas' },
      update: {},
      create: { slug: 'business-nas', name: '企業 NAS', icon: '🏢', desc: '高效能企業級儲存方案' },
    }),
    prisma.category.upsert({
      where: { slug: 'rackmount-nas' },
      update: {},
      create: { slug: 'rackmount-nas', name: '機架式 NAS', icon: '🖥️', desc: '1U/2U/4U 機架安裝' },
    }),
    prisma.category.upsert({
      where: { slug: 'switch' },
      update: {},
      create: { slug: 'switch', name: '網路交換器', icon: '🌐', desc: '2.5G/10G 高速交換器' },
    }),
    prisma.category.upsert({
      where: { slug: 'expansion' },
      update: {},
      create: { slug: 'expansion', name: '擴充設備', icon: '💾', desc: 'JBOD 擴充儲存設備' },
    }),
    prisma.category.upsert({
      where: { slug: 'network-card' },
      update: {},
      create: { slug: 'network-card', name: '網路配件', icon: '📡', desc: '網卡、SFP模組' },
    }),
    prisma.category.upsert({
      where: { slug: 'software' },
      update: {},
      create: { slug: 'software', name: '軟體授權', icon: '🔑', desc: 'QTS授權、影像監控' },
    }),
    prisma.category.upsert({
      where: { slug: 'warranty' },
      update: {},
      create: { slug: 'warranty', name: '延長保固', icon: '🛡️', desc: '原廠延長保固服務' },
    }),
    prisma.category.upsert({
      where: { slug: 'memory' },
      update: {},
      create: { slug: 'memory', name: '記憶體', icon: '🧠', desc: 'QNAP原廠DDR4/DDR5' },
    }),
  ]);

  // Products
  const products = [
    { sku: 'TS-264', name: 'TS-264 雙槽 NAS', series: 'Turbo NAS', categoryId: categories[0].id, price: 9900, description: 'Intel Celeron N5105 四核心 2.0GHz，2.5GbE × 2，4K 硬體解碼，適合家庭多媒體與個人備份', specs: '{"cpu":"Intel Celeron N5105","ram":"4GB DDR4","bays":2,"network":"2.5GbE×2"}', badge: '新品', color: '#0d2a4a', rating: 4.7, reviews: 42 },
    { sku: 'TS-464', name: 'TS-464 四槽 NAS', series: 'Turbo NAS', categoryId: categories[0].id, price: 19900, description: 'Intel N5095 四核心 2.0GHz，PCIe 插槽擴充，2.5GbE × 2，多槽家用首選', specs: '{"cpu":"Intel N5095","ram":"8GB DDR4","bays":4,"network":"2.5GbE×2"}', badge: '熱賣', color: '#0d1a3d', rating: 4.8, reviews: 87 },
    { sku: 'TS-233', name: 'TS-233 雙槽 NAS', series: 'Turbo NAS', categoryId: categories[0].id, price: 5490, originalPrice: 6200, description: 'Realtek 四核心，1GbE，入門家用備份首選，操作簡單，價格實惠', specs: '{"cpu":"Realtek RTD1619B","ram":"2GB DDR4","bays":2,"network":"1GbE×1"}', badge: '特價', color: '#2a1a0d', rating: 4.5, reviews: 33 },
    { sku: 'TS-364', name: 'TS-364 三槽 NAS', series: 'Turbo NAS', categoryId: categories[0].id, price: 14900, description: 'Intel N5105，M.2 SSD 快取加速，兼顧效能與容量的三槽創新設計', specs: '{"cpu":"Intel N5105","ram":"8GB DDR4","bays":3,"network":"2.5GbE×2"}', badge: null, color: '#1a2a3a', rating: 4.6, reviews: 19 },
    { sku: 'TS-873A', name: 'TS-873A 八槽 NAS', series: 'Turbo NAS', categoryId: categories[1].id, price: 42000, description: 'AMD Ryzen V1500B 四核心，PCIe Gen3，雙 M.2 SSD，企業備份與虛擬化利器', specs: '{"cpu":"AMD Ryzen V1500B","ram":"8GB DDR4","bays":8,"network":"2.5GbE×2"}', badge: null, color: '#0d1a2a', rating: 4.9, reviews: 28 },
    { sku: 'TS-673A', name: 'TS-673A 六槽 NAS', series: 'Turbo NAS', categoryId: categories[1].id, price: 28500, originalPrice: 32000, description: 'AMD Ryzen V1500B，6 槽大容量，適合中小企業備份與影像監控', specs: '{"cpu":"AMD Ryzen V1500B","ram":"8GB DDR4","bays":6,"network":"2.5GbE×2"}', badge: '特價', color: '#1a0d2a', rating: 4.7, reviews: 41 },
    { sku: 'TVS-h874', name: 'TVS-h874 八槽 NAS', series: 'TVS-h Series', categoryId: categories[1].id, price: 65000, description: 'Intel Core i5-12400，ZFS 資料保護，企業影像剪輯與高效能運算專用', specs: '{"cpu":"Intel Core i5-12400","ram":"32GB DDR4","bays":8,"network":"2.5GbE×2"}', badge: '旗艦', color: '#0d2a1a', rating: 5.0, reviews: 14 },
    { sku: 'TS-1683XU-RP', name: 'TS-1683XU-RP 機架式', series: 'NAS 機架系列', categoryId: categories[2].id, price: 98000, description: 'Intel Xeon D，冗餘電源，16 槽 2U 機架式，資料中心首選', specs: '{"cpu":"Intel Xeon D-1521","ram":"8GB DDR4 ECC","bays":16,"network":"10GbE×2"}', badge: null, color: '#0d0d1a', rating: 4.8, reviews: 7 },
    { sku: 'TS-832PX', name: 'TS-832PX 機架式', series: 'NAS 機架系列', categoryId: categories[2].id, price: 38500, description: 'Annapurna Labs AL-324，10GbE × 2，2.5GbE × 4，1.5U 低機架高度', specs: '{"cpu":"AL-324","ram":"4GB DDR4","bays":8,"network":"10GbE×2+2.5GbE×4"}', badge: null, color: '#1a1a0d', rating: 4.6, reviews: 11 },
    { sku: 'QSW-1105-5T', name: 'QSW-1105-5T 5埠 2.5GbE', series: 'QSW 非管理型', categoryId: categories[3].id, price: 2990, description: '全埠 2.5GbE，無風扇靜音設計，隨插即用，適合家用與小辦公室', specs: '{"ports":5,"speed":"2.5GbE","fan":"無風扇","managed":"否"}', badge: '熱賣', color: '#0d1a0d', rating: 4.8, reviews: 103 },
    { sku: 'QSW-M408S', name: 'QSW-M408S 網管交換器', series: 'QSW-M 管理型', categoryId: categories[3].id, price: 14200, description: '8 埠 10GbE SFP+，4 埠 1GbE RJ45，網頁管理介面，VLAN/LACP', specs: '{"ports_sfp":8,"ports_rj45":4,"speed_sfp":"10GbE","managed":"是"}', badge: null, color: '#1a0d0d', rating: 4.7, reviews: 24 },
    { sku: 'QSW-M2116P', name: 'QSW-M2116P PoE 交換器', series: 'QSW-M 管理型', categoryId: categories[3].id, price: 18500, description: '16 埠 2.5GbE PoE+，2 埠 10GBASE-T，2 埠 SFP+，總 PoE 功率 370W', specs: '{"poe_ports":16,"uplink":4,"total_power":"370W","managed":"是"}', badge: null, color: '#0d1a1a', rating: 4.6, reviews: 18 },
    { sku: 'UX-1200U-RP', name: 'UX-1200U-RP 12槽擴充', series: '擴充設備', categoryId: categories[4].id, price: 48000, description: '12 槽 SAS/SATA 擴充設備，冗餘電源，2U 機架式，支援 QNAP NAS', specs: '{"bays":12,"interface":"SAS/SATA","form":"2U","redundant_psu":"是"}', badge: null, color: '#1a1a2a', rating: 4.7, reviews: 5 },
    { sku: 'QXG-10G1T', name: 'QXG-10G1T 10GbE 網卡', series: 'QXG 網路擴充', categoryId: categories[5].id, price: 3200, description: 'PCIe Gen3 x4，10GBASE-T RJ45，支援 Windows / Linux / QTS', specs: '{"interface":"PCIe Gen3 x4","speed":"10GbE","connector":"RJ45"}', badge: null, color: '#2a1a1a', rating: 4.6, reviews: 56 },
    { sku: 'QXG-25G2SF', name: 'QXG-25G2SF 雙埠 25GbE', series: 'QXG 網路擴充', categoryId: categories[5].id, price: 12800, description: 'PCIe Gen4，雙埠 25GbE SFP28，低延遲高頻寬，適合企業儲存網路', specs: '{"interface":"PCIe Gen4 x8","speed":"25GbE","ports":2,"connector":"SFP28"}', badge: '新品', color: '#1a2a1a', rating: 4.8, reviews: 12 },
    { sku: 'LIC-NVR-4CH', name: 'QVR Pro 4頻道監控授權', series: '軟體授權', categoryId: categories[6].id, price: 3200, description: 'QVR Pro NVR 軟體 4 頻道 IP 監控永久授權，支援 AI 智能偵測', specs: '{"channels":4,"type":"永久授權"}', badge: null, color: '#2a2a0d', rating: 4.5, reviews: 29 },
    { sku: 'LIC-VJBOD-1Y', name: 'VJBOD Cloud 年費授權', series: '軟體授權', categoryId: categories[6].id, price: 1800, description: '將 Google Drive、S3 等雲端儲存掛載為 NAS 虛擬磁碟機，1 年訂閱', specs: '{"type":"年費訂閱","period":"1年"}', badge: null, color: '#2a0d2a', rating: 4.4, reviews: 17 },
    { sku: 'QEWS-2Y', name: '二年延長保固服務', series: '延長保固 QEWS', categoryId: categories[7].id, price: 3500, description: 'QNAP 原廠延長保固 2 年，涵蓋硬體零件維修與更換服務', specs: '{"period":"2年","type":"硬體"}', badge: null, color: '#0d2a2a', rating: 4.9, reviews: 63 },
    { sku: 'RAM-8GDDR4', name: '8GB DDR4 ECC UDIMM', series: '原廠記憶體', categoryId: categories[8].id, price: 1890, originalPrice: 2200, description: 'QNAP 原廠認證 8GB DDR4-2666 ECC UDIMM，確保系統穩定性', specs: '{"capacity":"8GB","type":"DDR4 ECC UDIMM","speed":"2666MHz"}', badge: '特價', color: '#1a1a3a', rating: 4.7, reviews: 38 },
    { sku: 'RAM-16GDDR5', name: '16GB DDR5 UDIMM', series: '原廠記憶體', categoryId: categories[8].id, price: 3490, description: 'QNAP 原廠 16GB DDR5-4800 UDIMM，支援最新 NAS 平台，效能大幅提升', specs: '{"capacity":"16GB","type":"DDR5 UDIMM","speed":"4800MHz"}', badge: '新品', color: '#1a2a3a', rating: 4.8, reviews: 21 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  // Reviews
  const reviews = [
    { productId: 'TS-264', userName: '王小明', rating: 5, comment: '非常好用，設定簡單，速度快！家裡用來備份照片超方便，2.5G網路也很實用。' },
    { productId: 'TS-264', userName: '陳雅婷', rating: 4, comment: '效能不錯，App 介面友善，就是風扇偶爾有點聲音，整體推薦。' },
    { productId: 'TS-464', userName: '林志遠', rating: 5, comment: '買來放公司做共享儲存，容量夠大，穩定性非常好！搭配 QuMagie 照片管理太讚了。' },
    { productId: 'TS-464', userName: '吳佳蓉', rating: 5, comment: 'PCIe 擴充很方便，之後可以加網卡升級到 10G，非常有前瞻性的設計。' },
    { productId: 'QSW-1105-5T', userName: '黃建宏', rating: 5, comment: '隨插即用，全部換成 2.5G 之後速度真的快很多！家裡網速瞬間升級，強烈推薦。' },
    { productId: 'TS-673A', userName: '李美玲', rating: 4, comment: '六槽夠用，價格合理，AMD CPU 跑虛擬機也很流暢。' },
    { productId: 'TVS-h874', userName: '張偉傑', rating: 5, comment: '旗艦機就是不一樣，ZFS + Intel 12代，跑影片剪輯工作流完全沒問題！' },
  ];

  for (const review of reviews) {
    const product = await prisma.product.findUnique({ where: { sku: review.productId } });
    if (product) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
