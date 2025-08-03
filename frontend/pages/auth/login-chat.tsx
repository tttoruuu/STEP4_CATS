'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginChatPage() {
  const router = useRouter();

  useEffect(() => {
    // 新しいログインページにリダイレクト
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">ログインページに移動中...</p>
      </div>
    </div>
  );
}