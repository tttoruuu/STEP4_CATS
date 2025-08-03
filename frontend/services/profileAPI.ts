import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface MBTIResult {
  mbti_type?: string;
  type_name?: string;
  description?: string;
}

export interface ComprehensiveProfile {
  user_id: number;
  name: string;
  age?: number;
  birth_date?: string;
  konkatsu_experience: string;
  occupation?: string;
  birthplace?: string;
  residence?: string;
  hobbies: string[];
  weekend_activities?: string;
  mbti?: MBTIResult;
  profile_image_url?: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileAPIResponse {
  success: boolean;
  profile: ComprehensiveProfile;
}

export interface MBTIHistoryItem {
  id: number;
  mbti_type?: string;
  type_name?: string;
  created_at: string;
  conversation_title?: string;
}

export interface MBTIHistoryResponse {
  success: boolean;
  history: MBTIHistoryItem[];
}

// 認証トークンを取得
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// APIリクエスト用のヘッダー
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 統合プロフィール情報を取得
 */
export const getComprehensiveProfile = async (): Promise<ComprehensiveProfile> => {
  try {
    const response = await axios.get<ProfileAPIResponse>(
      `${API_BASE_URL}/test-profile`,
      {
        timeout: 10000,
      }
    );

    if (!response.data.success) {
      throw new Error('プロフィール取得に失敗しました');
    }

    return response.data.profile;
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('認証が必要です。再度ログインしてください。');
      }
      if (error.response?.status === 404) {
        throw new Error('プロフィールが見つかりません。');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('通信がタイムアウトしました。');
      }
    }
    
    throw new Error('プロフィールの取得に失敗しました。');
  }
};

/**
 * MBTI診断履歴を取得
 */
export const getMBTIHistory = async (): Promise<MBTIHistoryItem[]> => {
  try {
    const response = await axios.get<MBTIHistoryResponse>(
      `${API_BASE_URL}/api/profile/mbti-history`,
      {
        headers: getAuthHeaders(),
        timeout: 8000,
      }
    );

    if (!response.data.success) {
      throw new Error('MBTI履歴取得に失敗しました');
    }

    return response.data.history;
  } catch (error) {
    console.error('MBTI履歴取得エラー:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('認証が必要です。');
      }
    }
    
    throw new Error('MBTI診断履歴の取得に失敗しました。');
  }
};

/**
 * 婚活経験の表示用文字列を取得
 */
export const getKonkatsuExperienceDisplay = (experience: string): string => {
  switch (experience) {
    case '初心者':
    case 'beginner':
      return '初心者';
    case '経験あり':
    case 'experienced':
      return '経験あり';
    case '再チャレンジ':
    case 'rechallenge':
      return '再チャレンジ';
    default:
      return '未設定';
  }
};

/**
 * 婚活経験の色を取得
 */
export const getKonkatsuExperienceColor = (experience: string): string => {
  switch (experience) {
    case '初心者':
    case 'beginner':
      return '#10B981'; // Green
    case '経験あり':
    case 'experienced':
      return '#3B82F6'; // Blue
    case '再チャレンジ':
    case 'rechallenge':
      return '#F59E0B'; // Orange
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * MBTIタイプの日本語名を取得
 */
export const getMBTITypeName = (mbtiType?: string): string => {
  if (!mbtiType) return '未診断';
  
  const typeNames: Record<string, string> = {
    'INTJ': '建築家',
    'INTP': '論理学者',
    'ENTJ': '指揮官',
    'ENTP': '討論者',
    'INFJ': '提唱者',
    'INFP': '仲介者',
    'ENFJ': '主人公',
    'ENFP': '運動家',
    'ISTJ': '管理者',
    'ISFJ': '擁護者',
    'ESTJ': '幹部',
    'ESFJ': '領事',
    'ISTP': '巨匠',
    'ISFP': '冒険家',
    'ESTP': '起業家',
    'ESFP': 'エンターテイナー',
  };
  
  // "-T"や"-A"を除去してベースタイプを取得
  const baseType = mbtiType.replace(/-[AT]$/, '');
  return typeNames[baseType] || mbtiType;
};

export default {
  getComprehensiveProfile,
  getMBTIHistory,
  getKonkatsuExperienceDisplay,
  getKonkatsuExperienceColor,
  getMBTITypeName,
};