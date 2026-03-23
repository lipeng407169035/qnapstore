'use client';

import { ToastContainer } from '@/components/ui/Toast';
import '@/components/ui/Toast.css';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
