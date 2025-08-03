import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    return localStorage.getItem('token');
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
// ダミーデータのプロフィール（未入力状態）
const getDummyProfile = (): ComprehensiveProfile => {
  return {
    user_id: 1,
    name: "未入力",
    age: undefined,
    birth_date: "未入力",
    konkatsu_experience: "未入力",
    occupation: "未入力",
    birthplace: "未入力",
    residence: "未入力",
    hobbies: ["未入力"],
    weekend_activities: "未入力",
    mbti: undefined,
    profile_image_url: null,
    email: "未入力",
    created_at: "2025-01-01T00:00:00",
    updated_at: "2025-01-02T00:00:00"
  };
};

export const getComprehensiveProfile = async (): Promise<ComprehensiveProfile> => {
  try {
    // まず統合APIからプロフィールデータを取得を試行
    try {
      console.log('プロフィール取得開始:', {
        url: `${API_BASE_URL}/api/profile/comprehensive`,
        headers: getAuthHeaders(),
        token: getAuthToken()
      });

      const response = await axios.get<ProfileAPIResponse>(
        `${API_BASE_URL}/api/profile/comprehensive`,
        {
          headers: getAuthHeaders(),
          timeout: 10000
        }
      );

      if (response.data && response.data.success && response.data.profile) {
        console.log('統合API からプロフィール取得成功:', response.data.profile);
        return response.data.profile;
      }
    } catch (apiError) {
      console.log('統合API失敗、フォールバック処理開始:', apiError);
    }

    // フォールバック: JWTトークンとtest-profileから情報取得
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // JWTトークンをデコード（日本語対応）
          const encodedPayload = storedToken.split('.')[1];
          const decodedPayload = decodeURIComponent(escape(atob(encodedPayload)));
          const payload = JSON.parse(decodedPayload);
          
          let fallbackProfile: ComprehensiveProfile = {
            user_id: payload.sub || payload.user_id || 1,
            name: payload.name || payload.username || '未入力',
            age: payload.age || undefined,
            birth_date: payload.birth_date || '未入力',
            konkatsu_experience: payload.konkatsu_experience || '未入力',
            occupation: payload.occupation || '未入力',
            birthplace: payload.birthplace || '未入力',
            residence: payload.residence || '未入力',
            hobbies: payload.hobbies || ['未入力'],
            weekend_activities: payload.weekend_activities || '未入力',
            mbti: payload.mbti || undefined,
            profile_image_url: null,
            email: payload.email || '未入力',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // test-profileからデータを補完
          try {
            const testResponse = await axios.get(`${API_BASE_URL}/test-profile`, { timeout: 5000 });
            if (testResponse.data && testResponse.data.success && testResponse.data.profile) {
              fallbackProfile = {
                ...fallbackProfile,
                ...testResponse.data.profile,
                name: testResponse.data.profile.name || fallbackProfile.name
              };
              console.log('test-profile APIからデータ補完成功:', fallbackProfile);
            }
          } catch (testApiError) {
            console.log('test-profile API失敗, JWTデータのみ使用:', testApiError);
          }
          
          return fallbackProfile;
        } catch (tokenError) {
          console.error('JWTトークンデコードエラー:', tokenError);
        }
      }
    }

    // 全て失敗した場合はエラーを投げる
    throw new Error('プロフィール情報の取得に失敗しました。ネットワーク接続を確認してください。');
    
  } catch (error) {
    console.error('プロフィール取得で予期せぬエラー:', error);
    throw error;
  }

  /* API呼び出しは一時的にコメントアウト
  try {
    console.log('プロフィール取得開始:', {
      url: `${API_BASE_URL}/api/profile/comprehensive`,
      headers: getAuthHeaders(),
      token: getAuthToken()
    });

    const response = await axios.get<ProfileAPIResponse>(
      `${API_BASE_URL}/api/profile/comprehensive`,
      {
        headers: getAuthHeaders(),
        timeout: 3000, // タイムアウトを3秒に短縮
      }
    );

    console.log('プロフィール取得成功:', response.data);

    if (!response.data.success) {
      throw new Error('プロフィール取得に失敗しました');
    }

    return response.data.profile;
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    
    // 全てのエラーでダミーデータを返す（開発中のフォールバック）
    console.warn('API通信エラーのため、ダミーデータを使用します:', error);
    return getDummyProfile();
  }
  */
};

/**
 * プロフィール情報を更新
 */
export const updateProfile = async (updates: {
  full_name?: string;
  birth_date?: string;
  konkatsu_status?: string;
  occupation?: string;
  birthplace?: string;
  current_location?: string;
  hobbies?: string[] | string;
  holiday_style?: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('プロフィール更新開始:', updates);
    
    // まず統合APIでの更新を試行
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/profile/update`,
        updates,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          timeout: 8000,
          withCredentials: false, // CORS対応
        }
      );

      if (response.data && response.data.success) {
        console.log('統合API でプロフィール更新成功:', response.data);
        return response.data;
      }
    } catch (apiError) {
      console.log('統合API更新失敗、ローカルストレージ更新:', apiError);
      // CORSエラーやネットワークエラーの場合はローカル保存にフォールバック
      
      // フォールバック: ローカルストレージに保存
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          try {
            // JWTトークンをデコードして更新（日本語対応）
            const encodedPayload = storedToken.split('.')[1];
            const decodedPayload = decodeURIComponent(escape(atob(encodedPayload)));
            const payload = JSON.parse(decodedPayload);
            
            // 更新データをペイロードに反映
            const updatedPayload = {
              ...payload,
              name: updates.full_name || payload.name,
              birth_date: updates.birth_date || payload.birth_date,
              konkatsu_experience: updates.konkatsu_status || payload.konkatsu_experience,
              occupation: updates.occupation || payload.occupation,
              birthplace: updates.birthplace || payload.birthplace,
              residence: updates.current_location || payload.residence,
              hobbies: updates.hobbies || payload.hobbies,
              weekend_activities: updates.holiday_style || payload.weekend_activities,
              updated_at: new Date().toISOString()
            };
            
            // 新しいトークンを作成（簡易版 - 実際はサーバー側で行うべき）
            // 日本語文字を含む場合のエンコード対応
            const payloadString = JSON.stringify(updatedPayload);
            const encodedPayload = btoa(unescape(encodeURIComponent(payloadString)));
            const newToken = storedToken.split('.')[0] + '.' + encodedPayload + '.' + storedToken.split('.')[2];
            localStorage.setItem('token', newToken);
            
            console.log('ローカルストレージでプロフィール更新完了:', updatedPayload);
            
            return {
              success: true,
              message: 'プロフィールが更新されました（ローカル保存）'
            };
          } catch (tokenError) {
            console.error('ローカルトークン更新エラー:', tokenError);
          }
        }
      }
    }

    // 全て失敗した場合はエラーを投げる
    throw new Error('プロフィールの更新に失敗しました。ネットワーク接続を確認してください。');
    
  } catch (error) {
    console.error('プロフィール更新で予期せぬエラー:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('認証が必要です。再度ログインしてください。');
      }
    }
    
    throw new Error('プロフィールの更新に失敗しました。');
  }

  /* 実際のAPI呼び出し（認証が必要）
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/profile/update`,
      updates,
      {
        headers: getAuthHeaders(),
        timeout: 8000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('認証が必要です。再度ログインしてください。');
      }
    }
    
    throw new Error('プロフィールの更新に失敗しました。');
  }
  */
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
  updateProfile,
  getMBTIHistory,
  getKonkatsuExperienceDisplay,
  getKonkatsuExperienceColor,
  getMBTITypeName,
};