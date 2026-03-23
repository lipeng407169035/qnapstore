import express from 'express';
import cors from 'cors';
import { loadDB, saveDB } from './db.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = express();
const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
const PORT = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// 管理员账户
const ADMIN_USER_NAME = process.env.ADMIN_USER || 'admin';
const ADMIN_USER_PASS = process.env.ADMIN_PASS || 'admin123';
const ADMIN_USER = {
  email: 'admin@qnap.com',
  password: 'admin123',
  name: '系统管理员',
  role: 'admin'
};

// ============ Helper Functions ============

function getProductImage(sku) {
  const skuDir = path.join(imagesDir, sku);
  if (fs.existsSync(skuDir)) {
    const files = fs.readdirSync(skuDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
    if (files.length > 0) return `/images/products/${sku}/${files[0]}`;
  }
  return '';
}

function paginate(arr, page = 1, limit = 20, search = '', searchFields = []) {
  let result = [...arr];
  if (search && searchFields.length > 0) {
    const q = search.toLowerCase();
    result = result.filter(item =>
      searchFields.some(field => (item[field] || '').toString().toLowerCase().includes(q))
    );
  }
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total, page, limit, totalPages
  };
}

// ============ Admin Auth Middleware ============

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized - 请提供管理员凭据' });
  }
  try {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString();
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return res.status(401).json({ error: 'Invalid credentials format' });
    const user = decoded.slice(0, colonIdx);
    const pass = decoded.slice(colonIdx + 1);
    if (user !== ADMIN_USER_NAME || pass !== ADMIN_USER_PASS) {
      return res.status(401).json({ error: '无效的管理员凭据' });
    }
  } catch {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }
  next();
}

// ============ Categories ============

app.get('/api/categories', (req, res) => {
  const db = loadDB();
  res.json(db.categories.filter(c => c.active !== false));
});

app.get('/api/admin/categories', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.categories);
});

app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const db = loadDB();
  const { name, slug, icon, desc } = req.body;
  const newCat = {
    id: Date.now(),
    slug,
    name,
    icon,
    desc,
    sort: db.categories.length + 1,
    active: true
  };
  db.categories.push(newCat);
  saveDB(db);
  res.json(newCat);
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDB(db);
  res.json(db.categories[index]);
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[index].active = false;
  saveDB(db);
  res.json({ success: true });
});

// ============ Banners ============

app.get('/api/banners', (req, res) => {
  const db = loadDB();
  res.json(db.banners.filter(b => b.active).sort((a, b) => a.sort - b.sort));
});

app.get('/api/admin/banners', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.banners.sort((a, b) => a.sort - b.sort));
});

app.post('/api/admin/banners', requireAdmin, (req, res) => {
  const db = loadDB();
  const { title, subtitle, btnText, link, gradient, image } = req.body;
  const newBanner = {
    id: Date.now(),
    title,
    subtitle,
    btnText: btnText || '了解更多',
    link: link || '/products',
    gradient: gradient || 'linear-gradient(135deg, #1d3557 0%, #006ebd 100%)',
    image: image || '',
    active: true,
    sort: db.banners.length + 1
  };
  db.banners.push(newBanner);
  saveDB(db);
  res.json(newBanner);
});

app.put('/api/admin/banners/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.banners.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Banner not found' });
  db.banners[index] = { ...db.banners[index], ...req.body };
  saveDB(db);
  res.json(db.banners[index]);
});

app.delete('/api/admin/banners/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.banners.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Banner not found' });
  db.banners.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Announcements

app.get('/api/admin/announcements', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.announcements.sort((a, b) => a.sort - b.sort));
});

app.post('/api/admin/announcements', requireAdmin, (req, res) => {
  const db = loadDB();
  const { text } = req.body;
  const newAnn = {
    id: Date.now(),
    text,
    active: true,
    sort: db.announcements.length + 1
  };
  db.announcements.push(newAnn);
  saveDB(db);
  res.json(newAnn);
});

app.put('/api/admin/announcements/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.announcements.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Announcement not found' });
  db.announcements[index] = { ...db.announcements[index], ...req.body };
  saveDB(db);
  res.json(db.announcements[index]);
});

app.delete('/api/admin/announcements/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.announcements.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Announcement not found' });
  db.announcements.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Settings

app.get('/api/admin/settings', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.settings);
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = loadDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

// ============ SEO ============

app.get('/api/seo', (req, res) => {
  const db = loadDB();
  res.json(db.seo || {});
});

app.get('/api/admin/seo', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.seo || {});
});

app.put('/api/admin/seo', requireAdmin, (req, res) => {
  const db = loadDB();
  db.seo = { ...db.seo, ...req.body };
  saveDB(db);
  res.json(db.seo);
});

// ============ Coupons ============

app.get('/api/coupons/validate', (req, res) => {
  const db = loadDB();
  const { code, amount } = req.query;
  const coupon = db.coupons.find(c => c.code === code && c.active);
  
  if (!coupon) return res.status(404).json({ error: '优惠码无效' });
  
  const now = new Date();
  if (new Date(coupon.startDate) > now) return res.status(400).json({ error: '优惠码尚未生效' });
  if (new Date(coupon.endDate) < now) return res.status(400).json({ error: '优惠码已过期' });
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ error: '优惠码已使用完毕' });
  }
  if (coupon.minOrderAmount && (amount as number) < coupon.minOrderAmount) {
    return res.status(400).json({ error: `最低消费 ¥${coupon.minOrderAmount}` });
  }
  
  let discount = coupon.discountType === 'percentage'
    ? Math.min((amount as number) * coupon.discountValue / 100, coupon.maxDiscount || Infinity)
    : coupon.discountValue;
  
  res.json({ valid: true, discount: Math.round(discount), coupon });
});

app.get('/api/admin/coupons', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.coupons);
});

app.post('/api/admin/coupons', requireAdmin, (req, res) => {
  const db = loadDB();
  const { code, discountType, discountValue, minOrderAmount, maxDiscount, startDate, endDate, usageLimit, active } = req.body;
  const newCoupon = {
    id: Date.now(),
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscount: maxDiscount || null,
    startDate,
    endDate,
    usageLimit: usageLimit || null,
    usedCount: 0,
    active: active !== false,
  };
  db.coupons.push(newCoupon);
  saveDB(db);
  res.json(newCoupon);
});

app.put('/api/admin/coupons/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.coupons.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Coupon not found' });
  db.coupons[index] = { ...db.coupons[index], ...req.body };
  saveDB(db);
  res.json(db.coupons[index]);
});

app.delete('/api/admin/coupons/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.coupons.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Coupon not found' });
  db.coupons.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Products ============

app.get('/api/products', (req, res) => {
  const db = loadDB();
  const { category, search, sort, badge, rating } = req.query;
  let products = [...db.products];

  if (category) {
    products = products.filter(p => p.categorySlug === category);
  }
  if (search) {
    const q = search as string;
    products = products.filter(p => 
      p.name.includes(q) || p.sku.includes(q) || p.description.includes(q)
    );
  }
  if (badge === 'sale') {
    products = products.filter(p => p.originalPrice);
  } else if (badge) {
    products = products.filter(p => p.badge === badge);
  }
  if (rating) {
    const minRating = parseFloat(rating as string);
    products = products.filter(p => p.rating >= minRating);
  }
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const db = loadDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/products/sku/:sku', (req, res) => {
  const db = loadDB();
  const product = db.products.find(p => p.sku === req.params.sku);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/admin/products', requireAdmin, (req, res) => {
  const { page = 1, limit = 24, search = '' } = req.query;
  const db = loadDB();
  const products = db.products.map(p => ({ ...p, imageUrl: getProductImage(p.sku) }));
  const result = paginate(products, parseInt(page as string), parseInt(limit as string), search as string, ['name', 'sku', 'categoryName']);
  res.json(result);
});

app.post('/api/admin/products/import', upload.single('file'), (req, res) => {
  const db = loadDB();
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const content = req.file.buffer.toString('utf-8').replace(/^\ufeff/, '');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return res.status(400).json({ error: 'CSV must have header and at least one data row' });
  
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results = { created: 0, updated: 0, errors: [] as string[] };
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of lines[i]) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += char; }
    }
    values.push(current.trim());
    if (values.length < header.length) continue;
    const row: Record<string, string> = {};
    header.forEach((h, idx) => { row[h] = values[idx] || ''; });
    
    if (!row.sku) { results.errors.push(`Row ${i}: SKU 必填`); continue; }
    
    const specs = typeof row.specs === 'string' ? JSON.parse(row.specs || '{}') : {};
    const existing = db.products.findIndex(p => p.sku === row.sku);
    
    const product = {
      id: existing >= 0 ? db.products[existing].id : `prod_${Date.now()}_${i}`,
      sku: row.sku,
      name: row.name || row.sku,
      series: row.series || '',
      categorySlug: row.categorySlug || 'home-nas',
      categoryName: row.categoryName || '家用 NAS',
      categoryId: db.categories.find(c => c.slug === (row.categorySlug || 'home-nas'))?.id || 1,
      price: parseInt(row.price) || 0,
      originalPrice: row.originalPrice ? parseInt(row.originalPrice) : null,
      description: row.description || '',
      specs: JSON.stringify(specs),
      badge: row.badge || null,
      color: row.color || '#006ebd',
      rating: parseFloat(row.rating) || 0,
      reviews: parseInt(row.reviews) || 0,
      stock: parseInt(row.stock) || 0,
    };
    
    if (existing >= 0) {
      db.products[existing] = { ...db.products[existing], ...product };
      results.updated++;
    } else {
      db.products.push(product);
      results.created++;
    }
  }
  
  saveDB(db);
  res.json({ success: true, ...results });
});

app.post('/api/admin/products', (req, res) => {
  const db = loadDB();
  const { sku, name, series, categoryId, categorySlug, categoryName, price, originalPrice, description, specs, badge, color, rating, reviews, stock } = req.body;
  
  const product = {
    id: `prod_${Date.now()}`,
    sku,
    name,
    series,
    categoryId,
    categorySlug,
    categoryName,
    price,
    originalPrice: originalPrice || null,
    description,
    specs: typeof specs === 'string' ? specs : JSON.stringify(specs),
    badge: badge || null,
    color: color || '#006ebd',
    rating: rating || 0,
    reviews: reviews || 0,
    stock: stock || 0,
  };
  
  db.products.push(product);
  saveDB(db);
  res.json(product);
});

app.put('/api/admin/products/:id', (req, res) => {
  const db = loadDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  db.products[index] = { ...db.products[index], ...req.body };
  saveDB(db);
  res.json(db.products[index]);
});

app.delete('/api/admin/products/:id', (req, res) => {
  const db = loadDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  const product = db.products[index];
  const skuDir = path.join(imagesDir, product.sku);
  if (fs.existsSync(skuDir)) {
    fs.rmSync(skuDir, { recursive: true, force: true });
  }
  
  db.products.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Reviews ============

app.get('/api/products/:id/reviews', (req, res) => {
  const db = loadDB();
  const reviews = db.reviews.filter(r => r.productId === req.params.id && r.approved);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const db = loadDB();
  const { productId, userName, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  const review = {
    id: `rev_${Date.now()}`,
    productId,
    userName: userName || '匿名用户',
    rating: parseInt(rating),
    comment,
    approved: false,
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(review);
  saveDB(db);
  res.json({ success: true, message: '评论已提交，等待审核' });
});

app.get('/api/admin/reviews', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const db = loadDB();
  const result = paginate(
    db.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    parseInt(page as string), parseInt(limit as string), search as string, ['userName', 'comment']
  );
  res.json(result);
});

app.put('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Review not found' });
  db.reviews[index] = { ...db.reviews[index], ...req.body };
  saveDB(db);
  res.json(db.reviews[index]);
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Review not found' });
  db.reviews.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Orders ============

app.post('/api/orders', (req, res) => {
  const db = loadDB();
  const { userId, items, shippingName, shippingPhone, shippingAddress, paymentMethod, total } = req.body;
  const orderNo = `QNAP${Date.now()}`;
  
  const order = {
    id: `order_${Date.now()}`,
    orderNo,
    userId,
    total,
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
    items: items.map(item => ({
      ...item,
      product: db.products.find(p => p.id === item.productId)
    }))
  };
  
  db.orders.push(order);
  saveDB(db);
  res.json(order);
});

app.get('/api/orders/:userId', (req, res) => {
  const db = loadDB();
  const orders = db.orders.filter(o => o.userId === req.params.userId);
  res.json(orders);
});

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search = '', status } = req.query;
  const db = loadDB();
  let orders = [...db.orders];
  
  if (search) {
    const q = search as string;
    orders = orders.filter(o =>
      o.orderNo.toLowerCase().includes(q.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(q.toLowerCase()) ||
      (o.shippingPhone || '').includes(q)
    );
  }
  if (status) {
    orders = orders.filter(o => o.status === status);
  }
  
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const result = paginate(orders, parseInt(page as string), parseInt(limit as string));
  res.json(result);
});

app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  
  db.orders[index] = { ...db.orders[index], ...req.body };
  saveDB(db);
  res.json(db.orders[index]);
});

// ============ Images ============

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const skuDir = path.join(imagesDir, req.params.sku);
    if (!fs.existsSync(skuDir)) {
      fs.mkdirSync(skuDir, { recursive: true });
    }
    cb(null, skuDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const uploadDisk = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /\.(svg|png|jpg|jpeg|webp)$/i;
    cb(null, allowed.test(file.originalname));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get('/api/images/:sku', (req, res) => {
  const skuDir = path.join(imagesDir, req.params.sku);
  if (!fs.existsSync(skuDir)) {
    return res.json([]);
  }
  const files = fs.readdirSync(skuDir)
    .filter(f => /\.(svg|png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map(f => ({
      name: f,
      url: `/images/products/${req.params.sku}/${f}`,
      size: fs.statSync(path.join(skuDir, f)).size,
      updatedAt: fs.statSync(path.join(skuDir, f)).mtime.toISOString(),
    }));
  res.json(files);
});

app.get('/api/admin/images/:sku', requireAdmin, (req, res) => {
  const skuDir = path.join(imagesDir, req.params.sku);
  if (!fs.existsSync(skuDir)) {
    return res.json([]);
  }
  const files = fs.readdirSync(skuDir)
    .filter(f => /\.(svg|png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map(f => ({
      name: f,
      url: `/images/products/${req.params.sku}/${f}`,
      size: fs.statSync(path.join(skuDir, f)).size,
      updatedAt: fs.statSync(path.join(skuDir, f)).mtime.toISOString(),
    }));
  res.json(files);
});

app.post('/api/admin/images/:sku', requireAdmin, uploadDisk.array('images', 20), (req, res) => {
  const skuDir = path.join(imagesDir, req.params.sku);
  if (!fs.existsSync(skuDir)) {
    fs.mkdirSync(skuDir, { recursive: true });
  }
  const files = (req.files as Express.Multer.File[]).map(f => ({
    name: f.filename,
    url: `/images/products/${req.params.sku}/${f.filename}`,
    size: f.size,
    updatedAt: new Date().toISOString(),
  }));
  res.json({ success: true, files });
});

app.delete('/api/admin/images/:sku/:filename', requireAdmin, (req, res) => {
  const filePath = path.join(imagesDir, req.params.sku, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

app.post('/api/images/batch', (req, res) => {
  const { skus } = req.body;
  if (!Array.isArray(skus)) return res.status(400).json({ error: 'skus must be an array' });
  const result: Record<string, string> = {};
  skus.forEach((sku: string) => {
    result[sku] = getProductImage(sku);
  });
  res.json(result);
});

// ============ Auth ============

app.post('/api/auth/register', (req, res) => {
  const db = loadDB();
  const { email, password, name } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const user = {
    id: `user_${Date.now()}`,
    email,
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(user);
  saveDB(db);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/auth/login', (req, res) => {
  const db = loadDB();
  const { email, password } = req.body;
  
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    return res.json({ ...ADMIN_USER, id: 'admin_1' });
  }
  
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.users.map(u => ({ ...u, password: '***' })));
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const db = loadDB();
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentOrders = db.orders
    .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const revenueByDay: Record<string, number> = {};
  recentOrders.forEach(order => {
    const day = new Date(order.createdAt).toISOString().split('T')[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
  });
  
  const ordersByStatus = {
    pending: db.orders.filter(o => o.status === 'pending').length,
    processing: db.orders.filter(o => o.status === 'processing').length,
    shipped: db.orders.filter(o => o.status === 'shipped').length,
    completed: db.orders.filter(o => o.status === 'completed').length,
    cancelled: db.orders.filter(o => o.status === 'cancelled').length,
  };
  
  const topProducts: { id: string; sku: string; name: string; count: number; revenue: number }[] = [];
  const productSales: Record<string, { count: number; revenue: number }> = {};
  db.orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { count: 0, revenue: 0 };
      }
      productSales[item.productId].count += item.quantity || 1;
      productSales[item.productId].revenue += item.price * (item.quantity || 1);
    });
  });
  Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .forEach(([productId, data]) => {
      const product = db.products.find(p => p.id === productId);
      if (product) {
        topProducts.push({ id: productId, sku: product.sku, name: product.name, count: data.count, revenue: data.revenue });
      }
    });
  
  const threshold = db.settings.stockAlertThreshold || 20;
  const lowStockProducts = db.products
    .filter(p => p.stock > 0 && p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);
  
  const outOfStockProducts = db.products.filter(p => p.stock === 0);
  
  const stats = {
    totalProducts: db.products.length,
    totalOrders: db.orders.length,
    totalUsers: db.users.length,
    totalRevenue: db.orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: ordersByStatus.pending,
    recentOrders: db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    revenueByDay,
    ordersByStatus,
    topProducts,
    lowStockProducts,
    outOfStockProducts,
    stockAlertThreshold: threshold,
    monthlyRevenue: recentOrders.reduce((s, o) => s + o.total, 0),
    monthlyOrders: recentOrders.length,
  };
  res.json(stats);
});

// ============ Product Views ============

app.post('/api/products/:id/view', (req, res) => {
  const db = loadDB();
  const productId = req.params.id;
  if (!db.productViews) db.productViews = {};
  db.productViews[productId] = (db.productViews[productId] || 0) + 1;
  saveDB(db);
  res.json({ views: db.productViews[productId] });
});

app.get('/api/admin/product-views', requireAdmin, (req, res) => {
  const db = loadDB();
  const views = db.productViews || {};
  const enriched = db.products.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    views: views[p.id] || 0,
    stock: p.stock,
  })).sort((a, b) => b.views - a.views);
  res.json(enriched);
});

// ============ Batch Stock Adjustment ============

app.post('/api/admin/products/batch-stock', requireAdmin, (req, res) => {
  const db = loadDB();
  const { adjustments } = req.body;
  if (!Array.isArray(adjustments)) {
    return res.status(400).json({ error: 'adjustments must be an array' });
  }
  adjustments.forEach(({ productId, stockChange }) => {
    const product = db.products.find(p => p.id === productId);
    if (product) {
      product.stock = Math.max(0, product.stock + stockChange);
    }
  });
  saveDB(db);
  res.json({ success: true, message: `已更新 ${adjustments.length} 项商品库存` });
});

// ============ CSV Import / Export ============

app.get('/api/admin/products/export', requireAdmin, (req, res) => {
  const db = loadDB();
  const header = ['sku', 'name', 'series', 'categorySlug', 'categoryName', 'price', 'originalPrice', 'description', 'badge', 'color', 'rating', 'reviews', 'stock'];
  const rows = db.products.map(p => [
    p.sku, p.name, p.series, p.categorySlug, p.categoryName,
    p.price, p.originalPrice || '', `"${(p.description || '').replace(/"/g, '""')}"`,
    p.badge || '', p.color, p.rating, p.reviews, p.stock
  ].join(','));
  const csv = [header.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
  res.send('\ufeff' + csv);
});

app.get('/api/admin/orders/export', requireAdmin, (req, res) => {
  const db = loadDB();
  const header = ['orderNo', 'shippingName', 'shippingPhone', 'shippingAddress', 'total', 'status', 'paymentMethod', 'createdAt'];
  const rows = db.orders.map(o => [
    o.orderNo, o.shippingName, o.shippingPhone || '', o.shippingAddress || '',
    o.total, o.status, o.paymentMethod, o.createdAt
  ].map(v => `"${v}"`).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
  res.send(csv);
});

// ============ Activities ============

app.get('/api/admin/activities', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.activities || []);
});

// ============ Flash Sales / Activities ============

app.post('/api/admin/activities', requireAdmin, (req, res) => {
  const db = loadDB();
  const { name, type, discountValue, startDate, endDate, productIds, active } = req.body;
  const activity = {
    id: `act_${Date.now()}`,
    name,
    type: type || 'flash_sale',
    discountValue: parseFloat(discountValue) || 0,
    startDate,
    endDate,
    productIds: productIds || [],
    active: active !== false,
    createdAt: new Date().toISOString(),
  };
  if (!db.activities) db.activities = [];
  db.activities.push(activity);
  saveDB(db);
  res.json(activity);
});

app.put('/api/admin/activities/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.activities || []).findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Activity not found' });
  db.activities[index] = { ...db.activities[index], ...req.body };
  saveDB(db);
  res.json(db.activities[index]);
});

app.delete('/api/admin/activities/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.activities || []).findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Activity not found' });
  db.activities.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Email Templates ============

app.get('/api/admin/email-templates', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.emailTemplates || {});
});

app.put('/api/admin/email-templates/:key', requireAdmin, (req, res) => {
  const db = loadDB();
  const { key } = req.params;
  if (!db.emailTemplates) db.emailTemplates = {};
  db.emailTemplates[key] = { ...db.emailTemplates[key], ...req.body };
  saveDB(db);
  res.json(db.emailTemplates[key]);
});

app.get('/api/activities', (req, res) => {
  const db = loadDB();
  const now = new Date();
  const active = (db.activities || []).filter(a => {
    if (!a.active) return false;
    if (a.startDate && new Date(a.startDate) > now) return false;
    if (a.endDate && new Date(a.endDate) < now) return false;
    return true;
  });
  res.json(active);
});

// ============ Product Review Recalculate ============

app.post('/api/admin/reviews/recalculate/:productId', requireAdmin, (req, res) => {
  const db = loadDB();
  const productId = req.params.productId;
  const reviews = db.reviews.filter(r => r.productId === productId && r.approved);
  if (reviews.length === 0) {
    return res.json({ rating: 0, reviews: 0 });
  }
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const product = db.products.find(p => p.id === productId);
  if (product) {
    product.rating = Math.round(avgRating * 10) / 10;
    product.reviews = reviews.length;
    saveDB(db);
  }
  res.json({ rating: product?.rating || avgRating, reviews: reviews.length });
});

// ============ Popular Searches ============

app.get('/api/popular-searches', (req, res) => {
  const db = loadDB();
  res.json(db.popularSearches || []);
});

app.get('/api/admin/popular-searches', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.popularSearches || []);
});

app.put('/api/admin/popular-searches', requireAdmin, (req, res) => {
  const db = loadDB();
  const { searches } = req.body;
  db.popularSearches = searches;
  saveDB(db);
  res.json({ success: true });
});

// ============ Customers ============

app.get('/api/admin/customers', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const db = loadDB();
  const result = paginate(db.customers || [], parseInt(page as string), parseInt(limit as string), search as string, ['name', 'email', 'phone']);
  res.json(result);
});

app.get('/api/admin/customers/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const customer = db.customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  const customerOrders = db.orders.filter(o => o.shippingPhone === customer.phone);
  res.json({ ...customer, orders: customerOrders });
});

app.post('/api/admin/customers', requireAdmin, (req, res) => {
  const db = loadDB();
  const { name, email, phone, address } = req.body;
  const customer = {
    id: `cust_${Date.now()}`,
    name, email, phone, address,
    totalOrders: 0, totalSpent: 0,
    lastOrderDate: null,
    registeredAt: new Date().toISOString().split('T')[0],
    level: 'bronze',
    points: 0,
  };
  db.customers.push(customer);
  saveDB(db);
  res.json(customer);
});

app.put('/api/admin/customers/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  db.customers[index] = { ...db.customers[index], ...req.body };
  saveDB(db);
  res.json(db.customers[index]);
});

app.get('/api/admin/customers/rfm', requireAdmin, (req, res) => {
  const db = loadDB();
  const customers = db.customers.map(c => {
    const customerOrders = db.orders.filter(o => o.shippingPhone === c.phone && o.status === 'completed');
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    const lastOrder = customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const now = new Date();
    const lastDate = lastOrder ? new Date(lastOrder.createdAt) : null;
    const daysSince = lastDate ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;
    const frequency = customerOrders.length || 1;
    const monetary = totalSpent || c.totalSpent || 0;

    let recencyScore = daysSince <= 7 ? 5 : daysSince <= 30 ? 4 : daysSince <= 90 ? 3 : daysSince <= 180 ? 2 : 1;
    let frequencyScore = frequency >= 5 ? 5 : frequency >= 3 ? 4 : frequency >= 2 ? 3 : frequency >= 1 ? 2 : 1;
    let monetaryScore = monetary >= 10000 ? 5 : monetary >= 5000 ? 4 : monetary >= 2000 ? 3 : monetary >= 500 ? 2 : 1;
    const rfmScore = recencyScore + frequencyScore + monetaryScore;
    const rfmSegment = `${recencyScore}${frequencyScore}${monetaryScore}`;

    let tag = '普通客户';
    if (rfmScore >= 13) tag = '高价值客户';
    else if (rfmScore >= 9) tag = '潜力客户';
    else if (recencyScore <= 2) tag = '流失风险';
    else if (frequencyScore >= 4) tag = '忠诚客户';

    return {
      ...c,
      totalOrders: customerOrders.length || c.totalOrders,
      totalSpent: monetary,
      lastOrderDate: lastOrder?.createdAt || c.lastOrderDate,
      daysSinceLastOrder: daysSince,
      rfmScore,
      rfmSegment,
      tag,
      recencyScore,
      frequencyScore,
      monetaryScore,
    };
  });
  res.json(customers.sort((a, b) => b.rfmScore - a.rfmScore));
});

// ============ Invoices ============

app.get('/api/admin/invoices', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.invoices || []);
});

app.post('/api/admin/invoices', requireAdmin, (req, res) => {
  const db = loadDB();
  const { orderId, orderNo, type, title, taxNo, email, amount } = req.body;
  const invoice = {
    id: `inv_${Date.now()}`,
    orderId, orderNo, type, title, taxNo, email, amount,
    status: '已开票',
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.invoices.push(invoice);
  saveDB(db);
  res.json(invoice);
});

app.put('/api/admin/invoices/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.invoices.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
  db.invoices[index] = { ...db.invoices[index], ...req.body };
  saveDB(db);
  res.json(db.invoices[index]);
});

app.post('/api/invoice/apply', (req, res) => {
  const db = loadDB();
  const { orderId, orderNo, type, title, taxNo, email, amount } = req.body;
  const invoice = {
    id: `inv_${Date.now()}`,
    orderId, orderNo, type: type || '电子发票',
    title: title || '个人',
    taxNo: taxNo || '',
    email: email || '',
    amount: amount || 0,
    status: '申请中',
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.invoices.push(invoice);
  saveDB(db);
  res.json({ success: true, message: '发票申请已提交', invoice });
});

// ============ Shipping Tracking ============

app.get('/api/tracking/:trackingNo', (req, res) => {
  const { trackingNo } = req.params;
  res.json({
    trackingNo,
    status: '运输中',
    events: [
      { time: new Date().toISOString(), location: '目的地城市', description: '派送中，预计今日送达' },
      { time: new Date(Date.now() - 86400000).toISOString(), location: '中转中心', description: '快件已到达中转中心' },
      { time: new Date(Date.now() - 172800000).toISOString(), location: '发货城市', description: '快件已发出，揽收员已取件' },
    ],
  });
});

// ============ Restock Notifications ============

app.get('/api/admin/restock-notifications', requireAdmin, (req, res) => {
  const db = loadDB();
  const outOfStock = db.products.filter(p => p.stock === 0);
  res.json(outOfStock);
});

// ============ Staff Members ============

app.get('/api/admin/staff', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.staffMembers || []);
});

app.post('/api/admin/staff', requireAdmin, (req, res) => {
  const db = loadDB();
  const { name, email, role, phone } = req.body;
  const staff = {
    id: `staff_${Date.now()}`,
    name, email, role: role || 'operator',
    phone: phone || '',
    password: '123456',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: null,
  };
  db.staffMembers.push(staff);
  saveDB(db);
  res.json(staff);
});

app.put('/api/admin/staff/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.staffMembers.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Staff not found' });
  db.staffMembers[index] = { ...db.staffMembers[index], ...req.body };
  saveDB(db);
  res.json(db.staffMembers[index]);
});

app.delete('/api/admin/staff/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.staffMembers.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Staff not found' });
  db.staffMembers.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Audit Logs ============

app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  const db = loadDB();
  const { action, target, page = 1, limit = 50 } = req.query;
  let logs = [...(db.auditLogs || [])];
  if (action) logs = logs.filter(l => l.action.includes(action as string));
  if (target) logs = logs.filter(l => l.target.includes(target as string));
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = logs.length;
  const p = parseInt(page as string);
  const l = parseInt(limit as string);
  res.json({ logs: logs.slice((p - 1) * l, p * l), total, page: p, limit: l });
});

function addAuditLog(staffId: string, staffName: string, action: string, target: string, targetName: string) {
  const db = loadDB();
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.push({
    id: `log_${Date.now()}`,
    staffId, staffName, action, target, targetName,
    createdAt: new Date().toISOString(),
  });
  saveDB(db);
}

// ============ Sales Reports ============

app.get('/api/admin/reports/sales', requireAdmin, (req, res) => {
  const db = loadDB();
  const { start, end } = req.query;
  let orders = db.orders.filter(o => o.status === 'completed');
  if (start) orders = orders.filter(o => new Date(o.createdAt) >= new Date(start as string));
  if (end) orders = orders.filter(o => new Date(o.createdAt) <= new Date(end as string));

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueByDay: Record<string, number> = {};
  const ordersByDay: Record<string, number> = {};
  const revenueByProduct: Record<string, { name: string; revenue: number; quantity: number }> = {};
  const revenueByCategory: Record<string, number> = {};
  const revenueByPayment: Record<string, number> = {};

  orders.forEach(order => {
    const day = order.createdAt.split('T')[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
    ordersByDay[day] = (ordersByDay[day] || 0) + 1;
    revenueByPayment[order.paymentMethod] = (revenueByPayment[order.paymentMethod] || 0) + order.total;

    order.items?.forEach((item: any) => {
      const product = db.products.find(p => p.id === item.productId);
      if (!revenueByProduct[item.productId]) {
        revenueByProduct[item.productId] = { name: product?.name || item.productId, revenue: 0, quantity: 0 };
      }
      revenueByProduct[item.productId].revenue += (item.price || 0) * (item.quantity || 1);
      revenueByProduct[item.productId].quantity += item.quantity || 1;
      if (product) {
        revenueByCategory[product.categoryName] = (revenueByCategory[product.categoryName] || 0) + (item.price || 0) * (item.quantity || 1);
      }
    });
  });

  res.json({
    totalRevenue,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue),
    revenueByDay: Object.entries(revenueByDay).sort((a, b) => a[0].localeCompare(b[0])),
    ordersByDay: Object.entries(ordersByDay).sort((a, b) => a[0].localeCompare(b[0])),
    topProducts: Object.entries(revenueByProduct)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10)
      .map(([id, data]) => ({ id, ...data })),
    revenueByCategory,
    revenueByPayment,
  });
});

// ============ Shipping Companies ============

app.get('/api/admin/shipping-companies', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.shippingCompanies || []);
});

app.put('/api/admin/shipping-companies', requireAdmin, (req, res) => {
  const db = loadDB();
  const { companies } = req.body;
  db.shippingCompanies = companies;
  saveDB(db);
  res.json({ success: true });
});

// ============ Full Reductions (满减活动) ============

app.get('/api/admin/full-reductions', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.fullReductions || []);
});

app.post('/api/admin/full-reductions', requireAdmin, (req, res) => {
  const db = loadDB();
  const { name, threshold, discount, type, startDate, endDate, active } = req.body;
  const newAct = {
    id: `fr_${Date.now()}`,
    name,
    threshold: parseInt(threshold) || 0,
    discount: parseInt(discount) || 0,
    type: type || 'fixed',
    startDate: startDate || '',
    endDate: endDate || '',
    active: active !== false,
    createdAt: new Date().toISOString().split('T')[0],
  };
  if (!db.fullReductions) db.fullReductions = [];
  db.fullReductions.push(newAct);
  saveDB(db);
  res.json(newAct);
});

app.put('/api/admin/full-reductions/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  if (!db.fullReductions) db.fullReductions = [];
  const index = db.fullReductions.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Activity not found' });
  db.fullReductions[index] = { ...db.fullReductions[index], ...req.body, threshold: parseInt(req.body.threshold) || db.fullReductions[index].threshold, discount: parseInt(req.body.discount) || db.fullReductions[index].discount };
  saveDB(db);
  res.json(db.fullReductions[index]);
});

app.delete('/api/admin/full-reductions/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  if (!db.fullReductions) db.fullReductions = [];
  const index = db.fullReductions.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Activity not found' });
  db.fullReductions.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/full-reductions', (req, res) => {
  const db = loadDB();
  const now = new Date();
  const active = (db.fullReductions || []).filter(a => {
    if (!a.active) return false;
    if (a.startDate && new Date(a.startDate) > now) return false;
    if (a.endDate && new Date(a.endDate) < now) return false;
    return true;
  });
  res.json(active);
});

// ============ News ============

app.get('/api/news', (req, res) => {
  const db = loadDB();
  const { category } = req.query;
  let news = db.news.filter(n => n.active !== false);
  if (category && category !== '全部') {
    news = news.filter(n => n.category === category);
  }
  res.json(news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
});

app.get('/api/news/:id', (req, res) => {
  const db = loadDB();
  const item = db.news.find(n => n.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'News not found' });
  res.json(item);
});

app.get('/api/admin/news', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const db = loadDB();
  const result = paginate(
    db.news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    parseInt(page as string), parseInt(limit as string), search as string, ['title']
  );
  res.json(result);
});

app.post('/api/admin/news', requireAdmin, (req, res) => {
  const db = loadDB();
  const { title, category, date, excerpt, content, image, hot, active } = req.body;
  const item = {
    id: Date.now(),
    title, category, date, excerpt, content,
    image: image || '',
    hot: hot === true,
    active: active !== false,
  };
  db.news.push(item);
  saveDB(db);
  res.json(item);
});

app.put('/api/admin/news/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.news.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.news[index] = { ...db.news[index], ...req.body };
  saveDB(db);
  res.json(db.news[index]);
});

app.delete('/api/admin/news/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = db.news.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.news.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ Partnership Applications ============

app.post('/api/partnership/apply', (req, res) => {
  const db = loadDB();
  const { company, contact, phone, email, tier, businessType, revenueScale, employeeCount, brandExp, customerTypes } = req.body;
  if (!company || !contact || !phone || !email) {
    return res.status(400).json({ error: '请填写必填字段' });
  }
  const item = {
    id: `pa_${Date.now()}`,
    company, contact, phone, email,
    tier: tier || 'silver',
    businessType: businessType || '',
    revenueScale: revenueScale || '',
    employeeCount: employeeCount || '',
    brandExp: brandExp || '',
    customerTypes: customerTypes || [],
    status: 'pending',
    notes: '',
    createdAt: new Date().toISOString(),
  };
  if (!db.partnershipApps) db.partnershipApps = [];
  db.partnershipApps.push(item);
  saveDB(db);
  res.json({ success: true, message: '申请已提交，QNAP 业务团队将在 3 个工作日内与您联系' });
});

app.get('/api/admin/partnership-applications', requireAdmin, (req, res) => {
  const db = loadDB();
  const { status } = req.query;
  let apps = db.partnershipApps || [];
  if (status) apps = apps.filter(a => a.status === status);
  res.json(apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.put('/api/admin/partnership-applications/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.partnershipApps || []).findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.partnershipApps[index] = { ...db.partnershipApps[index], ...req.body };
  saveDB(db);
  res.json(db.partnershipApps[index]);
});

// ============ Warranty Submissions ============

app.post('/api/warranty/submit', (req, res) => {
  const db = loadDB();
  const { name, phone, email, product, serial, purchaseDate, issue } = req.body;
  if (!name || !phone || !product || !issue) {
    return res.status(400).json({ error: '请填写必填字段' });
  }
  const item = {
    id: `ws_${Date.now()}`,
    name, phone, email: email || '',
    product, serial: serial || '',
    purchaseDate: purchaseDate || '',
    issue,
    status: 'pending',
    notes: '',
    createdAt: new Date().toISOString(),
  };
  if (!db.warrantySubs) db.warrantySubs = [];
  db.warrantySubs.push(item);
  saveDB(db);
  res.json({ success: true, message: '质保申请已提交，我们将在 1-2 个工作日内与您联系' });
});

app.get('/api/warranty/my-submissions', (req, res) => {
  const db = loadDB();
  const { phone, email } = req.query;
  let subs = db.warrantySubs || [];
  if (phone) subs = subs.filter(s => s.phone === phone);
  else if (email) subs = subs.filter(s => s.email === email);
  res.json(subs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.get('/api/admin/warranty-submissions', requireAdmin, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const db = loadDB();
  const { status } = req.query;
  let subs = db.warrantySubs || [];
  if (status) subs = subs.filter(s => s.status === status);
  const result = paginate(subs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), parseInt(page as string), parseInt(limit as string));
  res.json(result);
});

app.put('/api/admin/warranty-submissions/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.warrantySubs || []).findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.warrantySubs[index] = { ...db.warrantySubs[index], ...req.body };
  saveDB(db);
  res.json(db.warrantySubs[index]);
});

// ============ Support Tickets ============

app.post('/api/support/submit', (req, res) => {
  const db = loadDB();
  const { name, phone, email, product, subject, issueType, description } = req.body;
  if (!name || !phone || !subject || !issueType || !description) {
    return res.status(400).json({ error: '请填写必填字段' });
  }
  const item = {
    id: `st_${Date.now()}`,
    name, phone, email: email || '',
    product: product || '',
    subject, issueType, description,
    status: 'open',
    assignee: '',
    notes: '',
    createdAt: new Date().toISOString(),
  };
  if (!db.supportTickets) db.supportTickets = [];
  db.supportTickets.push(item);
  saveDB(db);
  res.json({ success: true, message: '工单已提交，技术支持团队将在 24 小时内响应' });
});

app.get('/api/support/my-tickets', (req, res) => {
  const db = loadDB();
  const { phone, email } = req.query;
  let tickets = db.supportTickets || [];
  if (phone) tickets = tickets.filter(t => t.phone === phone);
  else if (email) tickets = tickets.filter(t => t.email === email);
  res.json(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.get('/api/admin/support-tickets', requireAdmin, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const db = loadDB();
  const { status } = req.query;
  let tickets = db.supportTickets || [];
  if (status) tickets = tickets.filter(t => t.status === status);
  const result = paginate(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), parseInt(page as string), parseInt(limit as string), '', []);
  res.json(result);
});

app.put('/api/admin/support-tickets/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.supportTickets || []).findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.supportTickets[index] = { ...db.supportTickets[index], ...req.body };
  saveDB(db);
  res.json(db.supportTickets[index]);
});

// ============ Downloads ============

const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

const downloadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sku = req.body.sku || 'general';
    const dir = path.join(downloadsDir, sku);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadDownload = multer({
  storage: downloadStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

app.get('/api/downloads', (req, res) => {
  const db = loadDB();
  const { sku } = req.query;
  let files = db.downloads || [];
  if (sku) files = files.filter(f => f.sku === sku);
  res.json(files);
});

app.post('/api/admin/downloads', requireAdmin, uploadDownload.single('file'), (req, res) => {
  const db = loadDB();
  const { sku, fileName, fileType, version } = req.body;
  if (!sku || !fileName) return res.status(400).json({ error: 'sku 和 fileName 必填' });
  const file = req.file;
  const size = file ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : (req.body.size || '未知');
  const url = file ? `/downloads/${sku}/${file.filename}` : (req.body.url || '');
  const item = {
    id: `dl_${Date.now()}`,
    sku, fileName,
    fileType: fileType || (file?.mimetype.includes('pdf') ? 'PDF' : '其他'),
    version: version || '',
    size,
    url,
    createdAt: new Date().toISOString().split('T')[0],
  };
  if (!db.downloads) db.downloads = [];
  db.downloads.push(item);
  saveDB(db);
  res.json(item);
});

app.put('/api/admin/downloads/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.downloads || []).findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.downloads[index] = { ...db.downloads[index], ...req.body };
  saveDB(db);
  res.json(db.downloads[index]);
});

app.delete('/api/admin/downloads/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.downloads || []).findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  const item = db.downloads[index];
  if (item.url) {
    const filePath = path.join(process.cwd(), 'public', item.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.downloads.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ FAQ ============

app.get('/api/faq', (req, res) => {
  const db = loadDB();
  const faq = db.faq || [];
  const categories = [...new Set(faq.map(f => f.category))];
  const result = categories.map(cat => ({
    category: cat,
    items: faq.filter(f => f.category === cat).sort((a, b) => a.sortOrder - b.sortOrder),
  }));
  res.json(result);
});

app.get('/api/admin/faq', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json((db.faq || []).sort((a, b) => a.sortOrder - b.sortOrder));
});

app.post('/api/admin/faq', requireAdmin, (req, res) => {
  const db = loadDB();
  const { category, question, answer, sortOrder } = req.body;
  if (!category || !question || !answer) return res.status(400).json({ error: '请填写必填字段' });
  const item = {
    id: Date.now(),
    category, question, answer,
    sortOrder: sortOrder || ((db.faq || []).filter(f => f.category === category).length + 1),
  };
  if (!db.faq) db.faq = [];
  db.faq.push(item);
  saveDB(db);
  res.json(item);
});

app.put('/api/admin/faq/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.faq || []).findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.faq[index] = { ...db.faq[index], ...req.body };
  saveDB(db);
  res.json(db.faq[index]);
});

app.delete('/api/admin/faq/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const index = (db.faq || []).findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.faq.splice(index, 1);
  saveDB(db);
  res.json({ success: true });
});

// ============ RMA Policy & Customer Service Settings ============

app.get('/api/settings/rma-policy', (req, res) => {
  const db = loadDB();
  res.json({ content: db.rma_policy || '' });
});

app.put('/api/admin/settings/rma-policy', requireAdmin, (req, res) => {
  const db = loadDB();
  db.rma_policy = req.body.content || '';
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/settings/customer-service-info', (req, res) => {
  const db = loadDB();
  res.json(db.customer_service_info || {});
});

app.put('/api/admin/settings/customer-service-info', requireAdmin, (req, res) => {
  const db = loadDB();
  db.customer_service_info = { ...db.customer_service_info, ...req.body };
  saveDB(db);
  res.json(db.customer_service_info);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
