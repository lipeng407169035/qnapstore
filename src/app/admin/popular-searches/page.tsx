'use client';
import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { toast } from '@/components/ui/Toast';

export default function AdminPopularSearchesPage() {
  const [searches, setSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/popular-searches').then(r => r.json()).then(data => {
      setSearches(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await adminFetch('/api/admin/popular-searches', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ searches }) });
    toast.success('保存成功！');
  };

  if (loading) return <div className="text-center py-20">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">热门搜索词管理</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold mb-4">当前热门搜索词（拖拽可调整排序）</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {searches.map((word, i) => (
            <div key={i} className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-sm">
              <span className="text-blue-600">{i + 1}</span>
              <span>{word}</span>
              <button onClick={() => setSearches(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newWord} onChange={e => setNewWord(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newWord.trim()) { setSearches(prev => [...prev, newWord.trim()]); setNewWord(''); } }}
            placeholder="输入搜索词后按回车添加" className="flex-1 px-4 py-2 border rounded-xl text-sm" />
          <button onClick={() => { if (newWord.trim()) { setSearches(prev => [...prev, newWord.trim()]); setNewWord(''); } }} className="bg-blue text-white px-6 py-2 rounded-xl text-sm">添加</button>
        </div>
        <button onClick={handleSave} className="mt-4 bg-blue text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-dark">保存排序</button>
      </div>
    </div>
  );
}
