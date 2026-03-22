'use client';
import { useRouter } from 'next/navigation';

export default function PartnershipPage() {
  const router = useRouter();
  const benefits = [
    { icon: '💰', title: '具竞争力的利润空间', desc: '提供多层级代理折扣与季度返点奖励，确保合作伙伴有充足的利润空间' },
    { icon: '📚', title: '完整技术培训', desc: '每年至少 4 场产品培训营，涵盖技术认证、销售技巧与售后服务' },
    { icon: '🎯', title: '营销资源支持', desc: '提供本地化营销素材、参展补助及数字广告费用补贴' },
    { icon: '🔧', title: '专属技术支持', desc: '24 小时线上技术客服，优先处理合作伙伴的疑难问题' },
    { icon: '📊', title: 'CRM 系统对接', desc: '提供合作伙伴专用 B2B 平台，支持报价、库存查询与订单管理' },
    { icon: '🏅', title: '年度奖励计划', desc: '表现杰出的合作伙伴可获得年度奖金、海外旅游及 QNAP 原厂参访' },
  ];

  const tiers = [
    {
      name: '银级合作伙伴',
      icon: '🥈',
      min: '年采购 ¥50 万',
      benefits: ['标准经销折扣', '线上技术支持', '营销素材下载', '产品培训机会'],
    },
    {
      name: '金级合作伙伴',
      icon: '🥇',
      min: '年采购 ¥200 万',
      benefits: ['优惠经销折扣', '优先技术支持', '参展补助 50%', '年度培训营名额', 'CRM 系统接入'],
    },
    {
      name: '白金合作伙伴',
      icon: '💎',
      min: '年采购 ¥500 万',
      benefits: ['最大折扣优惠', '专属客户经理', 'OEM/ODM 定制服务', '年度奖金计划', '海外参访补助'],
    },
  ];

  const process = [
    { step: '1', title: '填写申请表', desc: '线上填写合作伙伴申请表' },
    { step: '2', title: '资格审核', desc: '我们将在 3 个工作天内审核' },
    { step: '3', title: '签署合约', desc: '通过审核后签署合作协议' },
    { step: '4', title: '开通权限', desc: '开通 B2B 平台与培训账号' },
    { step: '5', title: '开始合作', desc: '展开销售业务与技术服务' },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-barlow text-3xl md:text-4xl font-extrabold mb-3">成为 QNAP 合作伙伴</h1>
          <p className="text-white/70 max-w-xl mx-auto">与 QNAP 携手，为企业与家庭用户提供优质的网络存储解决方案，共创双赢局面</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Benefits */}
        <h2 className="font-barlow text-2xl font-bold text-center mb-8">合作伙伴权益</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold mb-1.5">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Partner Tiers */}
        <h2 className="font-barlow text-2xl font-bold text-center mb-8">合作伙伴等级</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((t, i) => (
            <div key={i} className={`rounded-2xl p-6 border-2 ${i === 2 ? 'border-blue bg-blue-50' : 'border-gray-100 bg-white'}`}>
              <div className="text-4xl mb-3">{t.icon}</div>
              <h3 className="font-bold text-lg mb-1">{t.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{t.min}</p>
              <ul className="space-y-2">
                {t.benefits.map((b, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process */}
        <h2 className="font-barlow text-2xl font-bold text-center mb-8">申请流程</h2>
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-blue text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {p.step}
                </div>
                <h4 className="font-bold text-sm mb-1">{p.title}</h4>
                <p className="text-xs text-gray-400">{p.desc}</p>
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-blue/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue to-blue-dark rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="font-barlow text-2xl font-bold mb-4">准备好成为 QNAP 合作伙伴了吗？</h2>
          <p className="text-white/70 mb-6">立即填写申请表，我们的业务团队将在 24 小时内与您联系</p>
          <button onClick={() => router.push('/partnership/apply')} className="inline-block bg-white text-blue px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            申请合作 →
          </button>
        </div>
      </div>
    </>
  );
}
