'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await api.login({ email, password });
        setUser(user as any);
        toast.success('登录成功！');
        router.push(redirect);
      } else {
        const user = await api.register({ email, password, name });
        setUser(user as any);
        toast.success('注册成功！');
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || '操作失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 w-full max-w-md shadow-sm">
      <h2 className="font-barlow text-2xl font-extrabold text-center mb-1">
        {isLogin ? '登录' : '注册'}
      </h2>
      <p className="text-sm text-muted text-center mb-7">
        {isLogin ? '登录您的账户' : '建立新账户'}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="login-name" className="block text-sm font-medium mb-1.5">姓名</label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1.5">电子邮箱</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium mb-1.5">密码</label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? '处理中...' : isLogin ? '登录' : '注册'}
        </Button>
      </form>

      <div className="relative text-center my-6">
        <div className="absolute left-0 top-1/2 right-0 h-px bg-gray-100" />
        <span className="relative bg-white px-3 text-xs text-muted">或</span>
      </div>

      <button
        onClick={() => { setIsLogin(!isLogin); setError(''); }}
        className="w-full text-sm text-blue hover:underline"
      >
        {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
      </button>

      <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-muted text-center">
        <p>测试账号：demo@qnap.com / demo123</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
      <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
