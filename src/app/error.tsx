'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">发生错误</h2>
        <p className="text-gray-500 text-sm mb-4">
          {error.message || '加载页面时发生未预期的错误'}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">错误代码: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-dark transition-colors"
          >
            重试
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            回首页
          </button>
        </div>
      </div>
    </div>
  );
}
