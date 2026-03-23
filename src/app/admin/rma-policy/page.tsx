'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/Toast';

export default function AdminRmaPolicyPage() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings/rma-policy')
      .then(r => r.json())
      .then(data => setContent(data.content || ''));
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/settings/rma-policy', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    toast.success('保存成功');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">退换货政策</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-4">支持 HTML 格式，可使用 &lt;h2&gt;、&lt;p&gt;、&lt;ul&gt;、&lt;li&gt;、&lt;strong&gt; 等标签。</p>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={20}
          className="w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue/30"
          placeholder="输入退换货政策内容..."
        />
      </div>
    </div>
  );
}
