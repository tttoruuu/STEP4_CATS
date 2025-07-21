import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CompatibilityIndex() {
  const router = useRouter();

  useEffect(() => {
    // 既存の相性診断をMarriage MBTI testにリダイレクト
    router.replace('/marriage-mbti-test');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Marriage MBTI診断にリダイレクト中...</p>
      </div>
    </div>
  );
}