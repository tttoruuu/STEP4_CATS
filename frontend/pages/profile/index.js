import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    // /profile にアクセスしたら /profile/comprehensive にリダイレクト
    router.replace('/profile/comprehensive');
  }, [router]);

  // リダイレクト中のローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
      <div className="text-center">
        <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{border: '2px solid var(--color-primary-300)', borderTop: '2px solid var(--color-primary-500)'}}></div>
        <p style={{color: 'var(--color-gray-600)'}}>プロフィールを読み込んでいます...</p>
      </div>
    </div>
  );
}