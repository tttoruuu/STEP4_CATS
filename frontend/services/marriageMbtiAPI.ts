/**
 * Marriage MBTI+ API通信サービス
 */

// 型定義
export interface MBTIQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: string;
}

export interface MarriageQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'communication' | 'lifestyle' | 'values' | 'future' | 'intimacy';
}

export interface MBTIAnswer {
  questionId: number;
  answer: 'A' | 'B';
}

export interface MarriageAnswer {
  questionId: number;
  answer: number; // 1-5 scale
}

export interface MBTIScore {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MarriageScore {
  communication: number;
  lifestyle: number;
  values: number;
  future: number;
  intimacy: number;
}

export interface CompatibleType {
  type: string;
  reason: string;
}

export interface PersonalizedAdvice {
  category: string;
  content: string;
}

export interface MarriageMBTIResult {
  mbtiType: string;
  typeName: string;
  description: string;
  loveCharacteristics: string[];
  compatibleTypes: CompatibleType[];
  advice: PersonalizedAdvice[];
  mbtiScores: MBTIScore;
  marriageScores: MarriageScore;
}

export interface MarriageMBTIAnswers {
  mbtiAnswers: MBTIAnswer[];
  marriageAnswers: MarriageAnswer[];
}

export interface QuestionsResponse {
  mbtiQuestions: MBTIQuestion[];
  marriageQuestions: MarriageQuestion[];
  totalMBTIQuestions: number;
  totalMarriageQuestions: number;
}

export interface APIError {
  error: string;
  message: string;
}

// API設定 - 統合バックエンド（8000ポート）
const API_BASE_URL = (() => {
  // 1. サーバーサイドでの実行
  if (typeof window === 'undefined') {
    const url = process.env.INTERNAL_API_URL || 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io';
    return url;
  }
  
  // 2. クライアントサイドでの実行 - ウィンドウオブジェクトから直接取得を試みる
  if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.props?.pageProps?.apiUrl) {
    const apiUrl = (window as any).__NEXT_DATA__.props.pageProps.apiUrl;
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
  
  // 5. 開発環境用 - 統合バックエンドポート
  return 'http://localhost:8000';
})();

// 本番環境ではHTTPSを強制する - personalityAPI.tsと同じロジック
const FINAL_API_BASE_URL = (() => {
  let apiUrl = API_BASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isBrowser = typeof window !== 'undefined';
  const isHttpsPage = isBrowser && window.location.protocol === 'https:';
  const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
  
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

const MARRIAGE_MBTI_API_BASE = `${FINAL_API_BASE_URL}/api/marriage-mbti`;

// エラーハンドリング用のカスタムエラークラス
export class MarriageMBTIAPIError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'MarriageMBTIAPIError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * APIリクエスト用のヘルパー関数
 */
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = 'HTTP_ERROR';

      try {
        const errorData: APIError = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorCode = errorData.error || errorCode;
      } catch {
        // JSONパースに失敗した場合はデフォルトメッセージを使用
      }

      throw new MarriageMBTIAPIError(errorMessage, errorCode, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof MarriageMBTIAPIError) {
      throw error;
    }

    // ネットワークエラーなど
    throw new MarriageMBTIAPIError(
      'ネットワークエラーが発生しました。インターネット接続を確認してください。',
      'NETWORK_ERROR',
      0
    );
  }
}

/**
 * Marriage MBTI+ の質問一覧を取得
 */
export async function getMarriageMBTIQuestions(): Promise<QuestionsResponse> {
  return apiRequest<QuestionsResponse>(`${MARRIAGE_MBTI_API_BASE}/questions`);
}

/**
 * Marriage MBTI+ の分析を実行
 */
export async function analyzeMarriageMBTI(
  mbtiAnswers: MBTIAnswer[],
  marriageAnswers: MarriageAnswer[]
): Promise<MarriageMBTIResult> {
  const requestData: MarriageMBTIAnswers = { 
    mbtiAnswers, 
    marriageAnswers 
  };

  return apiRequest<MarriageMBTIResult>(`${MARRIAGE_MBTI_API_BASE}/analyze`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * MBTI タイプ一覧を取得
 */
export async function getMBTITypes(): Promise<{
  mbtiTypes: Record<string, {
    name: string;
    description: string;
    loveCharacteristics: string[];
    compatibleTypes: string[];
  }>;
  totalTypes: number;
}> {
  return apiRequest(`${MARRIAGE_MBTI_API_BASE}/mbti-types`);
}

/**
 * 結婚観カテゴリ一覧を取得
 */
export async function getMarriageCategories(): Promise<{
  categories: Record<string, string>;
  totalCategories: number;
}> {
  return apiRequest(`${MARRIAGE_MBTI_API_BASE}/marriage-categories`);
}

/**
 * APIヘルスチェック
 */
export async function healthCheck(): Promise<{
  status: string;
  service: string;
  version: string;
  features: string[];
}> {
  return apiRequest(`${MARRIAGE_MBTI_API_BASE}/health`);
}

/**
 * 回答データのバリデーション
 */
export function validateMBTIAnswers(answers: MBTIAnswer[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 必要な回答数をチェック
  if (answers.length !== 16) {
    errors.push('MBTI回答は16問必須です');
  }

  // 回答の内容をチェック
  answers.forEach((answer, index) => {
    if (answer.questionId !== index) {
      errors.push(`MBTI質問ID順序が不正です: 期待値${index}, 実際値${answer.questionId}`);
    }

    if (!['A', 'B'].includes(answer.answer)) {
      errors.push(`MBTI回答は'A'または'B'である必要があります: ${answer.answer}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 結婚観回答データのバリデーション
 */
export function validateMarriageAnswers(answers: MarriageAnswer[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 必要な回答数をチェック
  if (answers.length !== 10) {
    errors.push('結婚観回答は10問必須です');
  }

  // 回答の内容をチェック
  answers.forEach((answer, index) => {
    if (answer.questionId !== index) {
      errors.push(`結婚観質問ID順序が不正です: 期待値${index}, 実際値${answer.questionId}`);
    }

    if (!Number.isInteger(answer.answer) || answer.answer < 1 || answer.answer > 5) {
      errors.push(`結婚観回答は1-5の範囲である必要があります: ${answer.answer}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * ローカルストレージへの結果保存
 */
export function saveMarriageMBTIResultToLocal(result: MarriageMBTIResult): void {
  try {
    const resultWithTimestamp = {
      ...result,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('marriage_mbti_result', JSON.stringify(resultWithTimestamp));
  } catch (error) {
    console.warn('Marriage MBTI+ 結果の保存に失敗しました:', error);
  }
}

/**
 * ローカルストレージから結果を取得
 */
export function getMarriageMBTIResultFromLocal(): (MarriageMBTIResult & { timestamp: string }) | null {
  try {
    const stored = localStorage.getItem('marriage_mbti_result');
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('保存されたMarriage MBTI+ 結果の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * ローカルストレージから結果を削除
 */
export function clearMarriageMBTIResultFromLocal(): void {
  try {
    localStorage.removeItem('marriage_mbti_result');
  } catch (error) {
    console.warn('Marriage MBTI+ 結果の削除に失敗しました:', error);
  }
}

/**
 * 回答の進捗をローカルストレージに保存
 */
export function saveMarriageMBTIProgressToLocal(
  mbtiAnswers: MBTIAnswer[], 
  marriageAnswers: MarriageAnswer[], 
  currentStep: string,
  currentQuestionIndex: number
): void {
  try {
    const progress = {
      mbtiAnswers,
      marriageAnswers,
      currentStep,
      currentQuestionIndex,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('marriage_mbti_progress', JSON.stringify(progress));
  } catch (error) {
    console.warn('Marriage MBTI+ 進捗の保存に失敗しました:', error);
  }
}

/**
 * ローカルストレージから進捗を取得
 */
export function getMarriageMBTIProgressFromLocal(): {
  mbtiAnswers: MBTIAnswer[];
  marriageAnswers: MarriageAnswer[];
  currentStep: string;
  currentQuestionIndex: number;
  timestamp: string;
} | null {
  try {
    const stored = localStorage.getItem('marriage_mbti_progress');
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('保存されたMarriage MBTI+ 進捗の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * 進捗をローカルストレージから削除
 */
export function clearMarriageMBTIProgressFromLocal(): void {
  try {
    localStorage.removeItem('marriage_mbti_progress');
  } catch (error) {
    console.warn('Marriage MBTI+ 進捗の削除に失敗しました:', error);
  }
}