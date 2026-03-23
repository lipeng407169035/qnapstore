'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { Invoice } from '@/types';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ orderNo: '', type: '电子发票', title: '个人', taxNo: '', email: '', amount: '' });

  useEffect(() => {
    adminFetch('/api/admin/invoices').then(r => r.json()).then(data => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = {
    '申请中': 'bg-yellow-100 text-yellow-700',
    '已开票': 'bg-green-100 text-green-700',
    '已作废': 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">发票管理</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">发票号</th>
                <th className="pb-3">订单号</th>
                <th className="pb-3">发票类型</th>
                <th className="pb-3">抬头</th>
                <th className="pb-3">金额</th>
                <th className="pb-3">状态</th>
                <th className="pb-3">申请时间</th>
                <th className="pb-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-mono text-sm">{inv.id.split('_')[1]}</td>
                  <td className="py-3 font-mono text-sm">{inv.orderNo}</td>
                  <td className="py-3 text-sm">{inv.type}</td>
                  <td className="py-3">
                    <div className="text-sm">{inv.title}</div>
                    {inv.taxNo && <div className="text-xs text-gray-400">{inv.taxNo}</div>}
                  </td>
                  <td className="py-3 font-semibold">¥ {inv.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[inv.status] || 'bg-gray-100'}`}>{inv.status}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{inv.createdAt}</td>
                  <td className="py-3">
                    {inv.status === '申请中' && (
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          await adminFetch(`/api/admin/invoices/${inv.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: '已开票' }) });
                          setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: '已开票' } : i));
                        }} className="text-green-600 text-sm hover:underline">开票</button>
                        <button onClick={async () => {
                          await adminFetch(`/api/admin/invoices/${inv.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: '已作废' }) });
                          setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: '已作废' } : i));
                        }} className="text-red-500 text-sm hover:underline">作废</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">暂无发票记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
