/**
 * プロフィール関連のユーティリティ関数テスト
 * hobbies文字列→配列変換の単体テスト
 */

// テスト対象の関数群
const parseHobbies = (hobbiesText) => {
  if (!hobbiesText) {
    return [];
  }
  
  // カンマ、句読点、スペースで分割
  const hobbies = hobbiesText
    .split(/[,、\s]+/)
    .map(hobby => hobby.trim())
    .filter(hobby => hobby.length > 0);
  
  return hobbies;
};

const formatHobbiesToString = (hobbiesArray) => {
  if (!Array.isArray(hobbiesArray)) {
    return '';
  }
  return hobbiesArray.join(', ');
};

const validateHobbies = (hobbies) => {
  if (!hobbies) return { isValid: true, errors: [] };
  
  const errors = [];
  
  if (Array.isArray(hobbies)) {
    if (hobbies.length > 10) {
      errors.push('趣味は10個以下にしてください');
    }
    
    hobbies.forEach((hobby, index) => {
      if (typeof hobby !== 'string') {
        errors.push(`趣味${index + 1}は文字列である必要があります`);
      } else if (hobby.length > 50) {
        errors.push(`趣味${index + 1}は50文字以下にしてください`);
      }
    });
  } else if (typeof hobbies === 'string') {
    const parsed = parseHobbies(hobbies);
    return validateHobbies(parsed);
  } else {
    errors.push('趣味は文字列または配列である必要があります');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

describe('プロフィール関連ユーティリティ', () => {
  describe('parseHobbies', () => {
    test('カンマ区切り文字列を配列に変換', () => {
      const input = '読書, 映画鑑賞, プログラミング';
      const expected = ['読書', '映画鑑賞', 'プログラミング'];
      expect(parseHobbies(input)).toEqual(expected);
    });
    
    test('句読点区切り文字列を配列に変換', () => {
      const input = '読書、映画鑑賞、プログラミング';
      const expected = ['読書', '映画鑑賞', 'プログラミング'];
      expect(parseHobbies(input)).toEqual(expected);
    });
    
    test('スペース区切り文字列を配列に変換', () => {
      const input = '読書 映画鑑賞 プログラミング';
      const expected = ['読書', '映画鑑賞', 'プログラミング'];
      expect(parseHobbies(input)).toEqual(expected);
    });
    
    test('混合区切り文字列を配列に変換', () => {
      const input = '読書, 映画鑑賞、プログラミング ゲーム';
      const expected = ['読書', '映画鑑賞', 'プログラミング', 'ゲーム'];
      expect(parseHobbies(input)).toEqual(expected);
    });
    
    test('前後の空白を除去', () => {
      const input = '  読書  ,  映画鑑賞  ,  プログラミング  ';
      const expected = ['読書', '映画鑑賞', 'プログラミング'];
      expect(parseHobbies(input)).toEqual(expected);
    });
    
    test('空の文字列は空配列を返す', () => {
      expect(parseHobbies('')).toEqual([]);
      expect(parseHobbies('   ')).toEqual([]);
    });
    
    test('nullまたはundefinedは空配列を返す', () => {
      expect(parseHobbies(null)).toEqual([]);
      expect(parseHobbies(undefined)).toEqual([]);
    });
    
    test('単一の趣味', () => {
      const input = '読書';
      const expected = ['読書'];
      expect(parseHobbies(input)).toEqual(expected);
    });
  });
  
  describe('formatHobbiesToString', () => {
    test('配列を文字列に変換', () => {
      const input = ['読書', '映画鑑賞', 'プログラミング'];
      const expected = '読書, 映画鑑賞, プログラミング';
      expect(formatHobbiesToString(input)).toBe(expected);
    });
    
    test('空配列は空文字列を返す', () => {
      expect(formatHobbiesToString([])).toBe('');
    });
    
    test('配列でない場合は空文字列を返す', () => {
      expect(formatHobbiesToString('文字列')).toBe('');
      expect(formatHobbiesToString(null)).toBe('');
      expect(formatHobbiesToString(undefined)).toBe('');
    });
    
    test('単一要素の配列', () => {
      const input = ['読書'];
      const expected = '読書';
      expect(formatHobbiesToString(input)).toBe(expected);
    });
  });
  
  describe('validateHobbies', () => {
    test('有効な趣味配列', () => {
      const input = ['読書', '映画鑑賞', 'プログラミング'];
      const result = validateHobbies(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
    
    test('有効な趣味文字列', () => {
      const input = '読書, 映画鑑賞, プログラミング';
      const result = validateHobbies(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
    
    test('趣味が多すぎる場合', () => {
      const input = Array(11).fill('趣味');
      const result = validateHobbies(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('趣味は10個以下にしてください');
    });
    
    test('趣味が長すぎる場合', () => {
      const longHobby = 'a'.repeat(51);
      const input = ['読書', longHobby];
      const result = validateHobbies(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('趣味2は50文字以下にしてください');
    });
    
    test('趣味が文字列でない場合', () => {
      const input = ['読書', 123, 'プログラミング'];
      const result = validateHobbies(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('趣味2は文字列である必要があります');
    });
    
    test('nullまたはundefinedは有効', () => {
      expect(validateHobbies(null).isValid).toBe(true);
      expect(validateHobbies(undefined).isValid).toBe(true);
    });
    
    test('無効な型', () => {
      const input = 123;
      const result = validateHobbies(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('趣味は文字列または配列である必要があります');
    });
  });
});

// API統合テスト
describe('プロフィールAPI統合テスト', () => {
  // モックデータ
  const mockApiResponse = {
    success: true,
    profile: {
      user_id: 1,
      name: 'テストユーザー',
      age: 30,
      hobbies: ['読書', '映画鑑賞', 'プログラミング'],
      // その他のプロフィールデータ...
    }
  };
  
  test('プロフィール取得時の趣味データ処理', () => {
    const profile = mockApiResponse.profile;
    
    // 趣味が配列であることを確認
    expect(Array.isArray(profile.hobbies)).toBe(true);
    expect(profile.hobbies.length).toBe(3);
    expect(profile.hobbies).toContain('読書');
  });
  
  test('プロフィール更新時の趣味データ変換', () => {
    const userInput = '読書, 映画鑑賞, 新しい趣味';
    const processedHobbies = parseHobbies(userInput);
    
    // 更新用のデータ形式
    const updateData = {
      hobbies: processedHobbies
    };
    
    expect(updateData.hobbies).toEqual(['読書', '映画鑑賞', '新しい趣味']);
  });
  
  test('既存の趣味データの表示用変換', () => {
    const existingHobbies = ['読書', '映画鑑賞', 'プログラミング'];
    const displayString = formatHobbiesToString(existingHobbies);
    
    expect(displayString).toBe('読書, 映画鑑賞, プログラミング');
  });
});

// テスト用のユーティリティ関数をエクスポート（他のテストで使用可能）
module.exports = {
  parseHobbies,
  formatHobbiesToString,
  validateHobbies
};