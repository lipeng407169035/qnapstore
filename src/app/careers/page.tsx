'use client';

import { Utensils, Sun, Mail, Briefcase, Heart, TrendingUp, GraduationCap, Zap, MapPin, FileText } from 'lucide-react';

export default function CareersPage() {
  const perks = [
    { Icon: Briefcase, title: '具竞争力薪酬', desc: '年薪 14-18 个月，含季度绩效奖金与年度调薪' },
    { Icon: Heart, title: '完善保险福利', desc: '五险一金、团体保险、年度健康检查' },
    { Icon: TrendingUp, title: '职涯发展', desc: '内部晋升制度、跨国轮调机会，专业技能补助' },
    { Icon: GraduationCap, title: '教育训练', desc: '年度培训预算 ¥30,000/人，外训课程全额补助' },
    { Icon: Utensils, title: '生活补助', desc: '免费午餐补助、交通津贴、健身费用补贴' },
    { Icon: Sun, title: '休假制度', desc: '第一年即有 10 天特休假，逐步增加，上限 30 天' },
  ];

  const jobs = [
    {
      title: '资深软件工程师 (NAS 系统)',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥70,000 - 120,000 /月',
      tags: ['Linux', 'C/C++', 'Embedded', 'Docker'],
      desc: '负责 QTS/NAS 核心系统开发，优化存储效能与网络协议。',
      hot: true,
    },
    {
      title: '前端工程师 (React/Next.js)',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥55,000 - 90,000 /月',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      desc: '开发 QNAP 网上商城与管理界面的前端功能。',
      hot: true,
    },
    {
      title: '后端工程师 (Node.js/Express)',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥60,000 - 100,000 /月',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
      desc: '构建电商平台 API、订单系统与会员管理服务。',
      hot: false,
    },
    {
      title: '产品经理 (NAS 新产品线)',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥65,000 - 110,000 /月',
      tags: ['产品策略', '市场分析', '跨部门协作'],
      desc: '规划并推动新一代 NAS 产品从概念到上市的完整流程。',
      hot: false,
    },
    {
      title: '客户成功经理 (Customer Success)',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥50,000 - 80,000 /月',
      tags: ['客户关系', '技术支持', 'SaaS'],
      desc: '负责企业客户的导入支持与续约管理，提升客户满意度。',
      hot: false,
    },
    {
      title: '数字营销专员',
      location: '上海市浦东新区',
      type: '全职',
      salary: '¥40,000 - 65,000 /月',
      tags: ['SEO', 'Google Ads', '社群营销', '数据分析'],
      desc: '规划并执行线上营销活动，提升品牌曝光与转换率。',
      hot: false,
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#1a3a2a] to-[#0d5a3a] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-barlow text-3xl md:text-4xl font-extrabold mb-3">加入 QNAP 团队</h1>
          <p className="text-white/70 max-w-xl mx-auto">我们正在寻找有热情、有能力的优秀人才，一起打造世界级的存储解决方案</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Perks */}
        <h2 className="font-barlow text-2xl font-bold text-center mb-8">员工福利</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {perks.map((p, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center mx-auto mb-2">
                <p.Icon className="w-5 h-5 text-blue" />
              </div>
              <h4 className="font-bold text-sm mb-1">{p.title}</h4>
              <p className="text-xs text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Jobs */}
        <h2 className="font-barlow text-2xl font-bold text-center mb-8">热门职缺</h2>
        <div className="space-y-4 mb-8">
          {jobs.map((job, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 md:p-6 border ${job.hot ? 'border-orange/30 shadow-sm' : 'border-gray-100'} hover:shadow-md transition-shadow`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {job.hot && <span className="bg-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> 急征</span>}
                    <h3 className="font-bold text-lg">{job.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {job.type}</span>
                    <span className="text-green-600 font-medium">{job.salary}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{job.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag, j) => (
                      <span key={j} className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                <a href={`mailto:hr@qnap.com?subject=应聘：${job.title}`} className="bg-blue text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-dark transition-colors whitespace-nowrap">
                  立即应聘
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
          <h2 className="font-barlow text-xl font-bold mb-3">没有看到合适的职缺？</h2>
          <p className="text-gray-500 text-sm mb-4">我们持续招募各类优秀人才，欢迎主动投递简历</p>
          <a href="mailto:hr@qnap.com" className="inline-block bg-blue text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-dark transition-colors">
            投递简历 <Mail className="w-4 h-4 inline ml-1" />
          </a>
        </div>
      </div>
    </>
  );
}
