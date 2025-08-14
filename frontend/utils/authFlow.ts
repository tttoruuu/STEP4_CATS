import { AuthStep, AuthMode, ValidationResult, StepProgress } from '../types/auth';

export function validateInput(step: AuthStep, input: string): ValidationResult {
  const trimmedInput = input.trim();

  switch (step) {
    case 'name':
      if (!trimmedInput) {
        return { isValid: false, error: 'お名前を入力してください。' };
      }
      if (trimmedInput.length < 1 || trimmedInput.length > 50) {
        return { isValid: false, error: 'お名前は1文字以上50文字以下で入力してください。' };
      }
      return { isValid: true };

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedInput) {
        return { isValid: false, error: 'メールアドレスを入力してください。' };
      }
      if (!emailRegex.test(trimmedInput)) {
        return { 
          isValid: false, 
          error: 'メールアドレスには「@」マークが必要です。\n\n例：tanaka@example.com のような形式でお願いします 📧' 
        };
      }
      return { isValid: true };

    case 'password':
      if (!trimmedInput) {
        return { isValid: false, error: 'パスワードを入力してください。' };
      }
      if (trimmedInput.length < 8) {
        return { 
          isValid: false, 
          error: 'あら、少し短いようですね 😅\nパスワードは8文字以上必要です。\n\nもう少し長めのパスワードをお願いします。\n例：「password123」のような感じです。' 
        };
      }
      if (!/[a-zA-Z]/.test(trimmedInput) || !/\d/.test(trimmedInput)) {
        return { 
          isValid: false, 
          error: 'もう少しですね！\n今度は英字と数字の両方を含めてください。\n\n例えば「mypass123」のように数字も入れていただけますか？' 
        };
      }
      return { isValid: true };

    case 'birthdate':
      if (!trimmedInput) {
        return { isValid: false, error: '生年月日を入力してください。' };
      }
      
      // 生年月日の形式チェック（YYYY-MM-DD形式）
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(trimmedInput)) {
        return { 
          isValid: false, 
          error: '生年月日は「YYYY-MM-DD」の形式で入力してください。\n\n例：1990-01-15' 
        };
      }
      
      // 日付の妥当性チェック
      const birthDate = new Date(trimmedInput);
      if (isNaN(birthDate.getTime())) {
        return { isValid: false, error: '正しい生年月日を入力してください。' };
      }
      
      // 現在の日付から年齢を計算
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      // 誕生日がまだ来ていない場合は年齢を1引く
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
      
      if (actualAge < 18) {
        return { 
          isValid: false, 
          error: 'ありがとうございます。\n申し訳ございませんが、Miraimは18歳以上の方にご利用いただいております。\n\n18歳になられましたら、ぜひまたお越しください。\nお待ちしております！' 
        };
      }
      if (actualAge > 100) {
        return { isValid: false, error: '生年月日を正しく入力してください。' };
      }
      return { isValid: true };

    case 'konkatsuStatus':
      const validInputs = ['1', '2', '3', '初心者', '経験', '再チャレンジ'];
      const isValid = validInputs.some(valid => 
        trimmedInput === valid || trimmedInput.includes(valid)
      );
      
      if (!isValid) {
        return { 
          isValid: false, 
          error: '1️⃣、2️⃣、3️⃣のいずれかの番号、または\n「初心者」「経験あり」「再チャレンジ」で教えてください。' 
        };
      }
      return { isValid: true };

    case 'optional_confirm':
      const yesInputs = ['はい', 'yes', 'y', '1', '入力', 'する'];
      const noInputs = ['いいえ', 'no', 'n', '2', '入力しない', 'しない'];
      
      const isYes = yesInputs.some(input => 
        trimmedInput.toLowerCase().includes(input.toLowerCase())
      );
      const isNo = noInputs.some(input => 
        trimmedInput.toLowerCase().includes(input.toLowerCase())
      );
      
      if (!isYes && !isNo) {
        return { 
          isValid: false, 
          error: '「はい」または「いいえ」でお答えください。' 
        };
      }
      return { isValid: true };

    case 'occupation':
      if (!trimmedInput) {
        return { isValid: false, error: 'ご職業を入力してください。' };
      }
      return { isValid: true };

    case 'birthplace':
      if (!trimmedInput) {
        return { isValid: false, error: '出身地を入力してください。' };
      }
      if (trimmedInput.length < 1 || trimmedInput.length > 50) {
        return { isValid: false, error: '出身地は1文字以上50文字以下で入力してください。' };
      }
      return { isValid: true };

    case 'location':
      if (!trimmedInput) {
        return { isValid: false, error: '現在の居住地を入力してください。' };
      }
      if (trimmedInput.length < 1 || trimmedInput.length > 50) {
        return { isValid: false, error: '居住地は1文字以上50文字以下で入力してください。' };
      }
      return { isValid: true };

    case 'hobbies':
      if (!trimmedInput) {
        return { isValid: false, error: '趣味・興味を入力してください。' };
      }
      if (trimmedInput.length < 1 || trimmedInput.length > 100) {
        return { isValid: false, error: '趣味・興味は1文字以上100文字以下で入力してください。' };
      }
      return { isValid: true };

    case 'holiday_style':
      if (!trimmedInput) {
        return { isValid: false, error: '休日の過ごし方を入力してください。' };
      }
      if (trimmedInput.length < 1 || trimmedInput.length > 100) {
        return { isValid: false, error: '休日の過ごし方は1文字以上100文字以下で入力してください。' };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

export function getNextStep(currentStep: AuthStep, mode: AuthMode): AuthStep | null {
  if (mode === 'login') {
    switch (currentStep) {
      case 'email_confirm':
        return 'password_confirm';
      default:
        return null;
    }
  }

  // Register mode
  switch (currentStep) {
    case 'start':
      return 'name';
    case 'name':
      return 'email';
    case 'email':
      return 'password';
    case 'password':
      return 'birthdate';
    case 'birthdate':
      return 'konkatsuStatus';
    case 'konkatsuStatus':
      return 'optional_confirm';
    case 'optional_confirm':
      // ユーザーの選択に基づいて次のステップを決定
      return 'occupation'; // 実際の選択はAuthChat.tsxで処理
    case 'occupation':
      return 'birthplace';
    case 'birthplace':
      return 'location';
    case 'location':
      return 'hobbies';
    case 'hobbies':
      return 'holiday_style';
    case 'holiday_style':
      return 'complete';
    default:
      return null;
  }
}

export function getStepProgress(currentStep: AuthStep, mode: AuthMode): StepProgress | null {
  if (mode === 'login') {
    const steps = ['email', 'password'];
    const current = steps.indexOf(currentStep) + 1;
    return current > 0 ? { current: Math.min(current, 2), total: 2 } : null;
  }

  // Register mode - 婚活ステータスまでで完了とする
  const requiredSteps = ['name', 'email', 'password', 'birthdate', 'konkatsuStatus'];
  const current = requiredSteps.indexOf(currentStep);
  
  // 最初の名前入力時点で0%から始まり、各ステップで20%ずつ進む
  if (current >= 0) {
    return { current: current, total: 5 };
  }
  
  // konkatsuStatus完了後も進捗バーを表示し続ける（optional_confirmまで）
  if (currentStep === 'optional_confirm') {
    return { current: 5, total: 5 };
  }
  
  return null;
}

export function getStepTitle(step: AuthStep): string {
  switch (step) {
    case 'name':
      return 'お名前';
    case 'email':
      return 'メールアドレス';
    case 'password':
      return 'パスワード';
    case 'birthdate':
      return '生年月日';
    case 'konkatsuStatus':
      return '婚活状況';
    case 'occupation':
      return 'ご職業';
    case 'birthplace':
      return '出身地';
    case 'location':
      return 'お住まい';
    case 'hobbies':
      return 'ご趣味';
    default:
      return '';
  }
}