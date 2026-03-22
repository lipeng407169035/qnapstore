# QNAP Store 中国商城

> QNAP 中国大陆官方网上商城，基于 Next.js 14 + Express.js 构建，支持简体中文与人民币定价。

## 功能特性

### 前端商城
- **商品展示**：分类筛选、搜索、排序、热销标签、比价功能
- **购物车**：满减活动、优惠券、支付宝/微信/银联/货到付款
- **用户中心**：账户管理、积分系统、收藏、浏览历史
- **新闻中心**：30+ 篇 QNAP 真实风格新闻，6 大分类
- **合作伙伴**：5 步在线申请，提交至后台审批
- **客户服务**：订单查询、退换货政策、质保申请、技术支持、下载中心、FAQ

### 后台管理
- **仪表板**：营收统计、订单状态、库存预警、30 天趋势图
- **商品管理**：CRUD、CSV 批量导入、规格/颜色/标签管理
- **新闻管理**：CRUD、热门标签、发布状态
- **合作伙伴申请**：申请列表、审核通过/拒绝
- **客户管理**：RFM 客户价值分析
- **营销工具**：满减活动、优惠券、轮播图、公告
- **客服系统**：质保申请处理、技术支持工单管理
- **内容管理**：下载中心、FAQ、退换货政策、客服信息

## 快速开始

### 环境要求
- Node.js 18+
- npm

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
- Next.js 前端：http://localhost:3000
- Express API：http://localhost:3001

### 构建生产版本
```bash
npm run build
```

### 初始化数据库
删除 `server/db.json` 后重启 Express，数据库会自动重新生成。

## 技术架构

| 技术 | 用途 |
|------|------|
| Next.js 14 (App Router) | 前端框架，SSR/SSG |
| Tailwind CSS | 样式 |
| Express.js | 后端 API |
| Recharts | 后台图表 |
| JSON File DB | 数据持久化 |

## 数据库结构

Express 提供以下 API 端点（3001 端口）：

| 资源 | 端点 |
|------|------|
| 商品 | `/api/products` |
| 订单 | `/api/orders` |
| 优惠券 | `/api/coupons` |
| 新闻 | `/api/news` |
| 合作申请 | `/api/partnership/apply` |
| 质保申请 | `/api/warranty/submit` |
| 技术支持 | `/api/support/submit` |
| 下载文件 | `/api/downloads` |
| FAQ | `/api/faq` |
| 退换货政策 | `/api/settings/rma-policy` |
| 客服信息 | `/api/settings/customer-service-info` |

## 后台登录

- 账号：`admin@qnap.com`
- 密码：`admin123`
- 地址：http://localhost:3000/admin/login

## 项目结构

```
qnap-store/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── api/                # API proxy 路由
│   │   ├── admin/              # 后台管理页面
│   │   └── ...                 # 前台商城页面
│   ├── components/             # React 组件
│   └── lib/                    # 工具函数
├── server/
│   ├── index.ts                # Express API 服务器
│   └── db.js                   # 数据库初始化与迁移
└── public/                     # 静态资源
```

## License

MIT
