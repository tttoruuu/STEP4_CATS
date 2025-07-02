import axios from 'axios';
// =====================================
// HTTPS強制変換ユーティリティ
// =====================================
// すべての環境で適切に動作するHTTPS変換関数
const ensureHttps = (url) => {
  // URLが存在しない場合はそのまま返す
  if (!url) {
    return url;
  }
  
  // ローカル開発環境の場合は変換しない
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    
    return url;
  }
  
  // 以下の条件で常にHTTPSに変換:
  // 1. 本番環境である
  // 2. ブラウザ環境である
  // 3. HTTPSページからアクセスしている
  const isProd = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  if ((isProd || isHttpsPage) && url.startsWith('http:')) {
    const httpsUrl = 'https:' + url.substring(5);
    
    return httpsUrl;
  }
  
  return url;
};
// =====================================
// グローバルAxiosインターセプター設定
// =====================================
// 本番環境では全てのリクエストでHTTPSを強制する
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  
  
  // リクエストインターセプター
  axios.interceptors.request.use(
    (config) => {
      // URL全体を変換
      if (config.url && config.url.startsWith('http:') && !config.url.includes('localhost')) {
        const originalUrl = config.url;
        config.url = config.url.replace(/^http:/i, 'https:');
        
      }
      
      // baseURLを変換
      if (config.baseURL && config.baseURL.startsWith('http:') && !config.baseURL.includes('localhost')) {
        const originalBaseUrl = config.baseURL;
        config.baseURL = config.baseURL.replace(/^http:/i, 'https:');
        
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  
}
// =====================================
// グローバルAxiosインターセプター設定 - 強化版
// =====================================
// すべての環境でHTTPSページからのアクセス時はHTTPSを強制
const setupAxiosInterceptors = () => {
  
  
  // すべてのリクエストに対してHTTPSを強制するインターセプター
  axios.interceptors.request.use(
    (config) => {
      const isBrowser = typeof window !== 'undefined';
      const isHttpsPage = isBrowser && window.location.protocol === 'https:';
      const isLocalhost = config.url?.includes('localhost') || config.url?.includes('127.0.0.1') ||
                         config.baseURL?.includes('localhost') || config.baseURL?.includes('127.0.0.1');
      
      // デバッグ情報（開発環境のみ）
      if (process.env.NODE_ENV === 'development') {
        console.log('[Interceptor] リクエスト検査:', {
          url: config.url,
          baseURL: config.baseURL,
          isHttpsPage,
          isLocalhost
        });
      }
      
      // HTTPS変換条件: HTTPSページからHTTPリソースへのアクセスでローカルではない場合
      if (isHttpsPage && !isLocalhost) {
        // URL全体を変換
        if (config.url && config.url.startsWith('http:')) {
          const originalUrl = config.url;
          config.url = config.url.replace(/^http:/i, 'https:');
          
        }
        
        // baseURLを変換
        if (config.baseURL && config.baseURL.startsWith('http:')) {
          const originalBaseUrl = config.baseURL;
          config.baseURL = config.baseURL.replace(/^http:/i, 'https:');
          
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Mixed Contentエラーを検出して再試行するレスポンスインターセプター
  axios.interceptors.response.use(
    response => response,
    async (error) => {
      // Mixed Contentエラーの検出
      const isMixedContentError = error.message && (
        error.message.includes('Mixed Content') || 
        error.message.includes('blocked') || 
        error.message.includes('insecure')
      );
      
      if (isMixedContentError && error.config && !error.config.__isRetryRequest) {
        
        
        // 再試行フラグを設定
        error.config.__isRetryRequest = true;
        
        // URLをHTTPSに変換
        if (error.config.url && error.config.url.startsWith('http:')) {
          error.config.url = error.config.url.replace(/^http:/i, 'https:');
        }
        
        // baseURLをHTTPSに変換
        if (error.config.baseURL && error.config.baseURL.startsWith('http:')) {
          error.config.baseURL = error.config.baseURL.replace(/^http:/i, 'https:');
        }
        
        console.log('[Interceptor] 再試行設定:', {
          url: error.config.url,
          baseURL: error.config.baseURL
        });
        
        // 変換したURLで再試行
        return axios(error.config);
      }
      
      return Promise.reject(error);
    }
  );
  
  
};
// インターセプターの初期化
if (typeof window !== 'undefined') {
  setupAxiosInterceptors();
}
// APIのベースURL - 環境に応じて適切に設定
const API_BASE_URL = (() => {
  // 1. サーバーサイドでの実行
  if (typeof window === 'undefined') {
    const url = process.env.INTERNAL_API_URL || 'http://backend:8000';
    
    return url;
  }
  
  // 2. クライアントサイドでの実行 - ウィンドウオブジェクトから直接取得を試みる
  // これによりNext.jsのgetInitialPropsで渡されたAPIUrlをキャプチャできる
  if (typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.apiUrl) {
    const apiUrl = window.__NEXT_DATA__.props.pageProps.apiUrl;
    
    return apiUrl;
  }
  
  // 3. 環境変数から取得
  if (process.env.NEXT_PUBLIC_API_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    return apiUrl;
  }
  
  // 4. ハードコードされた本番環境のURL (フォールバック)
  if (process.env.NODE_ENV === 'production') {
    const prodUrl = 'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io';
    
    return prodUrl;
  }
  
  // 5. デフォルト値
  
  return 'http://localhost:8000';
})();
// 本番環境ではHTTPSを強制する - 改善版
const FINAL_API_BASE_URL = (() => {
  // 変数の初期化
  let apiUrl = API_BASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isBrowser = typeof window !== 'undefined';
  const isHttpsPage = isBrowser && window.location.protocol === 'https:';
  const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
  
  console.log('[API URL初期化]', {
    original: apiUrl,
    isProduction,
    isBrowser,
    isHttpsPage,
    isLocalhost
  });
  
  // ローカルホスト以外で本番環境またはHTTPSページからアクセスしている場合
  if (!isLocalhost && (isProduction || isHttpsPage)) {
    // URLにプロトコルが含まれていない場合はhttpsを追加
    if (!apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
      
    }
    
    // httpをhttpsに変換
    if (apiUrl.startsWith('http:')) {
      apiUrl = 'https:' + apiUrl.substring(5);
      
    }
  }
  
  // さらにMixed Content対策: HTTPS環境からHTTPへのアクセスを試みていたら強制変換
  if (isBrowser && isHttpsPage && apiUrl.startsWith('http:')) {
    apiUrl = 'https:' + apiUrl.substring(5);
    
  }
  
  
  return apiUrl;
})();
// ローカルホスト判定のヘルパー関数
const isLocalEnvironment = () => {
  return typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
};
// 認証トークン関連のユーティリティ
const tokenUtils = {
  // トークンを取得
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  // トークンを保存
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },
  
  // トークンをクリア
  clearToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },
  
  // トークンの有効性チェック
  isTokenValid: () => {
    const token = tokenUtils.getToken();
    if (!token) return false;
    
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.exp) return false;
      
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      // 期限切れの5分前からは無効と判断
      const fiveMinutes = 5 * 60 * 1000;
      return expDate > new Date(now.getTime() + fiveMinutes);
    } catch (e) {
      console.error('トークン検証エラー:', e);
      return false;
    }
  },
  
  // ログインページへリダイレクト
  redirectToLogin: () => {
    if (typeof window !== 'undefined') {
      
      tokenUtils.clearToken();
      window.location.href = '/auth/login';
    }
  }
};
// リクエスト時のデバッグログ
const logRequest = (method, url) => {
  
  const token = tokenUtils.getToken();
  
  if (token) {
    
  }
};
// 認証済みAPIクライアントの作成
const getAuthenticatedClient = () => {
  const token = tokenUtils.getToken();
  
  // トークンの存在チェック
  if (!token) {
    console.error('トークンが存在しません');
    tokenUtils.redirectToLogin();
    throw new Error('認証が必要です');
  }
  // トークンの有効性チェック
  if (!tokenUtils.isTokenValid()) {
    console.error('トークンの有効期限が切れています');
    tokenUtils.redirectToLogin();
    throw new Error('トークンの有効期限が切れています');
  }
  // 本番環境では常にHTTPSを強制
  let finalApiUrl = FINAL_API_BASE_URL;
  
  // 環境を明示的に判断
  const isProduction = process.env.NODE_ENV === 'production';
  const isRunningInBrowser = typeof window !== 'undefined';
  const isHttpsPage = isRunningInBrowser && window.location.protocol === 'https:';
  const isLocal = isLocalEnvironment();
  // 明確なログメッセージ
  console.log('[認証クライアント] 環境設定:', {
    isProduction,
    isLocal,
    isHttpsPage,
    originalUrl: finalApiUrl
  });
  // 条件が明確な強制変換
  if ((isProduction || isHttpsPage) && !isLocal && finalApiUrl.startsWith('http:')) {
    finalApiUrl = finalApiUrl.replace(/^http:/i, 'https:');
    
  }
  
  // 最終的な安全対策: 強制変換ユーティリティを通す
  finalApiUrl = ensureHttps(finalApiUrl);
  
  // 環境チェック - Mixed Contentの警告
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && 
      finalApiUrl.startsWith('http:') && !finalApiUrl.includes('localhost')) {
    console.warn('セキュアなページから非セキュアなAPIを呼び出そうとしています。Mixed Contentエラーの可能性があります。');
  }
  const client = axios.create({
    baseURL: finalApiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    withCredentials: false, // CORSリクエストでCredentialsを送信しない
    timeout: 10000, // タイムアウトを10秒に短縮
    // リダイレクトを追跡しない設定を追加
    maxRedirects: 0, 
    validateStatus: function (status) {
      return status >= 200 && status < 300; // デフォルトは正常なステータスのみ
    }
  });
  // レスポンスインターセプターを追加
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // 認証エラーの処理
      if (error.response?.status === 401) {
        console.error('認証エラー: トークンが無効か期限切れです');
        tokenUtils.redirectToLogin();
        return Promise.reject(new Error('認証エラー: ログインが必要です'));
      }
      
      return Promise.reject(error);
    }
  );
  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      
      
      // リクエスト直前にトークンの有効性を再確認
      if (!tokenUtils.isTokenValid()) {
        console.error('リクエスト直前にトークンの有効期限切れを検出');
        tokenUtils.redirectToLogin();
        throw new Error('トークンの有効期限が切れています');
      }
      
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  return client;
};
// 認証関連のAPI
export const authAPI = {
  // ユーザー登録
  register: async (userData) => {
    try {
      
      
      
      // CORS対応リクエスト設定
      const response = await axios.post(`${FINAL_API_BASE_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Register error details:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // エラーメッセージをより詳細に表示
        if (error.response.data && typeof error.response.data === 'object') {
          console.error('詳細エラー情報:', JSON.stringify(error.response.data, null, 2));
          return Promise.reject(error.response.data);
        }
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログイン
  login: async (username, password) => {
    try {
      const response = await axios.post(`${FINAL_API_BASE_URL}/login`, { username, password }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const { access_token, token_type } = response.data;
      // トークンをローカルストレージに保存
      tokenUtils.setToken(access_token);
      return { access_token, token_type };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログアウト
  logout: () => {
    tokenUtils.clearToken();
  },
  
  // 現在のユーザー情報を取得
  getCurrentUser: async () => {
    try {
      
      
      // トークンの有効性を確認
      if (!tokenUtils.isTokenValid()) {
        console.error('トークンの有効期限が切れています');
        tokenUtils.redirectToLogin();
        throw new Error('認証が必要です');
      }
      
      const client = getAuthenticatedClient();
      const response = await client.get('/me');
      
      return response.data;
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      if (error.response?.status === 401) {
        // 認証エラーの場合、トークンを削除してリダイレクト
        tokenUtils.redirectToLogin();
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // トークンの有効性確認
  validateToken: () => {
    return tokenUtils.isTokenValid();
  }
};
// 会話相手関連のAPI
export const partnerAPI = {
  // 会話相手一覧を取得
  getPartners: async () => {
    try {
      logRequest('GET', '/conversation-partners');
      
      
      // APIの詳細情報
      
      
      
      
      
      // トークンの確認
      const token = localStorage.getItem('token');
      
      // トークンの先頭部分を表示（セキュリティのため全体は表示しない）
      if (token) {
        
        
        // JWTをデコードして内容確認（サブ、期限など）
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            
            
            if (payload.exp) {
              const expDate = new Date(payload.exp * 1000);
              const now = new Date();
              
              
              
              
              // 有効期限チェック
              if (expDate < now) {
                console.error('トークンの期限が切れています');
                localStorage.removeItem('token');
                if (typeof window !== 'undefined') {
                  window.location.href = '/auth/login';
                }
                throw new Error('トークンの期限が切れています');
              }
            }
          }
        } catch (e) {
          console.error('トークンデコードエラー:', e);
        }
      } else {
        // トークンがない場合
        console.error('トークンが存在しません');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        throw new Error('認証が必要です');
      }
      
      // 本番環境では常にHTTPSを使用する
      let apiBaseUrl = FINAL_API_BASE_URL;
      
      // 環境変数と状態をログ出力
      console.log('12. API URL詳細情報:', {
        original: apiBaseUrl,
        protocol: apiBaseUrl.startsWith('https:') ? 'HTTPS' : apiBaseUrl.startsWith('http:') ? 'HTTP' : '不明',
        isProduction: process.env.NODE_ENV === 'production',
        pageProtocol: typeof window !== 'undefined' ? window.location.protocol : '不明',
        isLocalEnv: isLocalEnvironment()
      });
      
      // 確実にHTTPSを使用
      if (!isLocalEnvironment() && apiBaseUrl.startsWith('http:')) {
        // 強制的にhttpsに変換
        const originalUrl = apiBaseUrl;
        apiBaseUrl = apiBaseUrl.replace(/^http:/i, 'https:');
        console.log('13. HTTPSに強制変換:', {
          before: originalUrl,
          after: apiBaseUrl
        });
      }
      
      // 最終的な安全対策: 強制変換ユーティリティを通す
      apiBaseUrl = ensureHttps(apiBaseUrl);
      
      
      // リクエスト詳細
      const fullUrl = `${apiBaseUrl}/conversation-partners/`;
      
      
      // CORS対応リクエスト設定
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      
      return response.data;
    } catch (error) {
      console.error('会話相手データ取得エラー:', error.message);
      
      if (error.response) {
        console.error('エラー詳細:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // 認証エラーの場合
        if (error.response.status === 401) {
          
          tokenUtils.redirectToLogin();
        }
      }
      
      // エラーの場合は空配列を返す
      return [];
    }
  },
  
  // 特定の会話相手の詳細を取得
  getPartner: async (partnerId) => {
    try {
      logRequest('GET', `/conversation-partners/${partnerId}`);
      
      
      const client = getAuthenticatedClient();
      const response = await client.get(`/conversation-partners/${partnerId}`);
      
      return response.data;
    } catch (error) {
      console.error('会話相手詳細取得エラー:', error.message);
      if (error.response) {
        console.error('エラー詳細:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // 認証エラーの場合
        if (error.response.status === 401) {
          
          tokenUtils.redirectToLogin();
        }
      }
      // エラーオブジェクトをスロー
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 会話相手を登録
  createPartner: async (partnerData) => {
    try {
      logRequest('POST', '/conversation-partners');
      
      
      // 環境チェック
      const isLocalhost = isLocalEnvironment();
      
      // 詳細なデバッグ情報をログ出力
      
      
      console.log('2. 環境情報:', {
        isProduction: process.env.NODE_ENV === 'production',
        isLocalhost,
        pageProtocol: typeof window !== 'undefined' ? window.location.protocol : '不明',
        apiProtocol: FINAL_API_BASE_URL.startsWith('https') ? 'HTTPS' : 'HTTP'
      });
      
      // --- 複雑なHTTPS強制ロジックを一時的にコメントアウト ---
      /* 
      // 本番環境では常にHTTPSを強制する
      let apiBaseUrl = FINAL_API_BASE_URL;
      
      // 確実にHTTPSを使用（ローカル環境以外）
      if (!isLocalhost && apiBaseUrl.startsWith('http:')) {
        const originalUrl = apiBaseUrl;
        apiBaseUrl = apiBaseUrl.replace(/^http:/i, 'https:');
        console.log('3. HTTPSに強制変換:', {
          before: originalUrl,
          after: apiBaseUrl
        });
      }
      
      // 最終的な安全対策: 強制変換ユーティリティを通す
      apiBaseUrl = ensureHttps(apiBaseUrl);
      
      // 最終的な安全対策: 強制変換ユーティリティを通す
      // 再度確認: URL文字列がHTTPS化されているか
      if (typeof window !== 'undefined' && 
          window.location.protocol === 'https:' && 
          apiBaseUrl.startsWith('http:')) {
        
        apiBaseUrl = apiBaseUrl.replace(/^http:/i, 'https:');
      }
      
      // 完全なURLをログ出力
      const fullUrl = `${apiBaseUrl}/conversation-partners`;
      
      */
      // --- 複雑なHTTPS強制ロジックここまで ---
      
      // --- axios直接呼び出しをコメントアウト --- 
      /*
      // 標準的な方法でリクエスト - 変換後のURLを使用
      const token = localStorage.getItem('token');
      
      if (token) {
        
      }
      
      // axios直接使用でエンドポイント完全指定
      const response_direct = await axios.post(`${apiBaseUrl}/conversation-partners`, partnerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      */
      // --- axios直接呼び出しここまで ---
      // getAuthenticatedClient を使用してリクエストを送信 (こちらをメインにする)
      const client = getAuthenticatedClient();
      
      
      // --- 追加ログ --- 
      
      if (!client.defaults.baseURL.startsWith('https')) {
        console.error('🚨 エラー: client の baseURL が HTTPS ではありません！');
      }
      // --- 追加ログここまで ---
      // response 変数の重複宣言を避ける
      const partnerResponse = await client.post('/conversation-partners', partnerData);
      
      
      return partnerResponse.data;
    } catch (error) {
      console.error('会話相手登録エラー:', error.message);
      
      // --- 複雑なエラーハンドリングと再試行ロジックを一時的にコメントアウト ---
      /*
      console.error('ネットワークエラー詳細:', error);
      
      // Mixed Contentエラーの可能性をチェック
      if (error.message && (
          error.message.includes('Mixed Content') || 
          error.message.includes('blocked') || 
          error.message.includes('insecure')
         )) {
        console.error('Mixed Contentエラーが検出されました。HTTPSリクエストに変換して再試行します。');
        
        try {
          // 直接HTTPSのURLを使って再試行
          const token = localStorage.getItem('token');
          // 確実にhttpsを使用
          const httpsUrl = FINAL_API_BASE_URL.replace(/^http:/i, 'https:');
          
          
          const httpsResponse = await axios.post(`${httpsUrl}/conversation-partners`, partnerData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          
          return httpsResponse.data;
        } catch (retryError) {
          console.error('HTTPS変換後も失敗:', retryError.message);
          // throw retryError; // 再試行失敗時は下のエラー処理に任せる
        }
      }
      // Mixed Contentエラーの可能性をチェック - より包括的な検出
      if (error.message) {
        // HTTPSページからHTTPリソースへのアクセスを試みた可能性
        console.error('エラーが発生したため、HTTPSでの再試行を実行します');
        
        try {
          // 常にHTTPSを使用して再試行
          const token = localStorage.getItem('token');
          // バックエンドURlを強制的にHTTPSに変換
          const httpsBaseUrl = FINAL_API_BASE_URL.replace(/^http:/i, 'https:');
          
          
          // 完全なURLをログ出力
          const httpsFullUrl = `${httpsBaseUrl}/conversation-partners`;
          
          
          const httpsRetryResponse = await axios.post(httpsFullUrl, partnerData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          
          return httpsRetryResponse.data;
        } catch (retryError) {
          console.error('再試行も失敗:', retryError.message);
          if (retryError.response) {
            console.error('再試行時のサーバーレスポンス:', {
              status: retryError.response.status,
              data: retryError.response.data
            });
          }
        }
      }
      // Mixed Content エラー発生時の再試行ロジック (getAuthenticatedClientを使用)
      if (error.message && (error.message.includes('Mixed Content') || error.message.includes('Network Error'))) {
        console.error('エラーを検出しました。getAuthenticatedClientを使用してHTTPSで再試行します。');
        try {
          const client = getAuthenticatedClient(); // 再度クライアント取得 (HTTPS強制含む)
          
          const retryResponse = await client.post('/conversation-partners', partnerData);
          
          return retryResponse.data;
        } catch (retryError) {
          console.error('再試行も失敗:', retryError.message);
          // 再試行失敗時のエラー情報を元のエラーに追加するなどの処理も検討
        }
      }
      */
      // --- 複雑なエラーハンドリングここまで ---
      
      // シンプルなエラーログ出力
      if (error.response) {
        console.error('エラー詳細:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('ネットワークリクエストエラー:', error.request);
      } else {
        console.error('リクエスト設定またはその他のエラー:', error.message);
      }
      
      // 各種エラーの詳細な処理 (必要に応じてコメント解除)
      /*
      if (error.response) {
        console.error('エラー詳細:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // 認証エラーの場合
        if (error.response.status === 401) {
          
          tokenUtils.redirectToLogin();
        }
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合（ネットワークエラーなど）
        console.error('ネットワークエラー詳細:', error.request);
        console.error('通信に失敗しました。インターネット接続を確認してください。');
      } else {
        // リクエスト設定中にエラーが発生した場合
        console.error('リクエスト設定エラー:', error.message);
      }
      */
      
      // エラーオブジェクトをスロー（UI側でエラー表示できるように）
      throw error.response?.data || { detail: '会話相手の登録中にエラーが発生しました: ' + error.message };
    }
  },
  
  // 会話相手を削除
  deletePartner: async (partnerId) => {
    try {
      logRequest('DELETE', `/conversation-partners/${partnerId}`);
      
      
      const client = getAuthenticatedClient();
      await client.delete(`/conversation-partners/${partnerId}`);
      
      return true;
    } catch (error) {
      console.error('会話相手削除エラー:', error.message);
      if (error.response) {
        console.error('エラー詳細:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // 認証エラーの場合
        if (error.response.status === 401) {
          
          tokenUtils.redirectToLogin();
        }
      }
      // エラーオブジェクトをスロー
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};
// 会話シミュレーション関連のAPI
export const conversationAPI = {
  // 会話のシミュレーション
  simulateConversation: async (partnerId, meetingCount, level, message, chatHistory = []) => {
    try {
      
      const client = getAuthenticatedClient();
      const response = await client.post('/conversation', {
        partnerId,
        meetingCount,
        level,
        message,
        chatHistory
      });
      
      return response.data;
    } catch (error) {
      console.error('会話シミュレーションエラー:', error);
      if (error.response) {
        console.error('エラーレスポンス:', error.response.data);
        console.error('エラーステータス:', error.response.status);
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 会話内容からフィードバックを生成
  generateFeedback: async (messages, partnerId, meetingCount) => {
    try {
      
      
      // メッセージ形式をAPIが期待する形式に変換
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // フィードバックAPIを呼び出す
      const client = getAuthenticatedClient();
      const response = await client.post('/conversation-feedback', {
        partnerId,
        meetingCount,
        chatHistory
      });
      
      
      return response.data;
    } catch (error) {
      console.error('フィードバック生成エラー:', error);
      // エラーを上位に伝播
      throw error.response?.data || { detail: 'フィードバック生成中にエラーが発生しました' };
    }
  },
};
// プロフィール関連のAPI
export const profileAPI = {
  // プロフィール画像のアップロード
  uploadProfileImage: async (file) => {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        throw { detail: '認証が必要です' };
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${FINAL_API_BASE_URL}/upload-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};
// サポート用ヘルパー関数
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${FINAL_API_BASE_URL}${imagePath}`;
};
// APIサービスを単一のオブジェクトとしてエクスポート
const apiService = {
  auth: authAPI,
  partners: partnerAPI,
  conversation: conversationAPI,
  profile: profileAPI,
  getImageUrl,
  baseUrl: FINAL_API_BASE_URL,  // APIのベースURLを公開
};
export default apiService; 