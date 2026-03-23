import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Phone, Mail, Clock, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f1a2e] text-[#8a9bb5] mt-10">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center text-white font-barlow font-black text-lg">
                Q
              </div>
              <span className="font-barlow font-extrabold text-lg text-white">QNAP Store 中国</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-4">
              QNAP（威联通科技）是中国大陆领先的网络存储设备品牌，成立于 2004 年，致力于提供高品质的存储与网络解决方案。
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center text-sm hover:bg-blue hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center text-sm hover:bg-blue hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center text-sm hover:bg-blue hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center text-sm hover:bg-blue hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">商品分类</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/products?category=home-nas" className="hover:text-white transition-colors">家用 NAS</Link></li>
              <li><Link href="/products?category=business-nas" className="hover:text-white transition-colors">企业 NAS</Link></li>
              <li><Link href="/products?category=rackmount-nas" className="hover:text-white transition-colors">机架式 NAS</Link></li>
              <li><Link href="/products?category=all-flash" className="hover:text-white transition-colors">全快闪 NAS</Link></li>
              <li><Link href="/products?category=switch" className="hover:text-white transition-colors">网络交换机</Link></li>
              <li><Link href="/products?category=router" className="hover:text-white transition-colors">路由器</Link></li>
              <li><Link href="/products?category=nvr-hardware" className="hover:text-white transition-colors">QVR Pro 专用机</Link></li>
              <li><Link href="/products?category=expansion" className="hover:text-white transition-colors">扩展设备</Link></li>
              <li><Link href="/products?category=network-card" className="hover:text-white transition-colors">网络配件</Link></li>
              <li><Link href="/products?category=storage-card" className="hover:text-white transition-colors">存储扩展卡</Link></li>
              <li><Link href="/products?category=m2-card" className="hover:text-white transition-colors">M.2 SSD 扩展卡</Link></li>
              <li><Link href="/products?category=software" className="hover:text-white transition-colors">软件授权</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">客户服务</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/orders" className="hover:text-white transition-colors">订单查询</Link></li>
              <li><Link href="/rma" className="hover:text-white transition-colors">退换货政策</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">质保服务</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">技术支持</Link></li>
              <li><Link href="/downloads" className="hover:text-white transition-colors">下载中心</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">关于 QNAP</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/about" className="hover:text-white transition-colors">品牌介绍</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">新闻中心</Link></li>
              <li><Link href="/partnership" className="hover:text-white transition-colors">成为合作伙伴</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">招聘信息</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">联系信息</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> 400-888-3600
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> store@qnap.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" /> 周一至周五 09:00 - 18:00
              </li>
              <li className="flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> 上海市浦东新区张江高科技园区
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 py-3 md:py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-xs gap-2 md:gap-0">
          <span>© 2025 QNAP Systems, Inc. 版权所有 | 统一社会信用代码：12345678</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie设置</Link>
          </div>
          <div className="flex gap-2">
            <span className="bg-white/10 rounded px-2 py-1 text-[11px] font-semibold text-[#c5d3e0]">银联</span>
            <span className="bg-white/10 rounded px-2 py-1 text-[11px] font-semibold text-[#c5d3e0]">支付宝</span>
            <span className="bg-white/10 rounded px-2 py-1 text-[11px] font-semibold text-[#c5d3e0]">微信支付</span>
            <span className="bg-white/10 rounded px-2 py-1 text-[11px] font-semibold text-[#c5d3e0]">网银转账</span>
            <span className="bg-white/10 rounded px-2 py-1 text-[11px] font-semibold text-[#c5d3e0]">货到付款</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
