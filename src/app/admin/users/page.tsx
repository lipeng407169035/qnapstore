'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20">加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="text-sm text-gray-500">共 {users.length} 位用户</div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-gray-500">ID</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">姓名</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">电子邮件</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">身份</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-500">{user.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="p-4 text-sm">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'admin' ? '管理员' : '用户'}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-TW') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
