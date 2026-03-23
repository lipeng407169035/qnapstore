'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';

interface EmailTemplate {
  subject: string;
  body: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, EmailTemplate>>({});

  useEffect(() => {
    adminFetch('/api/admin/email-templates')
      .then(r => r.json())
      .then(data => {
        setTemplates(data);
        setForm(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (type: string) => {
    setSaving(type);
    await adminFetch(`/api/admin/email-templates/${type}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form[type]),
    });
    setSaving(null);
    toast.success('保存成功！');
  };

  const insertVar = (type: string, field: 'subject' | 'body', variable: string) => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: (prev[type]?.[field] || '') + variable,
      },
    }));
  };

  const variableHelp = [
    { v: '{orderNo}', d: '订单编号' },
    { v: '{name}', d: '客户姓名' },
    { v: '{items}', d: '商品列表' },
    { v: '{total}', d: '订单金额' },
    { v: '{address}', d: '配送地址' },
    { v: '{phone}', d: '联络电话' },
  ];

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">邮件模板</h1>
      <p className="text-sm text-gray-500 mb-6">自定义订单确认信、出货通知等邮件模板。可用变量：{'{orderNo}'}、{'{name}'}、{'{items}'}、{'{total}'}、{'{address}'}、{'{phone}'}</p>

      <div className="space-y-6">
        {Object.entries(form).map(([type, tmpl]) => (
          <div key={type} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-5 bg-gray-50 border-b">
              <h2 className="font-bold text-lg">
                {type === 'orderConfirmation' ? '📧 订单确认信' :
                 type === 'orderShipped' ? '📦 出货通知' :
                 type === 'orderDelivered' ? '✅ 收货确认' : type}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">邮件主题</label>
                <input
                  type="text"
                  value={tmpl.subject}
                  onChange={e => setForm(prev => ({ ...prev, [type]: { ...prev[type], subject: e.target.value } }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                  placeholder="邮件主题..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">邮件内容</label>
                  <div className="flex gap-1 flex-wrap">
                    {variableHelp.map(({ v, d }) => (
                      <button key={v} onClick={() => insertVar(type, 'body', v)}
                        className="px-2 py-0.5 bg-blue-50 text-blue text-xs rounded hover:bg-blue-100"
                        title={d}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={tmpl.body}
                  onChange={e => setForm(prev => ({ ...prev, [type]: { ...prev[type], body: e.target.value } }))}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono resize-none"
                  placeholder="邮件内容..."
                />
              </div>
              <button
                onClick={() => handleSave(type)}
                disabled={saving === type}
                className="bg-blue text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-dark disabled:opacity-50"
              >
                {saving === type ? '保存中...' : '💾 保存模板'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
