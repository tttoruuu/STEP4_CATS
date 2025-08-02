/**
 * 性格診断API通信サービス
 */

// 型定義
export interface Question {
  id: number;
  question: string;
  dimension: string;
  options: Array<{
    text: string;
    score: number;
  }>;
}

export interface PersonalityScore {
  外向性: number;
  コミュニケーション: number;
  感情安定性: number;
  意思決定: number;
  共感性: number;
  コミット力: number;
}

export interface PersonalityDescription {
  title: string;
  summary: string;
  strengths: string;
  marriage_advice: string;
  growth_points: string;
}

export interface PersonalityTestResult {
  personality_type: string;
  scores: PersonalityScore;
  description: PersonalityDescription;
  compatible_types: string[];
}

export interface PersonalityTestAnswers {
  answers: Record<number, number>;
}

export interface QuestionsResponse {
  questions: Question[];
  total_questions: number;
}

export interface APIError {
  error: string;
  message: string;
}

// API設定 - api.jsの完全な実装を使用
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
  
  // 5. デフォルト値
  return 'http://localhost:8000';
})();

// 本番環境ではHTTPSを強制する - api.jsと同じロジック
const FINAL_API_BASE_URL = (() => {
  // 変数の初期化
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

const PERSONALITY_API_BASE = `${FINAL_API_BASE_URL}/api/personality`;

// エラーハンドリング用のカスタムエラークラス
export class PersonalityAPIError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'PersonalityAPIError';
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
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.error || errorCode;
      } catch {
        // JSONパースに失敗した場合はデフォルトメッセージを使用
      }

      throw new PersonalityAPIError(errorMessage, errorCode, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof PersonalityAPIError) {
      throw error;
    }

    // ネットワークエラーなど
    throw new PersonalityAPIError(
      'ネットワークエラーが発生しました。インターネット接続を確認してください。',
      'NETWORK_ERROR',
      0
    );
  }
}

/**
 * 性格診断の質問一覧を取得
 */
export async function getPersonalityQuestions(): Promise<QuestionsResponse> {
  return apiRequest<QuestionsResponse>(`${PERSONALITY_API_BASE}/questions`);
}

/**
 * 性格診断の分析を実行
 */
export async function analyzePersonality(
  answers: Record<number, number>
): Promise<PersonalityTestResult> {
  const requestData: PersonalityTestAnswers = { answers };

  return apiRequest<PersonalityTestResult>(`${PERSONALITY_API_BASE}/analyze`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * 利用可能な性格タイプ一覧を取得
 */
export async function getPersonalityTypes(): Promise<{
  personality_types: Record<string, {
    title: string;
    summary: string;
    compatible_types: string[];
  }>;
  total_types: number;
}> {
  return apiRequest(`${PERSONALITY_API_BASE}/types`);
}

/**
 * 回答データのバリデーション
 */
export function validateAnswers(
  answers: Record<number, number>,
  totalQuestions: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 必要な質問数をチェック
  if (Object.keys(answers).length < totalQuestions) {
    errors.push('全ての質問に回答してください');
  }

  // 回答の値をチェック
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const qId = parseInt(questionId);
    
    if (isNaN(qId) || qId < 1) {
      errors.push(`無効な質問ID: ${questionId}`);
    }

    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex > 3) {
      errors.push(`質問${questionId}の回答が無効です`);
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
export function saveResultToLocal(result: PersonalityTestResult): void {
  try {
    const resultWithTimestamp = {
      ...result,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('personality_test_result', JSON.stringify(resultWithTimestamp));
  } catch (error) {
    console.warn('結果の保存に失敗しました:', error);
  }
}

/**
 * ローカルストレージから結果を取得
 */
export function getResultFromLocal(): (PersonalityTestResult & { timestamp: string }) | null {
  try {
    const stored = localStorage.getItem('personality_test_result');
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('保存された結果の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * ローカルストレージから結果を削除
 */
export function clearResultFromLocal(): void {
  try {
    localStorage.removeItem('personality_test_result');
  } catch (error) {
    console.warn('結果の削除に失敗しました:', error);
  }
}

/**
 * 回答の進捗をローカルストレージに保存
 */
export function saveProgressToLocal(answers: Record<number, number>): void {
  try {
    localStorage.setItem('personality_test_progress', JSON.stringify(answers));
  } catch (error) {
    console.warn('進捗の保存に失敗しました:', error);
  }
}

/**
 * ローカルストレージから進捗を取得
 */
export function getProgressFromLocal(): Record<number, number> | null {
  try {
    const stored = localStorage.getItem('personality_test_progress');
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('保存された進捗の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * 進捗をローカルストレージから削除
 */
export function clearProgressFromLocal(): void {
  try {
    localStorage.removeItem('personality_test_progress');
  } catch (error) {
    console.warn('進捗の削除に失敗しました:', error);
  }
}