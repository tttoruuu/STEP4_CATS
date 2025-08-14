import "../styles/globals.css";
import getConfig from 'next/config';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // 認証ガード（改善版）
  useEffect(() => {
    // 初回マウント時のみ実行（認証チェック）
    if (typeof window === 'undefined') return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      console.log('API URL configured:', apiUrl);
      
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      console.log('初回認証チェック:', { token: !!token, path: currentPath });
      
      const protectedPaths = ['/profile', '/conversation', '/counselor', '/compatibility', '/mypage'];
      const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/login-chat'];
      
      const isProtectedPath = protectedPaths.some(path => 
        currentPath === path || currentPath.startsWith(path)
      );
      const isPublicPath = publicPaths.some(path => 
        currentPath === path || currentPath.startsWith(path)
      );
      
      const hasValidToken = token && token.length > 10;
      
      if (isProtectedPath && !hasValidToken) {
        console.log('初回認証エラー: ログイン画面にリダイレクト');
        router.replace('/auth/login');
      } else if (isPublicPath && hasValidToken) {
        console.log('初回：既にログイン済み - ホーム画面にリダイレクト');
        router.replace('/');
      }
    } catch (error) {
      console.error('初回認証チェックエラー:', error);
    }
  }, []); // 初回マウント時のみ
  // 環境変数設定（防御的）
  const { publicRuntimeConfig } = getConfig() || {};
  
  // API URLを安全に設定
  const apiUrl = (() => {
    try {
      // 環境変数の安全な取得
      const envApiUrl = typeof process !== 'undefined' && process.env
                        ? process.env.NEXT_PUBLIC_API_URL 
                        : null;
      const configApiUrl = publicRuntimeConfig?.apiUrl;
      const nodeEnv = typeof process !== 'undefined' && process.env
                      ? process.env.NODE_ENV 
                      : 'development';
      
      console.log('環境情報:', {
        NODE_ENV: nodeEnv,
        envApiUrl: envApiUrl ? 'set' : 'not set',
        configApiUrl: configApiUrl ? 'set' : 'not set'
      });
      
      // 1. 開発環境設定
      if (nodeEnv !== 'production') {
        return configApiUrl || envApiUrl || 'http://localhost:8000';
      }
      
      // 2. 本番環境設定
      const productionUrl = configApiUrl || 
                           envApiUrl || 
                           'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io';
      
      console.log('本番APIのURL設定済み');
      return productionUrl;
    } catch (error) {
      console.error('API URL設定中にエラー:', error);
      // フォールバック
      return 'http://localhost:8000';
    }
  })();
  
  // propsに安全に追加
  if (pageProps) {
    pageProps.apiUrl = apiUrl;
  }
  
  // 開発用ログ（ブラウザ環境でのみ）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('API URL from _app.js:', apiUrl);
    }
  }, [apiUrl]);
  
  return <Component {...pageProps} />;
}
