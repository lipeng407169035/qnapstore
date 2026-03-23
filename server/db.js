const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const defaultData = {
  users: [],
  coupons: [
    { id: 1, code: 'SPRING2025', discountType: 'percentage', discountValue: 10, minOrderAmount: 299, maxDiscount: 50, startDate: '2025-03-01', endDate: '2026-12-31', usageLimit: 100, usedCount: 0, active: true },
    { id: 2, code: 'NAS500', discountType: 'fixed', discountValue: 50, minOrderAmount: 499, maxDiscount: null, startDate: '2025-03-01', endDate: '2026-12-31', usageLimit: 50, usedCount: 0, active: true },
  ],
  news: [
    { id: 1, title: 'QNAP 推出 QTS 5.2 操作系统，AI 能力全面升级', category: '产品发布', date: '2026-03-01', excerpt: 'QTS 5.2 带来全新 QuAI 智慧助理、本地 LLM 推理引擎及增强的数据安全功能，为 AI NAS 时代奠定坚实基础。', content: '<p>QNAP 今日正式发布 QTS 5.2 操作系统，这是自 QTS 5.0 以来的最大版本更新。新版本深度整合了 QuAI 智慧助理，支持本地部署大型语言模型，让用户在不依赖云端的情况下完成文档摘要、智能搜索、内容生成等任务。</p><p>QTS 5.2 还带来了全新的 QuFirewall 4 防火墙、升级的 HBS 5 混合备份同步以及 Qsync Pro 协作套件，大幅提升了 NAS 的安全性和协作效率。所有 QNAP NAS 用户均可通过系统更新免费升级。</p>', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', hot: true, active: true },
    { id: 2, title: 'QNAP AI NAS 新品 TS-AI642 发布，搭载 NVIDIA Jetson 边缘计算平台', category: '产品发布', date: '2026-02-20', excerpt: '专为边缘 AI 推理设计，支持本地部署 Llama 3、Qwen 等主流大语言模型，助力企业实现智能化转型。', content: '<p>TS-AI642 是 QNAP 面向企业用户推出的旗舰级 AI NAS，内置 NVIDIA Jetson Orin NX 边缘计算平台，提供高达 100 TOPS 的 AI 算力。产品支持 TensorRT 加速，可在本地高效运行各类 AI 模型。</p><p>TS-AI642 配备 8 盘位设计，支持 RAID 5/6 保护，确保 AI 数据安全。预装 QuTScloud 操作系统，兼容 QVR Pro 监控、QuDedup 源端去重等企业级应用。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: true, active: true },
    { id: 3, title: 'QNAP 荣获 2026 COMPUTEX Best Choice Award，展现存储创新实力', category: '企业动态', date: '2026-03-10', excerpt: 'QNAP 凭借 QuTScloud 混合云存储方案在 COMPUTEX 2026 展会中脱颖而出，斩获 Best Choice of Cloud Computing 大奖。', content: '<p>2026 COMPUTEX 台北国际电脑展期间，QNAP 参展的 QuTScloud 混合云存储解决方案获得评审团一致认可，荣获 Best Choice Award（云计算类别）。</p><p>评委会表示：QuTScloud 将本地 NAS 与主流公有云（阿里云、腾讯云、AWS）无缝集成，提供了业界领先的混合云数据管理体验，兼具灵活性与安全性。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 4, title: 'QNAP 中国合作伙伴大会 2026 在沪成功举办，签约金额突破 5 亿元', category: '合作伙伴', date: '2026-02-28', excerpt: '以「智存共赢·云启未来」为主题，汇聚全国 200 余家核心渠道伙伴，共同探讨 AI NAS 市场机遇。', content: '<p>QNAP 中国区 2026 合作伙伴大会于 2 月 28 日在上海国际会议中心圆满落幕。大会以「智存共赢·云启未来」为主题，吸引了来自全国 31 个省市的 200 余名核心渠道伙伴参会。</p><p>大会期间，QNAP 发布了 2026 年渠道激励计划，包括更高的返点比例、更完善的培训体系以及专属的 AI NAS 样机支持。现场签约金额突破 5 亿元人民币，再创历史新高。</p>', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', hot: false, active: true },
    { id: 5, title: 'HBS 5 新版本发布：跨云备份提速 300%，支持更多云端目标', category: '技术专栏', date: '2026-02-15', excerpt: 'HBS 5（Hybrid Backup Sync）5.3 版本大幅优化了云端传输效率，新增对腾讯云 COS、华为云 OBS 的原生支持。', content: '<p>QNAP HBS 5（混合备份同步）5.3 版本正式发布，带来了革命性的传输性能提升。通过全新的增量传输算法和并行上传技术，跨云备份速度较上一代提升 300%。</p><p>新版本还新增了对腾讯云对象存储（COS）和华为云对象存储（OBS）的原生支持，同时保留了阿里云 OSS、AWS S3、Azure Blob 等主流云服务的集成能力。HBS 5.3 还内置了 QuDedup 3.0 源端去重技术，可节省 50% 以上的存储空间和带宽。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 6, title: 'QNAP 春季促销：全线 NAS 95 折，晒单返 ¥200 元京东卡', category: '优惠活动', date: '2026-03-15', excerpt: '即日起至 4 月 30 日，购买 QNAP NAS 产品享受 95 折优惠，完成晒单评价额外返 200 元京东卡。', content: '<p>春暖花开，QNAP 春季促销活动正式启动！即日起至 2026 年 4 月 30 日，购买任意 QNAP NAS 产品均可享受 95 折优惠，叠加满千减百活动，实付更低。</p><p>活动期间完成晒单评价（不少于 50 字 + 3 张图片）的用户，额外返还 ¥200 元京东电子卡，多买多返，上不封顶。购买 TS-464 及以上机型的用户还可免费获赠 2 年延长质保。</p>', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', hot: true, active: true },
    { id: 7, title: '2026 年数据存储趋势：企业 NAS 需求同比增长 40%，AI NAS 成最大增量', category: '产业趋势', date: '2026-01-20', excerpt: 'IDC 最新报告显示，2025 年中国外部存储市场规模达 280 亿元，其中 AI NAS 细分市场增速超过 200%，成为行业最大亮点。', content: '<p>IDC 最新发布的《2025 年中国外部存储市场跟踪报告》显示，得益于企业数字化转型和生成式 AI 的快速发展，2025 年中国外部存储市场规模达到 280 亿元人民币，同比增长 15%。</p><p>报告特别指出，具备本地 AI 推理能力的 NAS 设备（AI NAS）细分市场增速超过 200%，其中 QNAP TS-AI 系列和 QuTScloud AI 解决方案表现尤为突出。分析师预测，AI NAS 将在 2026 年占据企业存储采购的 35% 份额。</p>', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', hot: false, active: true },
    { id: 8, title: 'QNAP QuTScloud 7.0 正式发布：支持 ZFS 3.0，存储效率提升 40%', category: '产品发布', date: '2026-01-15', excerpt: 'QuTScloud 7.0 是首个支持 ZFS 3.0 的企业级 NAS 云操作系统，带来增强的数据完整性校验和弹性扩展能力。', content: '<p>QNAP 今日发布 QuTScloud 7.0 云 NAS 操作系统，这是全球首个支持 ZFS 3.0 文件系统的商用 NAS 云平台。ZFS 3.0 带来了增强的 RAID-Z 扩展性、改进的块指针重删以及更快的数据校验算法。</p><p>QuTScloud 7.0 还新增了即时快照扩展（Instant Snapshot Expansion）、异步镜像复制和增强的 SSD 缓存优化功能，综合存储效率较 6.x 版本提升 40%。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 9, title: 'QNAP 与阿里云达成深度战略合作，共建混合云存储生态', category: '合作伙伴', date: '2026-01-08', excerpt: 'QNAP 与阿里云签署战略合作协议，双方将在产品集成、技术支持和市场推广等方面展开全面合作。', content: '<p>QNAP 与阿里云近日签署战略合作协议，宣布双方将在产品集成、技术支持、市场推广和云服务等方面展开深度合作。</p><p>根据协议，QNAP NAS 将全面支持阿里云混合云备份服务（HBR）和对象存储 OSS 的原生集成。QNAP HBS 5 将内置阿里云数据传输加速通道，大幅提升中国区用户的云端同步体验。双方还计划共同开发面向企业客户的「NAS+云」联合解决方案。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 10, title: 'QNAP QVR Pro 监控方案获评「2025 年度最佳安防解决方案」', category: '企业动态', date: '2025-12-20', excerpt: '在由中国安全防范产品行业协会主办的「安防奥斯卡」评选中，QNAP QVR Pro 凭借开放架构和 AI 智能分析能力荣获大奖。', content: '<p>在 2025 年中国国际社会公共安全产品博览会（安博会）期间举办的「安防奥斯卡」年度评选中，QNAP QVR Pro 视频监控管理解决方案凭借其开放的架构设计、灵活的 AI 智能分析能力以及与 NAS 存储的深度整合，荣获「2025 年度最佳安防解决方案」大奖。</p><p>QVR Pro 支持 ONVIF 协议下的 3000+ 款 IP 摄像机，内置 AI 人脸识别、行为分析和车牌识别等智能功能，单系统最多支持 128 路摄像机。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 11, title: 'QNAP 发布 QuFirewall 4 安全防火墙，勒索病毒防护能力提升 500%', category: '技术专栏', date: '2025-12-10', excerpt: 'QuFirewall 4 引入 AI 驱动的威胁检测引擎，可实时识别和阻断勒索病毒攻击路径，配合快照保护确保数据万无一失。', content: '<p>QNAP 发布 QuFirewall 4 网络防火墙，专为 NAS 环境设计的新一代安全防护方案。QuFirewall 4 集成了基于机器学习的威胁检测引擎，能够实时分析进出 NAS 的网络流量，自动识别异常行为和潜在攻击。</p><p>在 QNAP 实验室的测试中，QuFirewall 4 成功拦截了包括 WannaCry 变种、Ryuk 和 LockBit 在内的全部 2000+ 种勒索病毒样本，防护能力较上一代提升 500%。QuFirewall 4 还支持与 QNAP Snapshots 快照系统联动，一旦检测到异常写入行为，自动触发防护性快照。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 12, title: '双11特惠：QNAP NAS 最高直降 ¥800，爆款内存套装 7 折起', category: '优惠活动', date: '2025-11-01', excerpt: '2025 年双11购物狂欢节，QNAP 旗舰店全场 NAS 产品最高直降 ¥800，定金用户再享折上折。', content: '<p>2025 年双11预售正式开启！QNAP 官方旗舰店联合天猫平台推出年度最大力度优惠。</p><p>活动期间，TS-464 旗舰 NAS 直降 ¥800，到手价仅 ¥3,599；TS-233 入门款 NAS 降至 ¥999，创历史新低。QNAP 原厂内存套装（8GB+16GB DDR5）组合价仅 ¥999，相当于 7 折。</p><p>11 月 11 日当天 0-2 点下单的用户，前 500 名额外获赠 ¥100 京东卡。更多优惠请关注 QNAP 天猫旗舰店。</p>', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', hot: true, active: true },
    { id: 13, title: 'QNAP QuLog 集中日志分析系统正式上线，助力企业合规管理', category: '产品发布', date: '2025-10-20', excerpt: 'QuLog 是 QNAP 推出的企业级集中日志分析平台，支持 200+ 设备日志聚合、实时告警和合规报告生成。', content: '<p>QNAP 正式发布 QuLog 集中日志分析系统，这是 QNAP 企业应用套件中的重要成员。QuLog 支持从 QNAP NAS、防火墙、交换机、服务器等 200+ 种设备收集系统日志、安全日志和应用日志。</p><p>QuLog 内置的智能分析引擎可实时检测异常登录、权限变更、数据外泄等安全事件，并通过邮件或 webhook 发送告警。对于需要满足等保 2.0 或 GDPR 合规要求的企业，QuLog 可自动生成合规报告，大幅降低审计成本。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 14, title: 'QNAP Qsirch 5 全文检索：秒级搜索 NAS 中的 10 亿份文件', category: '技术专栏', date: '2025-10-05', excerpt: 'Qsirch 5 引入向量搜索技术，支持语义理解和图片内容搜索，让 NAS 文件检索从关键词时代迈入 AI 时代。', content: '<p>QNAP Qsirch 5 是业界领先的 NAS 全文搜索引擎，新版本带来了革命性的向量搜索能力。基于 QNAP 自研的 NAS-Qwen-7B 模型，Qsirch 5 可以理解用户的搜索意图，即使使用自然语言描述也能找到相关文件。</p><p>Qsirch 5 还新增了图片内容搜索功能。用户可以上传一张参考图片，Qsirch 会自动识别图片中的物体、场景和人物，并在 NAS 中找到相似内容的照片。此外，Qsirch 5 支持最多索引 10 亿份文件，搜索响应时间控制在 1 秒以内。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 15, title: 'QNAP Qsync Pro 2.0 发布：团队协作效率提升 200% 的秘密', category: '技术专栏', date: '2025-09-15', excerpt: 'Qsync Pro 2.0 支持多设备选择性同步、文件版本历史和实时协作编辑，成为远程团队的首选同步工具。', content: '<p>Qsync Pro 2.0 是 QNAP NAS 文件同步与共享解决方案的旗舰版本，专为团队协作场景设计。新版本支持多设备选择性同步，用户可以指定只同步特定文件夹，避免占用过多本地空间。</p><p>Qsync Pro 2.0 内置了文件版本历史功能，支持保留最多 64 个历史版本，用户可以随时回滚到任意时间点的文件状态。新增的实时协作编辑功能支持多人同时编辑 Office 文档，内置冲突解决机制确保数据一致性。QNAP 内部测试显示，使用 Qsync Pro 2.0 的团队协作效率平均提升 200%。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 16, title: 'VJBOD Cloud 2.0：把阿里云、腾讯云挂载为本地磁盘', category: '技术专栏', date: '2025-09-01', excerpt: 'VJBOD Cloud 2.0 支持将阿里云 OSS 和腾讯云 COS 直接挂载为 NAS 的虚拟存储池，实现冷热数据自动分层。', content: '<p>VJBOD Cloud 2.0 是 QNAP 面向混合云时代推出的存储网关解决方案。新版本大幅优化了大文件传输性能，通过断点续传和多线程加速技术，单文件 10GB 的云端读取时间从 15 分钟缩短至 90 秒。</p><p>VJBOD Cloud 2.0 支持将阿里云 OSS 和腾讯云 COS 作为 NAS 的虚拟存储池（vTank）直接挂载，用户可以在 QTS 文件管理器中像操作本地文件一样访问云端数据。结合 QNAP Qtier 自动分层技术，热数据保留在本地 SSD 池，冷数据自动归档到云端，实现存储成本最优化。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 17, title: 'QNAP QuCam 智能监控方案发布：AI 客流分析和安防一体化', category: '产品发布', date: '2025-08-20', excerpt: 'QuCam 将 QVR Pro 监控与客流分析整合在同一平台，帮助零售和连锁门店实现精准运营。', content: '<p>QNAP 推出 QuCam 智能监控解决方案，将视频监控与人流分析完美融合。QuCam 基于 QVR Pro 平台开发，继承了其强大的摄像机兼容性和稳定性，同时集成了 QNAP 自研的 AI 客流分析算法。</p><p>QuCam 可以统计门店进店人数、平均停留时间、热力图分布等关键运营指标，并通过可视化报表呈现。对于连锁零售、品牌门店和购物中心，QuCam 是提升运营效率和安防水平的一体化工具。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 18, title: 'QNAP 推出企业数据保护白皮书 2026：如何构建勒索病毒免疫的 NAS 系统', category: '企业动态', date: '2025-08-05', excerpt: '白皮书详细阐述了 QNAP 推荐的 3-2-1-1-0 数据保护策略，以及 QuFirewall、Snapshot、WORM 等多重防护机制。', content: '<p>QNAP 发布《企业数据保护白皮书 2026》，针对当前严峻的勒索病毒威胁，提出了完整的 NAS 数据保护解决方案。</p><p>白皮书推荐的「3-2-1-1-0」策略为：保留 3 份以上数据副本，使用 2 种不同存储介质，其中 1 份存储在异地，1 份使用不可篡改的 WORM 介质，确保 0 安全漏洞。QNAP NAS 通过 QuFirewall 边界防护、账户安全策略、Snapshot 快照保护、WORM 防篡改和 HBS 5 离线备份五道防线，构建勒索病毒免疫体系。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 19, title: 'QNAP Q\'center Pro 发布：一台管理 1000 台 NAS 的中央管理平台', category: '产品发布', date: '2025-07-20', excerpt: 'Q\'center Pro 是面向 MSP 和大型企业的集中监控与管理平台，支持批量固件升级、策略下发和统一报表。', content: '<p>QNAP 发布 Q\'center Pro 中央管理平台，这是面向 MSP（托管服务提供商）和大型企业设计的 NAS 集中管理解决方案。Q\'center Pro 单台服务器最多可管理 1000 台 QNAP NAS 设备。</p><p>Q\'center Pro 支持批量固件升级、告警规则统一配置、日志集中收集和跨设备报表生成。平台内置的自动化脚本引擎支持自定义运维任务，可大幅减少重复性工作。Q\'center Pro 还提供 OpenAPI 接口，方便与企业现有的 IT 运维系统（Zabbix、Prometheus 等）集成。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 20, title: 'QNAP 原厂内存全面升级 DDR5-5600，性能提升 70%', category: '产品发布', date: '2025-07-05', excerpt: 'QNAP 原厂 DDR5-5600 UDIMM 内存条正式上市，兼容 QNAP 全系列 NAS，性能较 DDR4 提升 70%，功耗降低 30%。', content: '<p>QNAP 原厂内存产品线全面升级至 DDR5-5600。新款内存条采用三星 A-die 颗粒，支持 ECC 纠错，兼容 QNAP TS-464、TS-673A、TVS-h874 等全系列 NAS 机型。</p><p>在 QNAP 实验室的 AIDA64 内存带宽测试中，DDR5-5600 的读取速度达到 85,000 MB/s，较 DDR4-2666 提升 70%，同时功耗降低 30%。这意味着用户可以在不增加功耗的情况下获得更强的多任务处理能力。QNAP 原厂内存均经过 72 小时高温老化测试，提供 3 年有限质保。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 21, title: 'QNAP 618 年中大促：爆款 NAS 低至 85 折，24 期免息分期', category: '优惠活动', date: '2025-06-01', excerpt: '618 期间购买 QNAP NAS 可享 85 折起优惠，支持支付宝/微信 24 期免息分期，最低日供仅 ¥3。', content: '<p>618 年中购物节来袭！QNAP 官方旗舰店精选多款 NAS 产品参与平台大促，优惠力度堪比双11。</p><p>活动期间，热销机型 TS-464 售价降至 ¥3,899，较原价直降 ¥500；企业级 TVS-h874 降幅达 ¥1,500，到手价 ¥12,883。全部机型支持支付宝和微信支付 24 期免息分期，TS-233 日供仅需 ¥3。</p><p>6 月 18 日当天 0 点起，前 300 名付款用户可叠加使用平台满减券，最高再减 ¥300。</p>', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', hot: false, active: true },
    { id: 22, title: 'QNAP 推出 Q\'mall 应用商城：100+ 款专业应用一键安装', category: '产品发布', date: '2025-05-15', excerpt: 'Q\'mall 是 QNAP 全新推出的应用商城，汇聚 100+ 款经过 QNAP 认证的第三方应用，覆盖备份、安全、开发、媒体等领域。', content: '<p>QNAP 正式上线 Q\'mall 应用商城，这是 QNAP NAS 生态系统的重大扩展。Q\'mall 汇聚了 100+ 款经过 QNAP 认证的第三方应用，涵盖数据备份、网络安全、开发工具、媒体处理等多个领域。</p><p>用户可以在 QTS 系统界面中直接浏览、安装和管理来自 Q\'mall 的应用，所有应用均经过 QNAP 安全审核和兼容性测试。Q\'mall 还提供应用评分、用户评论和安装量统计，帮助用户选择最合适的工具。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 23, title: 'QNAP myQNAPcloud 远程访问完全指南：0 配置实现全球互联', category: '技术专栏', date: '2025-05-01', excerpt: 'myQNAPcloud 是 QNAP 免费的远程访问服务，无需公网 IP 或端口映射，即可从全球任何地方安全访问 NAS。', content: '<p>myQNAPcloud 是 QNAP 为 NAS 用户提供的免费远程访问服务，基于 QNAP 自有的 Relay 服务器和 TLS 加密隧道技术。注册 myQNAPcloud 账号后，用户只需在 NAS 上开启 myQNAPcloud 服务，即可获得一个专属的远程访问链接。</p><p>无需路由器设置、无需端口映射、无需申请公网 IP。myQNAPcloud 支持 Web、桌面客户端（Qsync、Qfile Pro）和移动 App（Qfile）三种访问方式，数据全程加密传输。对于没有公网 IP 的家庭用户，myQNAPcloud 是访问 NAS 的最佳方案。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 24, title: 'QNAP Qfiling 智能归档 4.0：让 NAS 文件管理自动化', category: '技术专栏', date: '2025-04-15', excerpt: 'Qfiling 4.0 支持 AI 分类、智能标签和自动化工作流，可将文件整理效率提升 10 倍，是内容创作者和数据中心管理员的利器。', content: '<p>Qfiling 4.0 是 QNAP NAS 的文件归档自动化工具，新版本带来了 AI 驱动的智能分类功能。Qfiling 4.0 可以自动识别文件类型（照片、视频、文档、音频等）、拍摄时间、地理位置等元数据，并按照用户预设的规则自动归档。</p><p>Qfiling 4.0 还支持智能标签功能，可以根据文件内容自动添加关键词标签。结合 Qsirch 5 的全文检索能力，用户可以快速找到任何归档文件。Qfiling 4.0 的自动化工作流支持定时执行，比如每天凌晨 2 点自动整理下载文件夹。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 25, title: 'QNAP 成为「中国数据安全产业联盟」创始成员，共筑数据安全防线', category: '企业动态', date: '2025-04-01', excerpt: 'QNAP 应邀加入中国数据安全产业联盟，与华为、阿里云、奇安信等企业共同推动数据安全标准制定和产业协同。', content: '<p>中国数据安全产业联盟成立大会在北京召开，QNAP 作为创始成员应邀参会。联盟由工信部网络安全管理局指导，中国电子标准化研究院牵头，联合华为、阿里云、奇安信等 50 余家企业和机构共同发起。</p><p>QNAP 将参与联盟的数据存储安全标准制定，分享在 NAS 数据保护、勒索病毒防护和合规审计方面的技术积累和实践经验。QNAP 还将与联盟成员开展技术合作，共同研发面向中国市场的数据安全解决方案。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 26, title: 'QNAP 发布 PCIe 5.0 网卡系列：100GbE 高速网络新时代', category: '产品发布', date: '2025-03-25', excerpt: 'QNAP QXG-100G2SF 是一款 PCIe 5.0 x16 双口 100GbE 网卡，专为 AI 训练、科学计算和大规模虚拟化场景设计。', content: '<p>QNAP 发布 QXG-100G2SF 100GbE 网卡，这是 QNAP 首款基于 PCIe 5.0 的高速网络产品。QXG-100G2SF 配备双口 100GbE SFP28 接口，兼容 InfiniBand HDR 和 Ethernet 两种模式。</p><p>QXG-100G2SF 支持 SRP/ERoCE 和 iWARP 两种 RDMA 协议，可实现零 CPU 占用的超低延迟数据传输。对于需要多节点 GPU 集群训练 AI 模型或运行高性能计算（HPC）的用户，QXG-100G2SF 提供了极具性价比的组网方案。</p>', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', hot: false, active: true },
    { id: 27, title: 'QNAP QuArchive 归档存储方案：满足 15 年数据保留合规要求', category: '技术专栏', date: '2025-03-10', excerpt: 'QuArchive 是 QNAP 面向金融、医疗、法律等强合规行业推出的冷数据归档方案，支持 WORM 不可篡改和蓝光光盘库。', content: '<p>QuArchive 是 QNAP 专为满足行业合规数据保留要求而设计的归档存储方案。QuArchive 支持 WORM（一次写入多次读取）存储模式，写入后的数据在保留期内无法被删除或修改，满足 SEC 17a-4、HIPAA 等法规要求。</p><p>QuArchive 还支持与 QNAP 蓝光光盘库（Oden）集成，将冷数据归档到 M-Disc 蓝光光盘，理论保存寿命超过 1000 年。这对于需要超长数据保留周期的档案馆、图书馆和法院等单位尤为重要。</p>', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', hot: false, active: true },
    { id: 28, title: 'QNAP 全线产品通过等保 2.0 三级认证，为政企采购赋能', category: '企业动态', date: '2025-02-15', excerpt: 'QNAP NAS 产品线（含 QuTScloud）已全部通过国家信息安全等级保护 2.0 三级认证，可满足政府机关和关键信息基础设施单位的合规采购要求。', content: '<p>QNAP 宣布旗下 NAS 产品线（含 QuTScloud 云 NAS）已全部通过国家信息安全等级保护 2.0（等保 2.0）三级认证。认证由公安部信息安全等级保护评估中心完成，测试范围涵盖安全物理环境、安全通信网络、安全区域边界、安全计算环境、安全管理中心等十个领域。</p><p>等保 2.0 三级认证是政府机关、事业单位、国有企业以及金融、医疗、教育等关键信息基础设施单位采购 IT 设备的必备资质。QNAP 全线产品通过认证，意味着 QNAP NAS 可以直接进入上述单位的采购清单。</p>', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', hot: false, active: true },
    { id: 29, title: 'QNAP QuMagic 私有 AI 模型市场上线，Midjourney 平替来了', category: '产品发布', date: '2025-02-01', excerpt: 'QuMagic 是 QNAP 推出的私有 AI 模型应用市场，用户可以在 NAS 上部署 AI 生图、文生视频、语音合成等模型，完全私有化运行。', content: '<p>QuMagic 是 QNAP 在 QuAI 平台上推出的 AI 模型应用市场，汇集了 Stable Diffusion XL、文生视频模型 I2V-XL、语音合成模型 VALL-E X 等业界领先的 AI 模型。用户可以在 QNAP NAS 上直接部署这些模型，所有数据处理均在本地完成，不上传任何数据到云端。</p><p>QuMagic 提供了友好的 Web UI 和 OpenAI 兼容 API，开发者可以将 QuMagic 无缝集成到现有应用中。QuMagic 还支持 LoRA 微调，用户可以用自己的数据集定制专属 AI 模型。</p>', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', hot: false, active: true },
    { id: 30, title: 'QNAP 2025 新春感恩回馈：全线 9 折，会员积分翻倍', category: '优惠活动', date: '2025-01-20', excerpt: '新春佳节，感谢每一位 QNAP 用户。1 月 20 日至 2 月 10 日，全线产品 9 折，积分翻倍返还。', content: '<p>新春将至，QNAP 感谢每一位用户的支持与信任。1 月 20 日至 2 月 10 日期间，QNAP 官方商城全场产品 9 折促销，所有消费积分翻倍返还（1 元 = 2 积分）。</p><p>会员等级白银及以上用户额外享受 9.5 折专属优惠；钻石会员可享 9 折专属优惠叠加优先发货权益。积分可在下次购物时抵扣现金（100 积分 = ¥1），也可兑换 QNAP 原厂配件、延长质保和 QNAP 应用商城优惠券。</p>', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', hot: false, active: true },
  ],
  products: [
    // 分类1: 家用 NAS (categoryId: 1)
    { id: 'prod_1', sku: 'TS-233', name: 'TS-233 双槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 1219, originalPrice: 1372, description: 'Realtek RTD1619B 四核心处理器，2GB DDR4 内存，2 盘位设计，1GbE 网络接口，支持 Btrfs 文件系统和快照保护，QuTS hero 操作系统，适合家庭文件备份与多媒体存储', specs: { cpu: 'Realtek RTD1619B 四核心', ram: '2GB DDR4', bays: 2, network: '1GbE×1' }, badge: '特价', color: '#2a1a0d', rating: 4.5, reviews: 33, stock: 200 },
    { id: 'prod_2', sku: 'TS-264', name: 'TS-264 双槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 2199, originalPrice: null, description: 'Intel Celeron N5105 四核心 2.0GHz 处理器，4GB DDR4 内存（可扩充至 16GB），2 盘位设计，双 2.5GbE 网络接口，4K 硬件解码，HDMI 2.0 输出，QuTS hero/ZFS 支持，适合家庭多媒体中心与个人备份', specs: { cpu: 'Intel Celeron N5105 四核心 2.0GHz', ram: '4GB DDR4', bays: 2, network: '2.5GbE×2' }, badge: '新品', color: '#0d2a4a', rating: 4.7, reviews: 42, stock: 100 },
    { id: 'prod_3', sku: 'TS-364', name: 'TS-364 三槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 3299, originalPrice: null, description: 'Intel Celeron N5105 四核心处理器，8GB DDR4 内存，3 盘位设计，双 2.5GbE 网口，M.2 NVMe SSD 缓存加速插槽，HDMI 2.0 输出，QuTS hero ZFS 文件系统，适合家庭多媒体创作与备份', specs: { cpu: 'Intel Celeron N5105 四核心 2.0GHz', ram: '8GB DDR4', bays: 3, network: '2.5GbE×2' }, badge: null, color: '#1a2a3a', rating: 4.6, reviews: 19, stock: 30 },
    { id: 'prod_4', sku: 'TS-464', name: 'TS-464 四槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 4399, originalPrice: null, description: 'Intel Celeron N5095 四核心 2.0GHz 处理器，8GB DDR4 内存（可扩充至 32GB），4 盘位设计，双 2.5GbE 网口，PCIe Gen3 插槽可扩充 10GbE 或 QM2 缓存卡，HDMI 4K 输出，QuTS hero ZFS，支持 WORM 防篡改，家用旗舰之选', specs: { cpu: 'Intel Celeron N5095 四核心 2.0GHz', ram: '8GB DDR4', bays: 4, network: '2.5GbE×2' }, badge: '热销', color: '#0d1a3d', rating: 4.8, reviews: 87, stock: 50 },
    { id: 'prod_5', sku: 'TS-464C2', name: 'TS-464C2 四槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 4899, originalPrice: null, description: 'Intel Celeron N5095 四核心 2.0GHz 处理器，8GB DDR4 内存，4 盘位热拔插设计，双 2.5GbE 网口，PCIe Gen3 插槽，HDMI 4K 输出，双 M.2 NVMe SSD 插槽，QuTS hero 操作系统，旗舰级家用 NAS，满足多媒体创作与高速存储需求', specs: { cpu: 'Intel Celeron N5095 四核心 2.0GHz', ram: '8GB DDR4', bays: 4, network: '2.5GbE×2' }, badge: '旗舰', color: '#0d2a5a', rating: 4.9, reviews: 15, stock: 20 },
    { id: 'prod_6', sku: 'TS-433', name: 'TS-433 四槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 2680, originalPrice: null, description: 'Realtek RTD1619D 四核心处理器，4GB DDR4 内存，4 盘位设计，1GbE 网络接口，无风扇静音设计，低功耗运行，QuTS hero ZFS 文件系统，支持快照与克隆，适合家庭静音存储备份', specs: { cpu: 'Realtek RTD1619D 四核心', ram: '4GB DDR4', bays: 4, network: '1GbE×1' }, badge: null, color: '#1a3a2a', rating: 4.6, reviews: 11, stock: 40 },
    { id: 'prod_7', sku: 'TS-216G', name: 'TS-216G 双槽 NAS', series: 'Turbo NAS', categoryId: 1, categorySlug: 'home-nas', categoryName: '家用 NAS', price: 1899, originalPrice: null, description: 'Realtek RTD1619B 四核心处理器，2GB DDR4 内存，2 盘位设计，2.5GbE+1GbE 双网口，内置 GPU 加速 4K 硬件转码，HDMI 2.0 输出，QuTS hero 支持，适合家庭多媒体娱乐与备份', specs: { cpu: 'Realtek RTD1619B 四核心 + GPU', ram: '2GB DDR4', bays: 2, network: '2.5GbE×1+1GbE×1' }, badge: '新品', color: '#2a3a1a', rating: 4.7, reviews: 8, stock: 35 },

    // 分类2: 企业 NAS (categoryId: 2)
    { id: 'prod_8', sku: 'TS-673A', name: 'TS-673A 六槽 NAS', series: 'Turbo NAS', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 6309, originalPrice: 7083, description: 'AMD Ryzen V1500B 四核心 2.2GHz 处理器，8GB DDR4 ECC 内存（可扩充至 64GB），6 盘位设计，双 2.5GbE 网口，PCIe Gen3×16 插槽可扩 10/25GbE，QuTS hero ZFS，支持 VMware/Citrix/Hyper-V 虚拟化认证，商用存储首选', specs: { cpu: 'AMD Ryzen V1500B 四核心 2.2GHz', ram: '8GB DDR4 ECC', bays: 6, network: '2.5GbE×2' }, badge: '特价', color: '#1a0d2a', rating: 4.7, reviews: 41, stock: 20 },
    { id: 'prod_9', sku: 'TS-873A', name: 'TS-873A 八槽 NAS', series: 'Turbo NAS', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 9299, originalPrice: null, description: 'AMD Ryzen V1500B 四核心 2.2GHz 处理器，8GB DDR4 ECC 内存（可扩充至 64GB），8 盘位设计，双 2.5GbE 网口，PCIe Gen3×16 插槽扩 10/25GbE，QuTS hero ZFS，支持 M.2 NVMe SSD 缓存加速，适合 SMB 团队文件协作与备份', specs: { cpu: 'AMD Ryzen V1500B 四核心 2.2GHz', ram: '8GB DDR4 ECC', bays: 8, network: '2.5GbE×2' }, badge: null, color: '#0d1a2a', rating: 4.9, reviews: 28, stock: 15 },
    { id: 'prod_10', sku: 'TVS-h874', name: 'TVS-h874 八槽 NAS', series: 'TVS-h Series', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 14383, originalPrice: null, description: '第 12 代 Intel Core i5-12400 六核心处理器，32GB DDR4 内存，8 盘位热拔插，QuTS hero ZFS 文件系统，M.2 NVMe SSD 缓存/Edge TPU 插槽，PCIe Gen4 扩 10/25GbE，Intel OpenVINO AI 加速，Full HD HDMI 输出，商用旗舰级 ZFS NAS', specs: { cpu: 'Intel Core i5-12400 六核心', ram: '32GB DDR4', bays: 8, network: '2.5GbE×2' }, badge: '旗舰', color: '#0d2a1a', rating: 5.0, reviews: 14, stock: 8 },
    { id: 'prod_11', sku: 'TBS-h574TX', name: 'TBS-h574TX 五槽 NAS', series: 'TBS-h Series', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 11200, originalPrice: null, description: 'Intel Core i3-12100 四核心处理器，16GB DDR4 内存，5 槽 E1.S/M.2 NVMe SSD 全快闪设计，双 Thunderbolt 4 接口，1×10GbE SFP+，2×USB 3.2 Gen2，QuTS hero ZFS，适合影视后期制作与高速全闪存存储', specs: { cpu: 'Intel Core i3-12100 四核心', ram: '16GB DDR4', bays: '5×NVMe', network: 'Thunderbolt×2+10GbE SFP+×1' }, badge: null, color: '#1a0d3a', rating: 4.8, reviews: 6, stock: 5 },
    { id: 'prod_12', sku: 'TS-855eU', name: 'TS-855eU 机架式', series: 'NAS 机架系列', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 8800, originalPrice: null, description: 'Intel Atom C5125 八核心 2.8GHz 处理器（支持 QuickAssist），8GB DDR4 内存（可扩充至 64GB），8 盘位 2U 短机箱设计（深度仅 297mm），双 2.5GbE 网口，PCIe Gen3 双插槽，M.2 NVMe SSD 插槽，QTS/QuTS hero 双系统，虚拟化应用专用', specs: { cpu: 'Intel Atom C5125 八核心 2.8GHz', ram: '8GB DDR4', bays: 8, network: '2.5GbE×2' }, badge: null, color: '#0a1a2a', rating: 4.7, reviews: 9, stock: 10 },
    { id: 'prod_13', sku: 'TS-855X', name: 'TS-855X 机架式', series: 'NAS 机架系列', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 7680, originalPrice: null, description: 'Intel Atom C5106 六核心处理器，4GB DDR4 内存（可扩充至 64GB），8 盘位设计，双 10GbE SFP+ 网口，QuTS hero 内置，PCIe Gen3 扩展，虚拟机与 Docker 容器支持，适合中小企业虚拟化与文件存储', specs: { cpu: 'Intel Atom C5106 六核心', ram: '4GB DDR4', bays: 8, network: '10GbE SFP+×2' }, badge: null, color: '#0a2a2a', rating: 4.6, reviews: 7, stock: 8 },
    { id: 'prod_14', sku: 'TS-855eU-RP', name: 'TS-855eU-RP 机架式', series: 'NAS 机架系列', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 10280, originalPrice: null, description: 'Intel Atom C5125 八核心 2.8GHz 处理器，16GB DDR4 ECC 内存，8 盘位 2U 短机箱，2U 冗余电源设计，双 2.5GbE 网口，PCIe Gen3 双插槽，M.2 NVMe SSD，Veeam Ready 认证，QuTS hero，适合关键业务存储与虚拟化环境', specs: { cpu: 'Intel Atom C5125 八核心 2.8GHz', ram: '16GB DDR4 ECC', bays: 8, network: '2.5GbE×2' }, badge: null, color: '#0a1a1a', rating: 4.8, reviews: 4, stock: 5 },
    { id: 'prod_15', sku: 'TS-1264U-RP', name: 'TS-1264U-RP 机架式', series: 'NAS 机架系列', categoryId: 2, categorySlug: 'business-nas', categoryName: '企业 NAS', price: 13600, originalPrice: null, description: 'Intel Atom C5106 六核心处理器，8GB DDR4 ECC 内存，12 盘位 2U 设计，双 2.5GbE 网口，PCIe Gen3 扩展，QuTS hero ZFS，支持 SSD 缓存加速，适合中型企业的海量文件存储与备份', specs: { cpu: 'Intel Atom C5106 六核心', ram: '8GB DDR4 ECC', bays: 12, network: '2.5GbE×2' }, badge: null, color: '#0d0a2a', rating: 4.7, reviews: 5, stock: 6 },

    // 分类3: 机架式 NAS (categoryId: 3)
    { id: 'prod_16', sku: 'TS-832PX', name: 'TS-832PX 机架式', series: 'NAS 机架系列', categoryId: 3, categorySlug: 'rackmount-nas', categoryName: '机架式 NAS', price: 8518, originalPrice: null, description: 'Annapurna Labs AL-324 四核心 1.7GHz 处理器，4GB DDR4 内存，8 盘位 1U 设计，双 10GbE SFP+ + 四口 2.5GbE，PCIe Gen2 扩展，QuTS hero ZFS，适合需要高速网络的企业分支机构和工作室', specs: { cpu: 'Annapurna Labs AL-324 四核心 1.7GHz', ram: '4GB DDR4', bays: 8, network: '10GbE SFP+×2+2.5GbE×4' }, badge: null, color: '#1a1a0d', rating: 4.6, reviews: 11, stock: 10 },
    { id: 'prod_17', sku: 'TS-1683XU-RP', name: 'TS-1683XU-RP 机架式', series: 'NAS 机架系列', categoryId: 3, categorySlug: 'rackmount-nas', categoryName: '机架式 NAS', price: 21683, originalPrice: null, description: 'Intel Xeon D-1521 四核心 2.4GHz 处理器，8GB DDR4 ECC 内存（可扩充至 128GB），16 盘位 3U 设计，双 10GbE SFP+，双 550W 冗余电源，PCIe Gen3 扩展，QuTS hero ZFS，企业级机架存储，支持 VMware/Citrix/Hyper-V', specs: { cpu: 'Intel Xeon D-1521 四核心 2.4GHz', ram: '8GB DDR4 ECC', bays: 16, network: '10GbE SFP+×2' }, badge: null, color: '#0d0d1a', rating: 4.8, reviews: 7, stock: 5 },
    { id: 'prod_18', sku: 'TS-h2490FU', name: 'TS-h2490FU 24槽 NAS', series: 'TS-h Series', categoryId: 3, categorySlug: 'rackmount-nas', categoryName: '机架式 NAS', price: 89800, originalPrice: null, description: 'Intel Xeon D-1557N 八核心处理器，32GB DDR4 ECC 内存，24 槽全快闪设计（2.5" U.2 NVMe SSD），双 25GbE SFP28，QuTS hero ZFS，2U 机架式，SSD QDID 优化，适合 AI 训练、高速视频编辑和企业关键业务存储', specs: { cpu: 'Intel Xeon D-1557N 八核心', ram: '32GB DDR4 ECC', bays: '24×NVMe', network: '25GbE SFP28×2' }, badge: '旗舰', color: '#0d0a1a', rating: 5.0, reviews: 2, stock: 2 },
    { id: 'prod_19', sku: 'TS-h3087XU-RP', name: 'TS-h3087XU-RP 机架式', series: 'TS-h Series', categoryId: 3, categorySlug: 'rackmount-nas', categoryName: '机架式 NAS', price: 45600, originalPrice: null, description: 'AMD EPYC 7302P 十六核心处理器，32GB DDR4 ECC 内存（可扩充至 1TB），30 盘位 4U 设计，双 25GbE SFP28，双 1200W 冗余电源，PCIe Gen4 扩展，QuTS hero ZFS，超大规模企业级存储解决方案', specs: { cpu: 'AMD EPYC 7302P 十六核心', ram: '32GB DDR4 ECC', bays: 30, network: '25GbE SFP28×2' }, badge: null, color: '#0d050a', rating: 4.9, reviews: 3, stock: 2 },

    // 分类4: 网络交换机 (categoryId: 4)
    { id: 'prod_20', sku: 'QSW-1105-5T', name: 'QSW-1105-5T 5口 2.5GbE', series: 'QSW 非管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 662, originalPrice: null, description: '5 口全 2.5GbE 非网管交换机，无风扇静音设计，即插即用无需配置，支持 IEEE 802.3bz 2.5G Base-T 标准，适合升级家庭和小型办公室网络至 2.5GbE 高速骨干', specs: { ports: 5, speed: '2.5GbE', fan: '无风扇', managed: '否' }, badge: '热销', color: '#0d1a0d', rating: 4.8, reviews: 103, stock: 500 },
    { id: 'prod_21', sku: 'QSW-M2116P', name: 'QSW-M2116P PoE 交换机', series: 'QSW-M 管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 4093, originalPrice: null, description: '16 口 2.5GbE PoE+（每口最高 60W），4 口 10GbE SFP+ 上联，370W 总 PoE 功率，L2 网管型，支持 VLAN、QoS、LAG，IEEE 802.3bt PoE++，适合中小企业的 PoE IP 摄像机和 AP 部署', specs: { poe_ports: 16, uplink: '10GbE SFP+×4', total_power: '370W PoE+', managed: '是' }, badge: null, color: '#0d1a1a', rating: 4.6, reviews: 18, stock: 30 },
    { id: 'prod_22', sku: 'QSW-M408S', name: 'QSW-M408S 网管交换机', series: 'QSW-M 管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 3142, originalPrice: null, description: '8 口 10GbE SFP+，4 口 1GbE RJ45，L2 网管型交换机，支持 VLAN、QoS、STP、LAG、SNMP、CLI/Web 管理，适合连接高速服务器和 10GbE 工作站，构建高速办公网络', specs: { ports_sfp: 8, ports_rj45: 4, speed_sfp: '10GbE SFP+', managed: '是' }, badge: null, color: '#1a0d0d', rating: 4.7, reviews: 24, stock: 50 },
    { id: 'prod_23', sku: 'QSW-2108-8S2T', name: 'QSW-2108-8S2T 交换机', series: 'QSW 非管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 2380, originalPrice: null, description: '8 口 10GbE SFP+，8 口 2.5GbE RJ45，非网管型，即插即用，支持 10GbE 上联和 2.5GbE 桌面设备接入，适合创意工作室和小型企业的混合高速网络环境', specs: { ports: 16, speed: '10GbE SFP+×8+2.5GbE×8', fan: '智能风扇', managed: '否' }, badge: null, color: '#1a1a0a', rating: 4.5, reviews: 12, stock: 40 },
    { id: 'prod_24', sku: 'QSW-3226-8T2S', name: 'QSW-3226-8T2S 交换机', series: 'QSW 管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 3980, originalPrice: null, description: '8 口 2.5GbE + 2 口 10GbE SFP+ + 2 口 10GbE RJ45，L3 Lite 网管型，支持静态路由、ACL、VLAN、QoS、RSTP，19" 1U 机架式，适合中小企业作为高速汇聚交换机', specs: { ports: 12, speed: '2.5GbE×8+10GbE×4', fan: '智能风扇', managed: '是' }, badge: null, color: '#0a1a0a', rating: 4.6, reviews: 9, stock: 25 },
    { id: 'prod_25', sku: 'QSW-M4524-8T2S', name: 'QSW-M4524-8T2S 交换机', series: 'QSW-M 管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 5200, originalPrice: null, description: '24 口 2.5GbE + 8 口 10GbE SFP+，L2 网管型，支持 VLAN、QoS、LACP、SNMP，19" 1U 机架式，370W PoE+ 可选型号，适合企业楼层交换机和高速接入', specs: { ports: 32, speed: '2.5GbE×24+10GbE SFP+×8', fan: '智能风扇', managed: '是' }, badge: null, color: '#0a0a1a', rating: 4.7, reviews: 7, stock: 15 },
    { id: 'prod_26', sku: 'QSW-M3216R-8S8T', name: 'QSW-M3216R-8S8T 交换机', series: 'QSW-M 管理型', categoryId: 4, categorySlug: 'switch', categoryName: '网络交换机', price: 6800, originalPrice: null, description: '16 口 10GbE SFP+ + 8 口 10GbE RJ45，L3 路由型交换机，支持 OSPF/RIP 动态路由、VLAN、ACL、QoS、MLAG，冗余电源设计，19" 1U 机架式，适合数据中心高速汇聚和核心交换', specs: { ports: 24, speed: '10GbE×24', fan: '冗余风扇', managed: '是' }, badge: null, color: '#0a1a1a', rating: 4.8, reviews: 5, stock: 10 },

    // 分类5: 扩展设备 (categoryId: 5)
    { id: 'prod_27', sku: 'UX-1200U-RP', name: 'UX-1200U-RP 12槽扩展', series: '扩展设备', categoryId: 5, categorySlug: 'expansion', categoryName: '扩展设备', price: 10620, originalPrice: null, description: '12 槽 3.5" SAS/SATA 硬盘扩展设备，2U 机架式设计，双 450W 冗余电源，通过 SFF-8644 miniSAS HD 连接线连接 QNAP NAS，最大可扩 192TB 存储空间，适合大容量存储扩容', specs: { bays: 12, interface: 'SAS/SATA III', form: '2U 机架式' }, badge: null, color: '#1a1a2a', rating: 4.7, reviews: 5, stock: 10 },
    { id: 'prod_28', sku: 'TL-D1600S', name: 'TL-D1600S 16槽扩展', series: '扩展设备', categoryId: 5, categorySlug: 'expansion', categoryName: '扩展设备', price: 4800, originalPrice: null, description: '16 槽 3.5" SATA 硬盘扩展设备，1U 桌面/机架两用设计，SFF-8088 miniSAS 连接 QNAP NAS，支持 RAID 0/1/5/6/JBOD，最多扩 256TB，适合备份归档和海量存储扩展', specs: { bays: 16, interface: 'SATA III', form: '1U 桌面/机架两用' }, badge: null, color: '#1a2a2a', rating: 4.6, reviews: 4, stock: 15 },
    { id: 'prod_29', sku: 'TL-D800S', name: 'TL-D800S 8槽扩展', series: '扩展设备', categoryId: 5, categorySlug: 'expansion', categoryName: '扩展设备', price: 2200, originalPrice: null, description: '8 槽 3.5" SATA 硬盘扩展设备，桌面型设计，SFF-8088 miniSAS 连接 QNAP NAS，支持 RAID 0/1/5/6/JBOD，适用 TS-873A/TS-673A 等 8 槽及以上 NAS 扩容', specs: { bays: 8, interface: 'SATA III', form: '桌面型' }, badge: null, color: '#2a1a2a', rating: 4.5, reviews: 8, stock: 30 },
    { id: 'prod_30', sku: 'TL-D400S', name: 'TL-D400S 4槽扩展', series: '扩展设备', categoryId: 5, categorySlug: 'expansion', categoryName: '扩展设备', price: 1100, originalPrice: null, description: '4 槽 3.5"/2.5" SATA 硬盘扩展设备，USB 3.2 Gen1 连接，即插即用，支持 RAID 0/1/JBOD，小巧桌面设计，适合 TS-264/TS-464 等家用 NAS 扩容', specs: { bays: 4, interface: 'USB 3.2 Gen1', form: '桌面型' }, badge: null, color: '#2a2a1a', rating: 4.5, reviews: 12, stock: 50 },
    { id: 'prod_31', sku: 'TR-004', name: 'TR-004 四槽硬盘座', series: '扩展设备', categoryId: 5, categorySlug: 'expansion', categoryName: '扩展设备', price: 580, originalPrice: null, description: '4 槽 3.5"/2.5" SATA 硬盘座（支持硬盘镜像 RAID 1），USB 3.2 Gen2 Type-C 连接，即插即用，支持 UASP，RAID 0/1/JBOD/单盘多种模式，适合多硬盘备份和快速拷贝', specs: { bays: 4, interface: 'USB 3.2 Gen2 Type-C', form: '桌面型' }, badge: null, color: '#2a1a1a', rating: 4.7, reviews: 21, stock: 80 },

    // 分类6: 网络配件 (categoryId: 6)
    { id: 'prod_32', sku: 'QXG-10G1T', name: 'QXG-10G1T 10GbE 网卡', series: 'QXG 网络扩展', categoryId: 6, categorySlug: 'network-card', categoryName: '网络配件', price: 708, originalPrice: null, description: 'PCIe Gen3×4 接口，10GBASE-T RJ45 网卡，兼容 Cat 6a/7 网线，最高 10Gbps 速率，支持大部分 QNAP NAS 和 PC 服务器，即插即用，适合升级至 10GbE 高速网络', specs: { interface: 'PCIe Gen3×4', speed: '10GbE', connector: 'RJ45 (10GBASE-T)' }, badge: null, color: '#2a1a1a', rating: 4.6, reviews: 56, stock: 200 },
    { id: 'prod_33', sku: 'QXG-25G2SF', name: 'QXG-25G2SF 双口 25GbE', series: 'QXG 网络扩展', categoryId: 6, categorySlug: 'network-card', categoryName: '网络配件', price: 2832, originalPrice: null, description: 'PCIe Gen4×8 接口，双口 25GbE SFP28 网卡，兼容 SFP28/DAC/AOC 线缆，支持 SR/LR/ER 光模块和 InfiniBand HDR，适合企业高速计算和 AI 存储网络', specs: { interface: 'PCIe Gen4×8', speed: '25GbE', ports: 2, connector: 'SFP28' }, badge: '新品', color: '#1a2a1a', rating: 4.8, reviews: 12, stock: 50 },
    { id: 'prod_34', sku: 'QNA-UC5G1T', name: 'QNA-UC5G1T 5GbE 网卡', series: 'QNA 网络扩展', categoryId: 6, categorySlug: 'network-card', categoryName: '网络配件', price: 680, originalPrice: null, description: 'USB 3.2 Gen1 Type-A 接口，5GBASE-T RJ45 网卡，即插即用无需驱动，支持 macOS/Windows/Linux，无需安装驱动，适合给 Mac/PC 或不支持 PCIe 的设备升级至 5GbE', specs: { interface: 'USB 3.2 Gen1 Type-A', speed: '5GbE', connector: 'RJ45 (5GBASE-T)' }, badge: null, color: '#1a3a1a', rating: 4.6, reviews: 31, stock: 150 },

    // 分类7: 软件授权 (categoryId: 7)
    { id: 'prod_35', sku: 'LIC-NVR-4CH', name: 'QVR Pro 4频道授权', series: 'QVR Pro', categoryId: 7, categorySlug: 'software', categoryName: '软件授权', price: 708, originalPrice: null, description: 'QVR Pro IP 视频监控软件授权，永久授权，支持 4 频道 IP 摄像机，兼容 ONVIF 协议，支持 AI 人脸识别、区域入侵、人数统计等智能分析，内置电子地图和移动 App', specs: { channels: 4, type: '永久授权', os: 'QTS/QuTS hero' }, badge: null, color: '#2a2a0d', rating: 4.5, reviews: 29, stock: 999 },
    { id: 'prod_36', sku: 'LIC-VJBOD-1Y', name: 'VJBOD Cloud 年费授权', series: 'VJBOD Cloud', categoryId: 7, categorySlug: 'software', categoryName: '软件授权', price: 398, originalPrice: null, description: 'VJBOD Cloud 云存储网关授权（1年订阅），支持将阿里云 OSS、腾讯云 COS、AWS S3 等云存储挂载为 NAS 本地虚拟存储池，支持 Qtier 自动冷热分层，本地缓存加速，节省云存储成本', specs: { type: '年费订阅', period: '1年', cloud: '阿里云/腾讯云/AWS' }, badge: null, color: '#2a0d2a', rating: 4.4, reviews: 17, stock: 999 },
    { id: 'prod_37', sku: 'LIC-QVRPro-8CH', name: 'QVR Pro 8频道授权', series: 'QVR Pro', categoryId: 7, categorySlug: 'software', categoryName: '软件授权', price: 1280, originalPrice: null, description: 'QVR Pro IP 视频监控软件授权，永久授权，支持 8 频道 IP 摄像机，AI 智能分析（人脸识别、车牌识别、行为分析），QVR Face 实时人脸识别，多重录像备份，兼容 3000+ 款 ONVIF 摄像机', specs: { channels: 8, type: '永久授权', os: 'QTS/QuTS hero' }, badge: null, color: '#3a2a0d', rating: 4.6, reviews: 11, stock: 999 },

    // 分类8: 延长质保 (categoryId: 8)
    { id: 'prod_38', sku: 'QEWS-2Y', name: '二年延长质保服务', series: 'QEWS 延长质保', categoryId: 8, categorySlug: 'warranty', categoryName: '延长质保', price: 775, originalPrice: null, description: 'QNAP 原厂延长质保 2 年服务，适用于 QNAP NAS 整机，在原厂质保基础上延长 2 年维修服务，涵盖硬件故障处理，全国联保，拨打 400-888-3600 申请激活', specs: { period: '2年', type: '整机质保', coverage: '全国联保' }, badge: null, color: '#0d2a2a', rating: 4.9, reviews: 63, stock: 999 },
    { id: 'prod_39', sku: 'QEWS-3Y', name: '三年延长质保服务', series: 'QEWS 延长质保', categoryId: 8, categorySlug: 'warranty', categoryName: '延长质保', price: 1080, originalPrice: null, description: 'QNAP 原厂延长质保 3 年服务，适用于 QNAP NAS 整机，在原厂质保基础上延长 3 年维修服务，涵盖硬件故障处理，含快速换机服务，全国联保，购买后拨打 400-888-3600 激活', specs: { period: '3年', type: '整机质保', coverage: '全国联保+快速换机' }, badge: null, color: '#0a3a3a', rating: 4.9, reviews: 28, stock: 999 },
    { id: 'prod_40', sku: 'QEWS-5Y', name: '五年延长质保服务', series: 'QEWS 延长质保', categoryId: 8, categorySlug: 'warranty', categoryName: '延长质保', price: 1980, originalPrice: null, description: 'QNAP 原厂延长质保 5 年服务，适用于 QNAP NAS 整机，在原厂质保基础上延长 5 年，含优先快速换机和专属技术支持服务，全国联保，是企业级用户数据保障的最佳选择', specs: { period: '5年', type: '整机质保', coverage: '全国联保+优先换机+专属技术支持' }, badge: null, color: '#0a2a3a', rating: 5.0, reviews: 12, stock: 999 },

    // 分类9: 内存 (categoryId: 9)
    { id: 'prod_41', sku: 'RAM-8GDDR4', name: '8GB DDR4 ECC UDIMM', series: '原厂内存', categoryId: 9, categorySlug: 'memory', categoryName: '内存', price: 418, originalPrice: 487, description: 'QNAP 原厂认证 8GB DDR4-2666 ECC UDIMM 内存条，兼容 QNAP TS/TVS 系列 NAS，采用三星 A-die 颗粒，支持 ECC 纠错，72 小时高温老化测试，提供 3 年有限质保', specs: { capacity: '8GB', type: 'DDR4 ECC UDIMM', speed: '2666MHz' }, badge: '特价', color: '#1a1a3a', rating: 4.7, reviews: 38, stock: 300 },
    { id: 'prod_42', sku: 'RAM-16GDDR5', name: '16GB DDR5 UDIMM', series: '原厂内存', categoryId: 9, categorySlug: 'memory', categoryName: '内存', price: 772, originalPrice: null, description: 'QNAP 原厂认证 16GB DDR5-4800 UDIMM 内存条，兼容 QNAP 支持 DDR5 的 NAS 机型（如 TVS-h874/TS-464C2），采用三星 A-die 颗粒，性能较 DDR4 提升 70%，3 年质保', specs: { capacity: '16GB', type: 'DDR5 UDIMM', speed: '4800MHz' }, badge: '新品', color: '#1a2a3a', rating: 4.8, reviews: 21, stock: 150 },
    { id: 'prod_43', sku: 'RAM-32GDDR4', name: '32GB DDR4 ECC UDIMM', series: '原厂内存', categoryId: 9, categorySlug: 'memory', categoryName: '内存', price: 820, originalPrice: null, description: 'QNAP 原厂认证 32GB DDR4-2666 ECC UDIMM 内存条，兼容 QNAP TS/TVS 系列 NAS（部分机型需查兼容性），三星 A-die 颗粒，ECC 纠错，72 小时老化测试，3 年质保，适合虚拟化和 Docker 多容器应用', specs: { capacity: '32GB', type: 'DDR4 ECC UDIMM', speed: '2666MHz' }, badge: null, color: '#2a1a3a', rating: 4.7, reviews: 14, stock: 100 },
    { id: 'prod_44', sku: 'RAM-32GDDR5', name: '32GB DDR5 UDIMM', series: '原厂内存', categoryId: 9, categorySlug: 'memory', categoryName: '内存', price: 1380, originalPrice: null, description: 'QNAP 原厂认证 32GB DDR5-5600 UDIMM 内存条，兼容 QNAP DDR5 NAS（TVS-h874/TS-464C2 等），采用三星 A-die 颗粒，性能较 DDR4 提升 70%，功耗降低 30%，3 年质保，是旗舰 NAS 的性能升级首选', specs: { capacity: '32GB', type: 'DDR5 UDIMM', speed: '5600MHz' }, badge: null, color: '#1a3a3a', rating: 4.9, reviews: 7, stock: 80 },
  ],
  categories: [
    { id: 1, slug: 'home-nas', name: '家用 NAS', icon: '🗄️', desc: '2-4盘位家庭个人备份存储', sort: 1, active: true },
    { id: 2, slug: 'business-nas', name: '企业 NAS', icon: '🏢', desc: '高性能企业级存储方案', sort: 2, active: true },
    { id: 3, slug: 'rackmount-nas', name: '机架式 NAS', icon: '🖥️', desc: '1U/2U/4U 机架安装', sort: 3, active: true },
    { id: 4, slug: 'switch', name: '网络交换机', icon: '🌐', desc: '2.5G/10G 高速交换机', sort: 4, active: true },
    { id: 5, slug: 'expansion', name: '扩展设备', icon: '💾', desc: 'JBOD 扩展存储设备', sort: 5, active: true },
    { id: 6, slug: 'network-card', name: '网络配件', icon: '📡', desc: '网卡、SFP模块', sort: 6, active: true },
    { id: 7, slug: 'software', name: '软件授权', icon: '🔑', desc: 'QTS授权、影像监控', sort: 7, active: true },
    { id: 8, slug: 'warranty', name: '延长质保', icon: '🛡️', desc: '原厂延长质保服务', sort: 8, active: true },
    { id: 9, slug: 'memory', name: '内存', icon: '🧠', desc: 'QNAP原厂DDR4/DDR5', sort: 9, active: true },
  ],
  orders: [],
  reviews: [
    { id: 'rev_1', productId: 'prod_1', userName: '王小明', rating: 5, comment: '非常好用，设置简单，速度快！', createdAt: '2025-03-10' },
    { id: 'rev_2', productId: 'prod_1', userName: '陈雅婷', rating: 4, comment: '性能不错，App 界面友好', createdAt: '2025-02-28' },
    { id: 'rev_3', productId: 'prod_2', userName: '林志远', rating: 5, comment: '买来放公司做共享存储，容量够大！', createdAt: '2025-03-05' },
    { id: 'rev_4', productId: 'prod_2', userName: '吴佳蓉', rating: 5, comment: 'PCIe 扩展很方便，很推荐！', createdAt: '2025-02-15' },
    { id: 'rev_5', productId: 'prod_10', userName: '黄建宏', rating: 5, comment: '即插即用，速度真的快很多！', createdAt: '2025-03-12' },
  ],
  banners: [
    { id: 1, title: 'TS-464 四槽 NAS 热销中', subtitle: 'Intel N5095 四核心 · PCIe 扩展 · 2.5GbE × 2，家用旗舰首选', btnText: '立即购买 ¥ 4,399', link: 'TS-464', gradient: 'linear-gradient(135deg, #0d2137 0%, #006ebd 100%)', image: '', active: true, sort: 1 },
    { id: 2, title: 'QSW-1105-5T 全口 2.5GbE', subtitle: '无风扇静音 · 即插即用 · 5 口全升速，轻松打造高速家庭网络', btnText: '立即购买 ¥ 662', link: 'QSW-1105-5T', gradient: 'linear-gradient(135deg, #0d2a0d 0%, #0a7c3e 100%)', image: '', active: true, sort: 2 },
    { id: 3, title: '春季特卖，折扣最高 30%', subtitle: '精选 NAS、交换机、内存限时优惠，加购延长质保更划算！', btnText: '查看特卖商品', link: '?badge=sale', gradient: 'linear-gradient(135deg, #1d3557 0%, #4a0080 100%)', image: '', active: true, sort: 3 },
  ],
  announcements: [
    { id: 1, text: '🚚 全国包邮（订单满 ¥299）', active: true, sort: 1 },
    { id: 2, text: '🛡️ 原厂质保，放心购物', active: true, sort: 2 },
    { id: 3, text: '💳 支付宝·微信支付·银联', active: true, sort: 3 },
    { id: 4, text: '📦 现货商品 1-2 个工作日发货', active: true, sort: 4 },
    { id: 5, text: '🎁 会员积分可抵现，1积分=1元', active: true, sort: 5 },
    { id: 6, text: '📞 专业技术客服 400-888-3600', active: true, sort: 6 },
    { id: 7, text: '🔒 256-bit SSL 安全加密交易', active: true, sort: 7 },
  ],
  settings: {
    siteName: 'QNAP Store 中国',
    siteDescription: 'QNAP 中国大陆官方网上商城 - 购买 NAS、网络交换机、内存等产品',
    contactEmail: 'store_cn@qnap.com',
    contactPhone: '400-888-3600',
    freeShippingAmount: 299,
    shippingFee: 0,
    stockAlertThreshold: 20,
    expressApiKey: '',
    emailTemplates: {
      orderConfirmation: {
        subject: '【QNAP商城】您的订单 #{orderNo} 已成立',
        body: '亲爱的 {name} 您好，\n\n感谢您的订购！您的订单 #{orderNo} 已成功建立。\n\n订单摘要：\n{items}\n\n配送地址：{address}\n联系电话：{phone}\n订单金额：¥ {total}\n\n我们将在 1-2 个工作日内处理您的订单，如有问题请联系客服 400-888-3600。\n\nQNAP Store 中国',
      },
      orderShipped: {
        subject: '【QNAP商城】您的订单 #{orderNo} 已发货',
        body: '亲爱的 {name} 您好，\n\n您的订单 #{orderNo} 已于今日发货！\n\n配送地址：{address}\n\n请留意包裹送达，如有任何问题请联系我们。\n\nQNAP Store 中国',
      },
    },
  },
  seo: {
    homeTitle: 'QNAP Store 中国 | 官方网上商城',
    homeDescription: 'QNAP 中国大陆官方网上商城，提供 NAS、网络交换机、内存、监控授权等全系列产品，原厂质保、包邮优惠。',
    homeKeywords: 'QNAP, NAS, 网络存储, 交换机, 内存, 中国',
    ogImage: '/images/og-default.png',
  },
  customers: [
    { id: 'cust_1', name: '王小明', email: 'wangxm@163.com', phone: '13800138001', address: '北京市朝阳区建国路88号', totalOrders: 3, totalSpent: 8797, lastOrderDate: '2025-03-10', registeredAt: '2024-12-01', level: 'gold', points: 879 },
    { id: 'cust_2', name: '陈雅婷', email: 'chenyt@sina.com', phone: '13800138002', address: '上海市浦东新区世纪大道1000号', totalOrders: 1, totalSpent: 2199, lastOrderDate: '2025-02-28', registeredAt: '2025-01-15', level: 'silver', points: 219 },
    { id: 'cust_3', name: '林志远', email: 'linzy@qq.com', phone: '13800138003', address: '广州市天河区天河路123号', totalOrders: 5, totalSpent: 21480, lastOrderDate: '2025-03-05', registeredAt: '2024-06-01', level: 'diamond', points: 2148 },
  ],
  invoices: [
    { id: 'inv_1', orderId: 'ord_1', orderNo: 'QNAP20250310001', type: '电子发票', title: '个人', taxNo: '', email: 'wangxm@163.com', amount: 4399, status: '已开票', createdAt: '2025-03-10' },
    { id: 'inv_2', orderId: 'ord_2', orderNo: 'QNAP20250305001', type: '增值税专用发票', title: '某某科技有限公司', taxNo: '91310000MA1K4ABC12', email: 'linzy@qq.com', amount: 7083, status: '已开票', createdAt: '2025-03-05' },
  ],
  staffMembers: [
    { id: 'staff_1', name: '管理员', email: 'admin@qnap.com', role: 'admin', phone: '13800138000', createdAt: '2024-01-01', lastLogin: '2025-03-20' },
    { id: 'staff_2', name: '张运营', email: 'ops@qnap.com', role: 'operator', phone: '13800138010', createdAt: '2024-06-01', lastLogin: '2025-03-18' },
    { id: 'staff_3', name: '李客服', email: 'support@qnap.com', role: 'support', phone: '13800138011', createdAt: '2024-09-01', lastLogin: '2025-03-19' },
  ],
  auditLogs: [
    { id: 'log_1', staffId: 'staff_1', staffName: '管理员', action: '创建', target: '商品', targetName: 'TS-464 四槽 NAS', createdAt: '2025-03-20T10:30:00Z' },
    { id: 'log_2', staffId: 'staff_1', staffName: '管理员', action: '修改', target: '订单状态', targetName: 'QNAP20250310001 → 已发货', createdAt: '2025-03-20T11:00:00Z' },
    { id: 'log_3', staffId: 'staff_2', staffName: '张运营', action: '创建', target: '优惠活动', targetName: '春季满减活动', createdAt: '2025-03-19T14:00:00Z' },
    { id: 'log_4', staffId: 'staff_1', staffName: '管理员', action: '调整', target: '库存', targetName: 'TS-233 库存 -50', createdAt: '2025-03-18T09:00:00Z' },
  ],
  popularSearches: ['TS-464', 'NAS', '交换机', '2.5GbE', '四盘位', '家用NAS', '企业级', '内存', '监控', 'QVR Pro', '延长质保', 'DDR5'],
  shippingCompanies: [
    { id: 'ship_1', name: '顺丰速运', code: 'SF', trackingUrl: 'https://www.sf-express.com/cn/sc/...' },
    { id: 'ship_2', name: '中通快递', code: 'ZT', trackingUrl: 'https://www.zto.com/' },
    { id: 'ship_3', name: '圆通速递', code: 'YT', trackingUrl: 'https://www.yto.net.cn/' },
    { id: 'ship_4', name: '京东物流', code: 'JD', trackingUrl: 'https://www.jdwl.com/' },
    { id: 'ship_5', name: '德邦快递', code: 'DB', trackingUrl: 'https://www.deppon.com/' },
  ],
  fullReductions: [
    { id: 'fr_1', name: '春季满减', threshold: 500, discount: 30, type: 'fixed', startDate: '2025-03-01', endDate: '2025-04-30', active: true, createdAt: '2025-03-01' },
    { id: 'fr_2', name: '爆品特惠', threshold: 1000, discount: 80, type: 'fixed', startDate: '2025-03-01', endDate: '2025-04-30', active: true, createdAt: '2025-03-01' },
    { id: 'fr_3', name: '会员专享', threshold: 2000, discount: 15, type: 'percentage', startDate: '2025-03-01', endDate: '2025-12-31', active: true, createdAt: '2025-03-01' },
  ],
  partnershipApps: [
    { id: 'pa_1', company: '上海博达数据科技有限公司', contact: '张伟', phone: '13812340001', email: 'zhangwei@bodadata.com', tier: 'gold', businessType: '经销商', revenueScale: '1000-5000万', employeeCount: '50-100人', brandExp: '代理群晖、威联通 5 年，年销售额约 2000 万', customerTypes: ['企业', '政府', '教育'], status: 'pending', notes: '', createdAt: '2026-03-10T09:30:00Z' },
    { id: 'pa_2', company: '杭州云智互联信息技术有限公司', contact: '李敏', phone: '13812340002', email: 'limin@yunzhi.cn', tier: 'platinum', businessType: 'MSP', revenueScale: '5000万以上', employeeCount: '100-500人', brandExp: '托管服务提供商，主营混合云解决方案，已服务 200+ 企业客户', customerTypes: ['企业', '医疗', '教育'], status: 'approved', notes: '优质客户，优先支持', createdAt: '2026-03-08T14:20:00Z' },
    { id: 'pa_3', company: '南京华创网络技术有限公司', contact: '王强', phone: '13812340003', email: 'wangqiang@hcwl.com', tier: 'silver', businessType: '系统集成商', revenueScale: '500-1000万', employeeCount: '20-50人', brandExp: '集成商背景，弱电项目为主', customerTypes: ['企业'], status: 'rejected', notes: '资质不符要求', createdAt: '2026-03-05T10:00:00Z' },
  ],
  warrantySubs: [
    { id: 'ws_1', name: '陈明', phone: '13900139001', email: 'chenming@126.com', product: 'TS-464 四槽 NAS', serial: 'QNAP2024TS46400123', purchaseDate: '2024-12-15', issue: 'NAS 指示灯异常，怀疑硬盘背板故障', status: 'pending', notes: '', createdAt: '2026-03-15T10:00:00Z' },
    { id: 'ws_2', name: '刘芳', phone: '13900139002', email: 'liufang@sina.com', product: 'TS-233 双槽 NAS', serial: 'QNAP2025TS23300888', purchaseDate: '2025-01-20', issue: '电源适配器损坏，无法开机', status: 'processing', notes: '已安排寄修，预计 3 个工作日', createdAt: '2026-03-12T15:30:00Z' },
  ],
  supportTickets: [
    { id: 'st_1', name: '赵磊', phone: '13700137001', email: 'zhaolei@corp.com', product: 'TS-464', subject: '无法远程访问 NAS', issueType: '网络问题', description: '公司路由器更换后，myQNAPcloud 无法连接 NAS，本地局域网正常访问。请协助排查。', status: 'open', assignee: '李客服', notes: '待用户提供新路由器 IP 配置信息', createdAt: '2026-03-18T09:00:00Z' },
    { id: 'st_2', name: '周婷', phone: '13700137002', email: 'zhouting@edu.cn', product: 'TS-673A', subject: 'HBS 3 备份任务失败', issueType: '软件问题', description: '设置 HBS 3 将 NAS 数据备份到阿里云 OSS，每晚 2 点任务失败，错误码：ERR_CONNECTION_TIMEOUT。NAS 固件已升级到最新版本。', status: 'in_progress', assignee: '张运营', notes: '检查网络策略和 OSS bucket 权限', createdAt: '2026-03-17T14:00:00Z' },
  ],
  downloads: [
    { id: 'dl_1', sku: 'TS-464', fileName: 'QNAP TS-464 用户手册', fileType: 'PDF', version: '1.0', size: '8.5MB', url: '/downloads/TS-464/TS-464_Manual.pdf', createdAt: '2026-01-01' },
    { id: 'dl_2', sku: 'TS-464', fileName: 'TS-464 快速安装指南', fileType: 'PDF', version: '1.0', size: '2.3MB', url: '/downloads/TS-464/TS-464_QIG.pdf', createdAt: '2026-01-01' },
    { id: 'dl_3', sku: 'TS-464', fileName: 'QNAP QTS 5.2 固件', fileType: 'BIN', version: '5.2.0', size: '1.2GB', url: '/downloads/TS-464/QTS_5.2.0_TS-464.bin', createdAt: '2026-03-01' },
    { id: 'dl_4', sku: 'TS-264', fileName: 'QNAP TS-264 用户手册', fileType: 'PDF', version: '1.0', size: '7.8MB', url: '/downloads/TS-264/TS-264_Manual.pdf', createdAt: '2026-01-01' },
    { id: 'dl_5', sku: 'TS-233', fileName: 'QNAP TS-233 用户手册', fileType: 'PDF', version: '1.0', size: '6.2MB', url: '/downloads/TS-233/TS-233_Manual.pdf', createdAt: '2026-01-01' },
    { id: 'dl_6', sku: 'QSW-1105-5T', fileName: 'QNAP QSW-1105-5T 快速指南', fileType: 'PDF', version: '1.0', size: '1.5MB', url: '/downloads/QSW-1105-5T/QSW-1105-5T_QIG.pdf', createdAt: '2026-01-01' },
    { id: 'dl_7', sku: 'TS-464', fileName: 'Intel N5095 芯片组驱动', fileType: 'ZIP', version: '1.0', size: '45MB', url: '/downloads/TS-464/Intel_N5095_Driver.zip', createdAt: '2026-02-01' },
    { id: 'dl_8', sku: 'TS-673A', fileName: 'QNAP TS-673A 用户手册', fileType: 'PDF', version: '1.0', size: '9.1MB', url: '/downloads/TS-673A/TS-673A_Manual.pdf', createdAt: '2026-01-01' },
  ],
  faq: [
    { id: 1, category: '产品使用', question: '如何设置 QNAP NAS 的网络访问？', answer: '您可以通过以下两种方式远程访问 QNAP NAS：1) 使用 myQNAPcloud 服务（推荐），在 QTS 中启用 myQNAPcloud 并注册账号，即可获得专属链接；2) 在路由器上设置端口转发，常见端口：HTTP 8080、HTTPS 443、SFTP 22、FTP 21。', sortOrder: 1 },
    { id: 2, category: '产品使用', question: 'QNAP NAS 支持哪些 RAID 模式？', answer: 'QNAP NAS 支持以下 RAID 模式：Basic（无冗余）、JBOD（串联）、RAID 0（性能优先）、RAID 1（镜像，2盘位推荐）、RAID 5（均衡，3盘位及以上）、RAID 6（双重校验，4盘位及以上）、RAID 10（性能+冗余，需4盘位）。QTS 还支持 Qtier 自动分层存储和 SnapRAID。', sortOrder: 2 },
    { id: 3, category: '产品使用', question: '如何扩展 NAS 的存储容量？', answer: 'QNAP NAS 提供三种扩容方式：1) 直接安装更多硬盘（如果槽位允许）；2) 通过 USB 或 eSATA 接口连接 QNAP 扩展柜（如 UX-1200U-RP）；3) 使用 VJBOD 将另一台 NAS 的存储空间虚拟化为本地磁盘使用。推荐使用 Qtier 功能自动管理热冷数据分层。', sortOrder: 3 },
    { id: 4, category: '产品使用', question: 'QNAP NAS 如何备份到云端？', answer: '使用 HBS 5（混合备份同步）可以将 NAS 数据备份到阿里云 OSS、腾讯云 COS、AWS S3、Azure Blob 等 20+ 云服务商。HBS 5 支持增量备份、QuDedup 源端去重和 AES-256 加密。建议设置定时自动备份任务，重要数据遵循 3-2-1 备份原则。', sortOrder: 4 },
    { id: 5, category: '订购配送', question: 'QNAP 产品有现货吗？发货时间是多久？', answer: 'QNAP 官方商城大部分商品有现货。订单确认后，我们将在 1-2 个工作日内发货。偏远地区可能需要 3-5 个工作日。预售商品以商品页面标注的发货时间为准。订单满 ¥299 全国包邮（港澳台及海外地区除外）。', sortOrder: 1 },
    { id: 6, category: '订购配送', question: '支持哪些支付方式？', answer: 'QNAP 官方商城支持以下支付方式：支付宝、微信支付、银联在线支付（云闪付）、货到付款（部分城市）。企业客户也可选择银行转账，详情请联系客服。订单支付成功后不可自行取消，如需退款请参考退换货政策。', sortOrder: 2 },
    { id: 7, category: '订购配送', question: '可以开具增值税专用发票吗？', answer: '可以。在结算页面选择"增值税专用发票"，填写企业名称、纳税人识别号、开户行及账号等信息。我们将在确认收货后 7 个工作日内开具并寄出发票。如需在收货后补开发票，请在订单完成后 30 天内联系客服申请。', sortOrder: 3 },
    { id: 8, category: '订购配送', question: '可以开发票后再发货吗？', answer: '可以。对于企业订单或需要先获取发票再付款的情况，请在提交订单后联系客服（400-888-3600），我们将在确认开票信息后为您单独处理。', sortOrder: 4 },
    { id: 9, category: '售后', question: 'QNAP 产品质保期是多久？', answer: 'QNAP NAS 产品自购买之日起享受 2 年有限质保（以发票日期为准）。硬盘享有单独质保（各品牌不同，一般为 2-5 年）。您可以购买 QNAP 延长质保服务（QEWS）将质保期延长至最多 5 年。质保范围仅限硬件故障，不包含人为损坏。', sortOrder: 1 },
    { id: 10, category: '售后', question: '如何申请退换货？', answer: '自签收之日起 7 天内，如产品未拆封且包装完好，您可以申请无理由退货；15 天内如产品存在质量问题（非人为损坏），可以申请换货。申请退换货请联系客服 400-888-3600，提供订单号和产品序列号。退货退款将在收到退货商品后 7 个工作日内处理完成。', sortOrder: 2 },
    { id: 11, category: '售后', question: '质保期内如何申请维修服务？', answer: '质保期内如产品出现硬件故障，请联系 QNAP 客服（400-888-3600）申请质保服务。我们将根据故障类型安排：1) 上门服务（仅限部分城市）；2) 寄修服务（将设备寄至就近维修中心）；3) 到店服务（至 QNAP 授权维修点）。请保留购买发票和产品序列号标签以便核实质保信息。', sortOrder: 3 },
    { id: 12, category: '售后', question: '过保产品还能维修吗？收费如何？', answer: '可以。QNAP 提供过保维修服务。维修费用由工程师检测后报价，包括：检测费（¥100）、零件费、人工费。如选择不维修，我们将收取 ¥100 检测费。请联系客服获取最近的维修中心地址。维修周期一般为 5-10 个工作日。', sortOrder: 4 },
    { id: 13, category: '其他', question: 'QNAP NAS 可以安装第三方应用吗？', answer: '可以。QNAP QTS 系统内置 App Center，支持安装数百款经过 QNAP 认证的应用。App Center 提供备份/同步、安全、工具、开发、娱乐等多种类别的应用。此外，您也可以通过 Container Station 运行 Docker 容器或通过 Virtualization Station 安装虚拟机，扩展 NAS 的功能。', sortOrder: 1 },
    { id: 14, category: '其他', question: 'QNAP NAS 可以当作电脑使用吗？', answer: '可以通过两种方式"当电脑用"：1) 使用 Virtualization Station 安装 Windows、Linux 等虚拟机，QNAP TVS-h874 等高性能机型支持流畅运行 Windows 桌面系统；2) 使用 Container Station 运行 Linux 容器，执行命令行任务和开发工作。QNAP 还提供 HybridDesk Station，在 NAS 上直接运行 Chrome 浏览器和桌面应用。', sortOrder: 2 },
    { id: 15, category: '其他', question: '如何重置 QNAP NAS 的管理员密码？', answer: '如果忘记管理员密码，可以通过 NAS 硬件重置：找到 NAS 背面的"重置按钮"，使用回形针按住 3 秒，听到提示音后松开，NAS 将恢复默认设置（IP 变为 DHCP，admin 密码恢复为 admin）。注意：此操作不会删除数据，但会重置网络配置和管理员密码。', sortOrder: 3 },
    { id: 16, category: '其他', question: 'QNAP NAS 噪音大吗？适合家用吗？', answer: 'QNAP 家用 NAS（如 TS-233、TS-264、TS-464）均采用静音风扇设计，噪音控制在 20-30dB 之间，类似于安静的图书馆环境。建议将 NAS 放置在通风良好的位置，避免阳光直射。企业级机架 NAS（如 TS-1683XU）噪音较大，不适合家用。', sortOrder: 4 },
  ],
  rma_policy: '<h2>退换货政策</h2><h3>一、退货政策</h3><p>自签收之日起 7 天内（含 7 天），如您需要退货，请确保：</p><ul><li>产品及所有配件未拆封、包装完好</li><li>附有完整发票和保修卡</li><li>产品序列号未被损坏或涂抹</li></ul><p>退货申请审核通过后，我们将在收到退货商品后 <strong>7 个工作日</strong> 内退款至原支付账户。</p><h3>二、换货政策</h3><p>自签收之日起 <strong>15 天</strong>内，如产品存在非人为因素导致的硬件故障，您可以申请换货。换货时需提供：</p><ul><li>产品序列号及购买发票</li><li>故障描述说明</li><li>故障现场照片（如适用）</li></ul><p>换货周期一般为 3-5 个工作日。</p><h3>三、以下情况不在退换货范围内</h3><ul><li>人为损坏、进水、私自拆修的产品</li><li>已超过退换货期限的商品</li><li>因物流运输造成的轻微外观划痕（不影响功能）</li><li>软件问题（请通过技术支持工单解决）</li><li>已激活或注册的服务（如延长质保、QVR Pro 等）</li></ul><h3>四、退换货流程</h3><ol><li>联系客服 400-888-3600 申请退换货</li><li>客服审核通过后，您将收到退货地址和退换货单号</li><li>请将商品及配件使用原包装妥善包装，快递至指定地址（到付请注明，运费由责任方承担）</li><li>我们收到商品并检查无误后，进行退款或换货处理</li></ol><h3>五、特别说明</h3><p>硬盘产品一经拆封，不支持 7 天无理由退货，但享有品牌原厂质保。更多详情请联系客服。</p>',
  customer_service_info: {
    phone: '400-888-3600',
    email: 'support_cn@qnap.com',
    address: '上海市浦东新区张江高科技园区碧波路 690 号',
    workHours: '周一至周五 09:00-18:00（节假日除外）',
    wechat: 'QNAP-CN',
  },
};

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (!data.settings) data.settings = defaultData.settings;
  if (!data.banners) data.banners = defaultData.banners;
  if (!data.announcements) data.announcements = defaultData.announcements;
  if (!data.coupons) data.coupons = defaultData.coupons;
  if (!data.seo) data.seo = defaultData.seo;
  if (typeof data.settings.stockAlertThreshold !== 'number') data.settings.stockAlertThreshold = 20;
  if (!data.emailTemplates) data.emailTemplates = defaultData.settings.emailTemplates;
  if (!data.productViews) data.productViews = {};
  if (!data.activities) data.activities = [];
  if (!data.customers) data.customers = defaultData.customers;
  if (!data.invoices) data.invoices = defaultData.invoices;
  if (!data.staffMembers) data.staffMembers = defaultData.staffMembers;
  if (!data.auditLogs) data.auditLogs = defaultData.auditLogs;
  if (!data.popularSearches) data.popularSearches = defaultData.popularSearches;
  if (!data.shippingCompanies) data.shippingCompanies = defaultData.shippingCompanies;
  if (!data.fullReductions) data.fullReductions = defaultData.fullReductions;
  if (!data.news) data.news = defaultData.news;
  if (!data.partnershipApps) data.partnershipApps = defaultData.partnershipApps;
  if (!data.warrantySubs) data.warrantySubs = defaultData.warrantySubs;
  if (!data.supportTickets) data.supportTickets = defaultData.supportTickets;
  if (!data.downloads) data.downloads = defaultData.downloads;
  if (!data.faq) data.faq = defaultData.faq;
  if (!data.rma_policy) data.rma_policy = defaultData.rma_policy;
  if (!data.customer_service_info) data.customer_service_info = defaultData.customer_service_info;
  return data;
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { loadDB, saveDB, defaultData };
