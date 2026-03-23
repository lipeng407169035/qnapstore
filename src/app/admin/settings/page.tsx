'use client';

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';
import { AlertTriangle } from 'lucide-react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  freeShippingAmount: number;
  shippingFee: number;
  stockAlertThreshold: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    freeShippingAmount: 3000,
    shippingFee: 150,
    stockAlertThreshold: 20,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => { toast.error('加载失败，请重试'); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await adminFetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">系统设置</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${saved ? 'bg-green text-white' : 'bg-blue text-white hover:bg-blue-dark'} disabled:opacity-50`}
        >
          {saving ? '保存中...' : saved ? '已保存 ✓' : '保存设置'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本设置 */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">基本设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="QNAP Store Taiwan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                rows={3}
                 placeholder="QNAP 中国官方网站..."
              />
            </div>
          </div>
        </div>

        {/* 联系设置 */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">联系信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客服 Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="store@qnap.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客服电话</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="02-2600-1919"
              />
            </div>
          </div>
        </div>

        {/* 运费设置 */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">运费设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">免运费门槛 (¥)</label>
              <input
                type="number"
                value={settings.freeShippingAmount}
                onChange={(e) => setSettings({...settings, freeShippingAmount: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">运费 (¥)</label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) => setSettings({...settings, shippingFee: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">库存预警门槛</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.stockAlertThreshold}
                  onChange={(e) => setSettings({...settings, stockAlertThreshold: parseInt(e.target.value) || 20})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                  placeholder="20"
                />
                <span className="text-sm text-gray-500">件</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">商品库存低于此数量时，仪表板将显示预警提醒</p>
            </div>
          </div>
        </div>

        {/* 其他设置 */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">其他信息</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">管理员账号</p>
              <p className="font-medium">admin@qnap.com</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> 如需修改管理员密码，请联系开发人员</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
