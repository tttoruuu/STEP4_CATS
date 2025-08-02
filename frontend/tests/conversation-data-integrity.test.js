// 会話練習データの整合性チェックテスト
import { conversationQuizData } from '../data/conversationQuizData';

describe('会話練習データ整合性チェック', () => {
  
  test('データ構造の基本要素が存在する', () => {
    expect(conversationQuizData).toBeDefined();
    expect(conversationQuizData.categories).toBeDefined();
    expect(conversationQuizData.levels).toBeDefined();
    expect(conversationQuizData.scenarios).toBeDefined();
    expect(Array.isArray(conversationQuizData.scenarios)).toBe(true);
  });

  test('カテゴリが正しく定義されている', () => {
    const categories = conversationQuizData.categories;
    expect(categories.elicit).toBeDefined();
    expect(categories.deepen).toBeDefined();
    expect(categories.elicit.name).toBe('会話を引き出す');
    expect(categories.deepen.name).toBe('深掘りする');
  });

  test('レベルが正しく定義されている', () => {
    const levels = conversationQuizData.levels;
    expect(levels.beginner).toBeDefined();
    expect(levels.intermediate).toBeDefined();
    expect(levels.advanced).toBeDefined();
    expect(levels.beginner.name).toBe('初級');
    expect(levels.intermediate.name).toBe('中級');
    expect(levels.advanced.name).toBe('上級');
  });

  test('各シナリオの必須フィールドが存在する', () => {
    conversationQuizData.scenarios.forEach(scenario => {
      // 必須フィールドの存在確認
      expect(scenario.id).toBeDefined();
      expect(scenario.category).toBeDefined();
      expect(scenario.level).toBeDefined();
      expect(scenario.situation).toBeDefined();
      expect(scenario.womanText).toBeDefined();
      expect(scenario.options).toBeDefined();
      expect(scenario.correctAnswer).toBeDefined();
      expect(scenario.shadowingAudio).toBeDefined();
      expect(scenario.shadowingText).toBeDefined();
      
      // 配列の確認
      expect(Array.isArray(scenario.options)).toBe(true);
      expect(scenario.options.length).toBe(4); // 4択問題
    });
  });

  test('選択肢の構造が正しい', () => {
    conversationQuizData.scenarios.forEach(scenario => {
      scenario.options.forEach((option, index) => {
        expect(option.id).toBeDefined();
        expect(['A', 'B', 'C', 'D']).toContain(option.id);
        expect(option.text).toBeDefined();
        expect(option.feedback).toBeDefined();
        expect(typeof option.score).toBe('number');
      });
    });
  });

  test('正解の選択肢が存在する', () => {
    conversationQuizData.scenarios.forEach(scenario => {
      const correctOption = scenario.options.find(opt => opt.id === scenario.correctAnswer);
      expect(correctOption).toBeDefined();
      expect(correctOption.score).toBeGreaterThan(0);
    });
  });

  test('音声ファイルパスが正しい形式', () => {
    conversationQuizData.scenarios.forEach(scenario => {
      expect(scenario.shadowingAudio).toMatch(/^\/audio\/shadowing\/(elicit|deepen)_\d{3}\.mp3$/);
    });
  });

  test('レベル別のシナリオ分布', () => {
    const levelCounts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    conversationQuizData.scenarios.forEach(scenario => {
      levelCounts[scenario.level]++;
    });

    console.log('レベル別シナリオ数:', levelCounts);
    
    // 各レベルに最低1つのシナリオがあることを確認
    expect(levelCounts.beginner).toBeGreaterThan(0);
    expect(levelCounts.intermediate).toBeGreaterThan(0);
    expect(levelCounts.advanced).toBeGreaterThan(0);
  });

  test('カテゴリ別のシナリオ分布', () => {
    const categoryCounts = {
      elicit: 0,
      deepen: 0
    };

    conversationQuizData.scenarios.forEach(scenario => {
      categoryCounts[scenario.category]++;
    });

    console.log('カテゴリ別シナリオ数:', categoryCounts);
    
    // 各カテゴリに最低1つのシナリオがあることを確認
    expect(categoryCounts.elicit).toBeGreaterThan(0);
    expect(categoryCounts.deepen).toBeGreaterThan(0);
  });

  test('シナリオIDの一意性', () => {
    const ids = conversationQuizData.scenarios.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('音声ファイルとシナリオIDの整合性', () => {
    conversationQuizData.scenarios.forEach(scenario => {
      const expectedAudioFile = `/audio/shadowing/${scenario.id}.mp3`;
      expect(scenario.shadowingAudio).toBe(expectedAudioFile);
    });
  });
});

// レポート出力
console.log('\n=== 会話練習データ統計 ===');
console.log(`総シナリオ数: ${conversationQuizData.scenarios.length}`);
console.log(`最終更新日: ${conversationQuizData.lastUpdated}`);
console.log(`バージョン: ${conversationQuizData.version}`);