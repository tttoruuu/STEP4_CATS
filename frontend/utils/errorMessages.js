// エラーメッセージの日本語マッピング
export const ERROR_MESSAGES = {
  // 認証関連エラー
  'Incorrect username or password': 'ユーザー名またはパスワードが間違っています。',
  'User not found': 'ユーザーが見つかりませんでした。',
  'Invalid credentials': '認証情報が無効です。',
  'Authentication failed': '認証に失敗しました。',
  'Token expired': 'セッションの有効期限が切れています。再度ログインしてください。',
  'Unauthorized access': 'アクセス権限がありません。',
  
  // ネットワーク関連エラー
  'Network Error': 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
  'Connection failed': '接続に失敗しました。しばらく時間をおいて再試行してください。',
  'Request timeout': 'リクエストがタイムアウトしました。もう一度お試しください。',
  'Server unavailable': 'サーバーが利用できません。しばらく時間をおいて再試行してください。',
  
  // バリデーション関連エラー
  'Invalid email format': 'メールアドレスの形式が正しくありません。',
  'Password too short': 'パスワードが短すぎます。8文字以上で入力してください。',
  'Required field missing': '必須項目が入力されていません。',
  'Username already exists': 'このユーザー名は既に使用されています。',
  'Email already exists': 'このメールアドレスは既に登録されています。',
  
  // 一般的なエラー
  'Internal server error': '内部サーバーエラーが発生しました。管理者にお問い合わせください。',
  'Bad request': '不正なリクエストです。入力内容を確認してください。',
  'Forbidden': 'この操作を実行する権限がありません。',
  'Not found': '要求されたリソースが見つかりませんでした。',
  'Service unavailable': 'サービスが一時的に利用できません。'
};

// エラータイプの定義
export const ERROR_TYPES = {
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// エラータイプの判定
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN_ERROR;
  
  // HTTPステータスコードによる判定
  if (error.response?.status) {
    const status = error.response.status;
    if (status === 401 || status === 403) return ERROR_TYPES.AUTHENTICATION_ERROR;
    if (status === 400 || status === 422) return ERROR_TYPES.VALIDATION_ERROR;
    if (status >= 500) return ERROR_TYPES.SERVER_ERROR;
  }
  
  // エラーコードによる判定
  if (error.code) {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      return ERROR_TYPES.NETWORK_ERROR;
    }
  }
  
  // エラーメッセージによる判定
  const message = error.message || error.detail || '';
  if (message.includes('Network') || message.includes('Connection')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }
  if (message.includes('password') || message.includes('credentials')) {
    return ERROR_TYPES.AUTHENTICATION_ERROR;
  }
  
  return ERROR_TYPES.UNKNOWN_ERROR;
};

// エラーメッセージの翻訳
export const translateErrorMessage = (error) => {
  if (!error) return 'エラーが発生しました。';
  
  // エラーメッセージの抽出
  const errorMessage = error.detail || error.message || error.toString();
  
  // 直接マッピングがある場合
  if (ERROR_MESSAGES[errorMessage]) {
    return ERROR_MESSAGES[errorMessage];
  }
  
  // 部分一致による翻訳
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (errorMessage.includes(key) || key.includes(errorMessage)) {
      return value;
    }
  }
  
  // エラータイプに基づいたデフォルトメッセージ
  const errorType = getErrorType(error);
  switch (errorType) {
    case ERROR_TYPES.AUTHENTICATION_ERROR:
      return 'ログインに失敗しました。ユーザー名とパスワードをご確認ください。';
    case ERROR_TYPES.NETWORK_ERROR:
      return 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。';
    case ERROR_TYPES.VALIDATION_ERROR:
      return '入力内容に問題があります。確認してもう一度お試しください。';
    case ERROR_TYPES.SERVER_ERROR:
      return 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください。';
    default:
      return 'エラーが発生しました。もう一度お試しください。';
  }
};

// エラーの詳細情報取得
export const getErrorDetails = (error) => {
  const type = getErrorType(error);
  const message = translateErrorMessage(error);
  
  return {
    type,
    message,
    originalError: error,
    showRetry: type === ERROR_TYPES.NETWORK_ERROR || type === ERROR_TYPES.SERVER_ERROR,
    severity: type === ERROR_TYPES.AUTHENTICATION_ERROR ? 'warning' : 'error'
  };
};