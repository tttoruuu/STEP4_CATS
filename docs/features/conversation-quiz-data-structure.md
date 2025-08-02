# 会話練習クイズ データ構造設計書

## 概要

「引き出す」「深める」練習機能で使用するクイズデータの構造と管理方法について説明します。
JSON形式で管理することで、開発者が簡単にデータを追加・更新できる設計になっています。

## ファイル構成

```
/frontend/data/conversationQuizData.js
```

## データ構造

### 1. 基本構造

```javascript
export const conversationQuizData = {
  version: "1.0",                    // データバージョン
  lastUpdated: "2025-01-21",         // 最終更新日
  
  // カテゴリ定義
  categories: { /* カテゴリ情報 */ },
  
  // 難易度定義  
  levels: { /* 難易度情報 */ },
  
  // シナリオデータ（問題集）
  scenarios: [ /* 問題配列 */ ]
};
```

### 2. カテゴリ定義 (categories)

```javascript
categories: {
  elicit: {
    name: "会話を引き出す",
    description: "相手が話しやすい質問をする練習",
    color: "from-yellow-500 to-yellow-600",  // Tailwind CSS カラー
    icon: "lightbulb"                        // アイコン名
  },
  deepen: {
    name: "深掘りする",
    description: "話題を掘り下げる質問をする練習", 
    color: "from-purple-500 to-purple-600",
    icon: "search"
  }
}
```

### 3. 難易度定義 (levels)

```javascript
levels: {
  beginner: { name: "初級", order: 1 },
  intermediate: { name: "中級", order: 2 },
  advanced: { name: "上級", order: 3 }
}
```

### 4. シナリオデータ (scenarios)

```javascript
{
  id: "elicit_001",                          // 一意のID
  category: "elicit",                        // カテゴリ (elicit/deepen)
  level: "beginner",                         // 難易度
  tags: ["趣味", "初対面", "デート"],           // タグ（検索・分類用）
  situation: "初デートで相手の趣味について聞く場面", // 場面設定
  womanText: "そうですね...特に趣味らしい趣味はないかもしれません。", // 女性側の発言
  
  // 4つの選択肢
  choices: [
    {
      id: "a",                               // 選択肢ID
      text: "そうなんですね。普段はお休みの日は何をされてるんですか？", // 選択肢テキスト
      isCorrect: true,                       // 正解フラグ
      explanation: "「趣味」という直接的な言葉を避けて、より答えやすい「普段の過ごし方」を聞くことで、相手が話しやすい環境を作っています。" // 解説
    },
    // ... 他の選択肢
  ],
  
  shadowingAudio: "/audio/shadowing/elicit_001.mp3", // シャドーイング音声ファイルパス（現在はOpenAI TTS使用）
  shadowingText: "そうなんですね。普段はお休みの日は何をされてるんですか？", // シャドーイング用テキスト（TTS生成対象）
  tip: "相手が「特にない」と言った時は、より具体的で答えやすい質問に変えてみましょう。", // 学習ヒント
  
  createdAt: "2025-01-21",                   // 作成日
  updatedAt: "2025-01-21"                    // 更新日
}
```

## データの追加方法

### 新しい問題を追加する

1. **scenarios配列に新しいオブジェクトを追加**

```javascript
{
  id: "elicit_003",  // 既存のIDと重複しないように注意
  category: "elicit",
  level: "intermediate",
  tags: ["家族", "価値観"],
  situation: "家族について話題を広げる場面",
  womanText: "家族は両親と妹がいます。",
  choices: [
    {
      id: "a",
      text: "ご家族とは仲が良いんですか？",
      isCorrect: true,
      explanation: "家族構成から関係性に話を広げる良い質問です。"
    },
    // ... 他3つの選択肢
  ],
  shadowingAudio: "/audio/shadowing/elicit_003.mp3",
  shadowingText: "ご家族とは仲が良いんですか？",
  tip: "家族構成を聞いた後は、関係性や思い出について聞いてみましょう。",
  createdAt: "2025-01-21",
  updatedAt: "2025-01-21"
}
```

### 新しいカテゴリを追加する

1. **categoriesオブジェクトに追加**

```javascript
categories: {
  // 既存のカテゴリ...
  
  // 新しいカテゴリ
  share: {
    name: "体験を共有する",
    description: "自分の体験を適切に話す練習",
    color: "from-green-500 to-green-600",
    icon: "share"
  }
}
```

2. **対応するシナリオを作成**

```javascript
{
  id: "share_001",
  category: "share",  // 新しいカテゴリを指定
  level: "beginner",
  // ... その他のフィールド
}
```

## 音声ファイルの管理

### ファイル配置

```
/public/audio/shadowing/
├── elicit_001.mp3
├── elicit_002.mp3
├── deepen_001.mp3
├── deepen_002.mp3
└── ...
```

### 命名規則

- `{カテゴリ}_{連番3桁}.mp3`
- 例: `elicit_001.mp3`, `deepen_015.mp3`

## ユーティリティ関数

データの取得・操作用の関数も提供されています：

```javascript
// カテゴリ別取得
const elicitScenarios = getScenariosByCategory('elicit');

// 難易度別取得  
const beginnerScenarios = getScenariosByLevel('beginner');

// ランダム取得
const randomElicitScenario = getRandomScenario('elicit');

// ID指定取得
const specificScenario = getScenarioById('elicit_001');
```

## データ更新時の注意点

### 1. ID管理
- 各シナリオのIDは一意である必要があります
- 既存のIDを変更すると、進捗データに影響する可能性があります

### 2. 音声ファイル
- 音声ファイルパスが正しいことを確認してください
- ファイルが存在しない場合、シャドーイング機能が動作しません

### 3. 選択肢のバランス
- 必ず1つの選択肢を正解（isCorrect: true）にしてください
- 他の3つは不正解（isCorrect: false）にしてください

### 4. 解説の質
- 正解・不正解の理由を明確に説明してください
- 婚活男性が実際の会話で応用できる内容にしてください

## データバックアップ

重要なデータ更新前は、必ずファイルのバックアップを取ってください：

```bash
# バックアップ作成
cp frontend/data/conversationQuizData.js frontend/data/conversationQuizData.js.backup

# Git管理
git add frontend/data/conversationQuizData.js
git commit -m "会話クイズデータ追加: 新しいシナリオ5問"
```

## 今後の拡張案

1. **多言語対応**: 各テキストフィールドに言語別データを追加
2. **動画対応**: 音声だけでなく動画ファイルにも対応
3. **分析データ**: 正解率や学習時間などの統計情報
4. **AI生成**: OpenAI APIを使った問題の自動生成機能

この構造により、開発チームが効率的にコンテンツを拡充できる基盤が整いました。