import "../styles/globals.css";
import getConfig from 'next/config';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // 🚨 LOGIN FIX v2 🚨
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      console.log('🚨 LOGIN FIX v2: Token check', { token: !!token, path: currentPath });
      
      // ホーム画面でトークンがない場合のみリダイレクト
      if (currentPath === '/' && !token) {
        console.log('🚨 LOGIN FIX v2: No token on home, redirecting...');
        router.replace('/auth/login');
      }
      // ログインページでトークンがある場合はホームに遷移
      else if ((currentPath === '/auth/login' || currentPath === '/auth/login-chat') && token) {
        console.log('🚨 LOGIN FIX v2: Token found on login page, redirecting to home...');
        router.replace('/');
      }
    }
  }, [router]);
  // 環境変数をクライアントサイドで利用できるようにする
  const { publicRuntimeConfig } = getConfig() || {};
  
  // API URLをpropsに追加 (環境に応じて適切に設定)
  const apiUrl = (() => {
    // 環境変数の取得ロジックをより明確に
    const envApiUrl = typeof process !== 'undefined' 
                      ? process.env.NEXT_PUBLIC_API_URL 
                      : null;
    const configApiUrl = publicRuntimeConfig?.apiUrl;
    
    console.log('環境情報:', {
      NODE_ENV: process.env.NODE_ENV,
      envApiUrl,
      configApiUrl
    });
    
    // 1. 開発環境設定
    if (process.env.NODE_ENV !== 'production') {
      console.log('開発環境を使用します');
      return configApiUrl || envApiUrl || 'http://localhost:8000';
    }
    
    // 2. 本番環境設定
    console.log('本番環境を使用します');
    const productionUrl = configApiUrl || 
                         envApiUrl || 
                         'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io';
    
    console.log('本番APIのURL:', productionUrl);
    return productionUrl;
  })();
  
  pageProps.apiUrl = apiUrl;
  
  // 開発用ログ
  if (typeof window !== 'undefined') {
    console.log('API URL from _app.js:', pageProps.apiUrl);
  }
  
  return <Component {...pageProps} />;
}
