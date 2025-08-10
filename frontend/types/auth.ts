export type AuthMode = 'register' | 'login';

export type AuthStep = 
  | 'start'
  | 'name'
  | 'email'
  | 'password'
  | 'birthdate'
  | 'age'
  | 'konkatsuStatus'
  | 'optional_confirm'
  | 'occupation'
  | 'birthplace'
  | 'location'
  | 'hobbies'
  | 'holiday_style'
  | 'email_confirm'
  | 'password_confirm'
  | 'complete';

export interface UserData {
  name?: string;
  email?: string;
  password?: string;
  birthdate?: string;
  konkatsuStatus?: string;
  occupation?: string;
  birthplace?: string;
  location?: string;
  hobbies?: string | string[];  // 文字列または配列に対応
  holidayStyle?: string;
}

// プロフィール専用型定義
export interface ProfileData {
  hometown?: string;
  hobbies?: string[];
  age?: number;  // 自動算出（読み取り専用）
}

export interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface StepProgress {
  current: number;
  total: number;
}