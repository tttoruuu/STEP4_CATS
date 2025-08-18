import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from './common/Footer';

export default function Layout({ children, title = 'アプリケーション', hideFooter = false, hideHeader = false }) {
  const router = useRouter();
  
  // Footer表示対象ページの判定
  const showFooterPages = ['/', '/features', '/help'];
  const shouldShowFooter = !hideFooter && showFooterPages.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="会話練習アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow pb-16">
        {children}
      </main>

      {shouldShowFooter && <Footer />}
    </div>
  );
} 