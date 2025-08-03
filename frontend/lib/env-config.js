/**
 * 環境設定の自動判定システム
 * ローカル開発と本番環境を確実に区別し、正しいAPIエンドポイントを設定
 */

// 環境判定の優先順位
// 1. Container Apps環境（最優先）
// 2. 明示的な環境変数設定
// 3. ホスト名による自動判定
// 4. フォールバック値

const ENV_CONFIG = {
  // 本番環境のContainer Apps FQDN
  PRODUCTION_BACKEND_URL: 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io',
  PRODUCTION_FRONTEND_URL: 'https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io',
  
  // 開発環境のデフォルト
  DEVELOPMENT_BACKEND_URL: 'http://localhost:8000',
  DEVELOPMENT_FRONTEND_URL: 'http://localhost:3000',
  
  // Container Apps環境の識別子
  CONTAINER_APPS_DOMAIN: '.azurecontainerapps.io',
  AZURE_DOMAIN_PATTERNS: [
    '.azurecontainerapps.io',
    '.azurewebsites.net',
    '.azure.com'
  ]
};

/**
 * 現在の実行環境を判定
 * @returns {Object} 環境情報
 */
export const detectEnvironment = () => {
  const isServer = typeof window === 'undefined';
  const nodeEnv = process.env.NODE_ENV;
  
  let environment = {
    isServer,
    nodeEnv,
    isProduction: false,
    isContainerApps: false,
    isDevelopment: false,
    hostname: null,
    detectionMethod: 'unknown'
  };

  if (!isServer) {
    // クライアントサイド実行
    environment.hostname = window.location.hostname;
    
    // Container Apps環境の判定
    if (ENV_CONFIG.AZURE_DOMAIN_PATTERNS.some(pattern => 
        window.location.hostname.includes(pattern))) {
      environment.isContainerApps = true;
      environment.isProduction = true;
      environment.detectionMethod = 'container-apps-hostname';
    }
    // ローカル環境の判定
    else if (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1') {
      environment.isDevelopment = true;
      environment.detectionMethod = 'localhost-hostname';
    }
    // その他本番環境（カスタムドメインなど）
    else {
      environment.isProduction = true;
      environment.detectionMethod = 'external-hostname';
    }
  } else {
    // サーバーサイド実行
    // NODE_ENVベースの判定
    if (nodeEnv === 'production') {
      environment.isProduction = true;
      environment.detectionMethod = 'node-env-production';
    } else {
      environment.isDevelopment = true;
      environment.detectionMethod = 'node-env-development';
    }
  }

  return environment;
};

/**
 * 適切なAPIエンドポイントを取得
 * @returns {string} APIエンドポイントURL
 */
export const getApiEndpoint = () => {
  const env = detectEnvironment();
  
  // 1. 明示的な環境変数設定（最優先）
  const explicitApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitApiUrl && explicitApiUrl !== 'undefined' && explicitApiUrl.trim() !== '') {
    // HTTPSの強制（本番環境のみ）
    if (env.isProduction && explicitApiUrl.startsWith('http:') && 
        !explicitApiUrl.includes('localhost')) {
      const httpsUrl = explicitApiUrl.replace(/^http:/, 'https:');
      console.log('[ENV] 環境変数のAPIエンドポイントをHTTPSに変換:', {
        original: explicitApiUrl,
        converted: httpsUrl
      });
      return httpsUrl;
    }
    console.log('[ENV] 明示的な環境変数を使用:', explicitApiUrl);
    return explicitApiUrl;
  }

  // 2. 環境ベースの自動選択
  let apiUrl;
  if (env.isProduction) {
    apiUrl = ENV_CONFIG.PRODUCTION_BACKEND_URL;
    console.log('[ENV] 本番環境API使用:', apiUrl);
  } else {
    apiUrl = ENV_CONFIG.DEVELOPMENT_BACKEND_URL;
    console.log('[ENV] 開発環境API使用:', apiUrl);
  }

  console.log('[ENV] 環境判定結果:', {
    ...env,
    selectedApiUrl: apiUrl
  });

  return apiUrl;
};

/**
 * 環境設定の検証
 * @returns {Object} 検証結果
 */
export const validateEnvironment = () => {
  const env = detectEnvironment();
  const apiUrl = getApiEndpoint();
  
  const validation = {
    isValid: true,
    warnings: [],
    errors: [],
    environment: env,
    apiUrl
  };

  // Container Apps環境でのHTTPS確認
  if (env.isContainerApps && apiUrl.startsWith('http:')) {
    validation.errors.push('Container Apps環境でHTTPエンドポイントが設定されています');
    validation.isValid = false;
  }

  // Mixed Content警告
  if (!env.isServer && window.location.protocol === 'https:' && 
      apiUrl.startsWith('http:') && !apiUrl.includes('localhost')) {
    validation.warnings.push('HTTPS環境からHTTPエンドポイントへのアクセスは失敗する可能性があります');
  }

  // 開発環境での本番API使用警告
  if (env.isDevelopment && apiUrl.includes('.azurecontainerapps.io')) {
    validation.warnings.push('開発環境で本番APIを使用しています');
  }

  // 本番環境でのローカルAPI使用エラー
  if (env.isProduction && apiUrl.includes('localhost')) {
    validation.errors.push('本番環境でローカルAPIエンドポイントが設定されています');
    validation.isValid = false;
  }

  return validation;
};

/**
 * 環境設定をコンソールに出力（開発用）
 */
export const logEnvironmentInfo = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const validation = validateEnvironment();
    
    console.group('🔧 環境設定情報');
    console.log('環境:', validation.environment);
    console.log('API URL:', validation.apiUrl);
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ 警告:', validation.warnings);
    }
    
    if (validation.errors.length > 0) {
      console.error('❌ エラー:', validation.errors);
    }
    
    if (validation.isValid) {
      console.log('✅ 環境設定は有効です');
    } else {
      console.error('❌ 環境設定に問題があります');
    }
    
    console.groupEnd();
  }
};

// デフォルトエクスポート
export default {
  detectEnvironment,
  getApiEndpoint,
  validateEnvironment,
  logEnvironmentInfo,
  ENV_CONFIG
};