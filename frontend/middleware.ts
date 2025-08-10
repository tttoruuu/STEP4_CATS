import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なページのパス
const protectedPaths = [
  '/profile',  // プロフィール関連
  '/conversation',  // 会話練習
  '/counselor',  // AIカウンセラー
  '/compatibility',  // 相性診断
  '/mypage',  // マイページ
];

// 認証が不要なページのパス
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/login-chat',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 静的ファイルとNext.jsの内部ファイルを除外
  if (
    pathname.startsWith('/_next/') ||  // Next.js内部ファイル
    pathname.startsWith('/api/') ||    // APIルート
    pathname.includes('.') ||          // 静的ファイル（css, js, png等）
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // 一時的にミドルウェアを無効化して、ページレベルでの認証処理に統一
  console.log(`[Middleware] パス: ${pathname} - 認証チェックを一時的にスキップ（無限リダイレクト対策）`);
  return NextResponse.next();
  
  /*
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // トークンチェック（簡易的）
  const hasValidToken = !!token && token.length > 10;
  
  // 認証が必要なページへのアクセス
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  );
  
  // 認証が不要なページへのアクセス
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  );
  
  // ルートパス（/）の場合の特別な処理
  if (pathname === '/') {
    if (!hasValidToken) {
      console.log(`[Middleware] ルートパス認証なし → /auth/login`);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    console.log(`[Middleware] ルートパス認証済み → そのまま表示`);
    return NextResponse.next();
  }
  
  if (isProtectedPath && !hasValidToken) {
    // 認証が必要なページにトークンなしでアクセス → ログインページにリダイレクト
    console.log(`[Middleware] 認証エラー: ${pathname} → /auth/login`);
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // リダイレクト先を保存
    return NextResponse.redirect(loginUrl);
  }
  
  if (isPublicPath && hasValidToken && pathname !== '/') {
    // ログインページにトークンありでアクセス → ホームページにリダイレクト（ルートパス以外）
    console.log(`[Middleware] 既にログイン済み: ${pathname} → /`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  console.log(`[Middleware] 処理完了: ${pathname} (token: ${hasValidToken ? 'あり' : 'なし'})`);
  return NextResponse.next();
  */
}

export const config = {
  /*
   * matcher設定: /_next/static、/_next/image、favicon.ico、
   * その他の静的ファイルを除外してmiddlewareを実行
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images|audio|api).*)',
  ],
};