'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = ['公司信息', '合作意向', '公司简介', '确认信息', '提交结果'];

const REVENUE_OPTIONS = ['100万以下', '100-500万', '500-1000万', '1000-5000万', '5000万以上'];
const EMPLOYEE_OPTIONS = ['1-10人', '10-20人', '20-50人', '50-100人', '100-500人', '500人以上'];
const BUSINESS_TYPES = ['经销商', '系统集成商', 'MSP', '企业直采', '电商', '其他'];
const CUSTOMER_TYPES = ['个人', '企业', '政府', '教育', '医疗', '其他'];

export default function PartnershipApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    company: '', contact: '', phone: '', email: '', address: '',
    tier: 'silver', businessType: '',
    revenueScale: '', employeeCount: '',
    brandExp: '', customerTypes: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(key: string, value: any) {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: '' });
  }

  function toggleCustomerType(type: string) {
    const types = form.customerTypes.includes(type)
      ? form.customerTypes.filter(t => t !== type)
      : [...form.customerTypes, type];
    updateField('customerTypes', types);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.company.trim()) errs.company = '请填写公司名称';
      if (!form.contact.trim()) errs.contact = '请填写联系人';
      if (!form.phone.trim()) errs.phone = '请填写联系电话';
      if (!form.email.trim() || !form.email.includes('@')) errs.email = '请填写有效邮箱';
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return false; }
    return true;
  }

  function next() {
    if (step < 4) {
      if (step === 3) { setStep(4); return; }
      if (validate()) setStep(step + 1);
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/partnership/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); setStep(4); }
      else {
        const data = await res.json();
        alert(data.error || '提交失败，请重试');
      }
    } catch {
      alert('网络错误，请重试');
    }
    setSubmitting(false);
  }

  const TIER_COLORS: Record<string, string> = {
    silver: 'from-gray-300 to-gray-400',
    gold: 'from-yellow-300 to-yellow-500',
    platinum: 'from-purple-300 to-purple-500',
  };
  const TIER_LABELS: Record<string, string> = { silver: '银级合作伙伴', gold: '金级合作伙伴', platinum: '白金合作伙伴' };

  return (
    <>
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-barlow text-3xl font-extrabold mb-2">申请成为 QNAP 合作伙伴</h1>
          <p className="text-white/60">与 QNAP 携手，共创双赢局面</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {step < 4 && (
            <>
              <div className="flex items-center mb-8">
                {STEPS.slice(0, 4).map((s, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs ml-2 hidden sm:block ${i === step ? 'text-blue font-medium' : 'text-gray-400'}`}>{s}</span>
                    {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              <h2 className="font-bold text-lg mb-6">{STEPS[step]}</h2>
            </>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">公司名称 *</label>
                <input value={form.company} onChange={e => updateField('company', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.company ? 'border-red-500' : ''}`} placeholder="请输入公司全称" />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">联系人姓名 *</label>
                  <input value={form.contact} onChange={e => updateField('contact', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.contact ? 'border-red-500' : ''}`} placeholder="联系人" />
                  {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">联系电话 *</label>
                  <input value={form.phone} onChange={e => updateField('phone', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.phone ? 'border-red-500' : ''}`} placeholder="手机号" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">邮箱地址 *</label>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.email ? 'border-red-500' : ''}`} placeholder="business@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">公司地址</label>
                <input value={form.address} onChange={e => updateField('address', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="详细地址" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">期望合作等级 *</label>
                <div className="grid grid-cols-3 gap-4">
                  {[{ key: 'silver', icon: '🥈', label: '银级', desc: '年采购 ¥50 万起' }, { key: 'gold', icon: '🥇', label: '金级', desc: '年采购 ¥200 万起' }, { key: 'platinum', icon: '💎', label: '白金', desc: '年采购 ¥500 万起' }].map(t => (
                    <div key={t.key} onClick={() => updateField('tier', t.key)} className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${form.tier === t.key ? `border-blue bg-blue-50 ${TIER_COLORS[t.key].split(' ')[0]}/10` : 'border-gray-100 hover:border-blue/50'}`}>
                      <div className="text-3xl mb-1">{t.icon}</div>
                      <p className="font-bold text-sm">{t.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">主要业务类型 *</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map(bt => (
                    <button key={bt} onClick={() => updateField('businessType', bt)} className={`px-4 py-2 rounded-full text-sm border transition-colors ${form.businessType === bt ? 'bg-blue text-white border-blue' : 'border-gray-200 hover:border-blue'}`}>
                      {bt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">年营收规模</label>
                  <select value={form.revenueScale} onChange={e => updateField('revenueScale', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">请选择</option>
                    {REVENUE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">员工人数</label>
                  <select value={form.employeeCount} onChange={e => updateField('employeeCount', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">请选择</option>
                    {EMPLOYEE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">代理品牌经验</label>
                <textarea value={form.brandExp} onChange={e => updateField('brandExp', e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="请介绍您公司代理其他品牌的经验，以及已有的客户类型和行业背景..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">已有客户类型</label>
                <div className="flex flex-wrap gap-2">
                  {CUSTOMER_TYPES.map(ct => (
                    <button key={ct} onClick={() => toggleCustomerType(ct)} className={`px-4 py-2 rounded-full text-sm border transition-colors ${form.customerTypes.includes(ct) ? 'bg-blue text-white border-blue' : 'border-gray-200 hover:border-blue'}`}>
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-500 mb-3">Step 1 - 公司信息</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">公司名称：</span>{form.company}</div>
                  <div><span className="text-gray-400">联系人：</span>{form.contact}</div>
                  <div><span className="text-gray-400">电话：</span>{form.phone}</div>
                  <div><span className="text-gray-400">邮箱：</span>{form.email}</div>
                  {form.address && <div className="col-span-2"><span className="text-gray-400">地址：</span>{form.address}</div>}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-500 mb-3">Step 2 - 合作意向</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">合作等级：</span><span className={`font-bold ${form.tier === 'gold' ? 'text-yellow-600' : form.tier === 'platinum' ? 'text-purple-600' : 'text-gray-600'}`}>{TIER_LABELS[form.tier]}</span></div>
                  <div><span className="text-gray-400">业务类型：</span>{form.businessType || '-'}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-500 mb-3">Step 3 - 公司简介</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">年营收：</span>{form.revenueScale || '-'}</div>
                  <div><span className="text-gray-400">员工：</span>{form.employeeCount || '-'}</div>
                  <div className="col-span-2"><span className="text-gray-400">客户类型：</span>{form.customerTypes.join(' / ') || '-'}</div>
                </div>
                {form.brandExp && <p className="text-sm text-gray-600"><span className="text-gray-400">经验介绍：</span>{form.brandExp}</p>}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">请确认以上信息无误，点击「提交申请」完成申请。</p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              {submitted ? (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="font-barlow text-2xl font-bold mb-3">申请已提交！</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    您的合作申请已收到，QNAP 业务团队将在 <strong>3 个工作日</strong> 内与您联系，请保持电话畅通。
                  </p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => router.push('/partnership')} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      返回合作伙伴页面
                    </button>
                    <button onClick={() => router.push('/')} className="px-6 py-2 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue/90 transition-colors">
                      返回首页
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-barlow text-2xl font-bold mb-4">确认提交</h2>
                  <p className="text-gray-500 mb-6">提交后将无法修改，确认提交您的合作申请？</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={back} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50">返回修改</button>
                    <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue/90 disabled:opacity-50">
                      {submitting ? '提交中...' : '确认提交'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-8">
              <button onClick={back} disabled={step === 0} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">上一步</button>
              <button onClick={next} className="px-6 py-2 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue/90">下一步</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
