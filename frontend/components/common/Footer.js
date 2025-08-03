import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, User } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-sm py-4" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderTop: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)'}}>
      <div className="max-w-md mx-auto px-6">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center transition-colors">
            <HomeIcon className="w-6 h-6" style={{color: router.pathname === '/' ? 'var(--color-primary-500)' : 'var(--color-gray-400)'}} />
            <span className="text-xs mt-1" style={{color: router.pathname === '/' ? 'var(--color-primary-500)' : 'var(--color-gray-400)'}}>ホーム</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center transition-colors">
            <User className="w-6 h-6" style={{color: router.pathname.startsWith('/profile') ? 'var(--color-primary-500)' : 'var(--color-gray-400)'}} />
            <span className="text-xs mt-1" style={{color: router.pathname.startsWith('/profile') ? 'var(--color-primary-500)' : 'var(--color-gray-400)'}}>プロフィール</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 