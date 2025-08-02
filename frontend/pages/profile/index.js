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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  );
}