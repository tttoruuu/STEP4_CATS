# フリー会話練習機能 v2.0 仕様書

## 概要
婚活男性の「聞く力」を向上させるため、4種類の女性キャラクターとの会話練習機能を提供します。
登録制から固定キャラクター制に変更し、より実践的な練習環境を実現します。

## 機能の目的
- **聞く力の向上**: 相手の話を引き出し、深掘りする技術の習得
- **共感力の強化**: 相槌・共感表現のバリエーション増加
- **実践的な練習**: 様々なタイプの女性との会話シミュレーション

## キャラクター設定

### 1. 佐藤 美咲（初級）
```json
{
  "id": "misaki",
  "name": "佐藤美咲",
  "age": 28,
  "job": "看護師",
  "personality": "優しい・聞き上手",
  "difficulty": "初級",
  "description": "穏やかで話しやすい。初心者向け",
  "conversation_style": {
    "response_speed": "ゆっくり",
    "topic_depth": "浅め",
    "emotion_expression": "豊か"
  }
}
```

### 2. 鈴木 愛（中級）
```json
{
  "id": "ai",
  "name": "鈴木愛",
  "age": 26,
  "job": "イベントプランナー",
  "personality": "明るい・話好き",
  "difficulty": "中級",
  "description": "テンポが速く、話題が多い",
  "conversation_style": {
    "response_speed": "速い",
    "topic_depth": "普通",
    "emotion_expression": "とても豊か"
  }
}
```

### 3. 田中 香織（中級）
```json
{
  "id": "kaori",
  "name": "田中香織",
  "age": 32,
  "job": "外資系コンサルタント",
  "personality": "知的・理論的",
  "difficulty": "中級",
  "description": "論理的な会話を好む",
  "conversation_style": {
    "response_speed": "普通",
    "topic_depth": "深い",
    "emotion_expression": "控えめ"
  }
}
```

### 4. 山田 静香（上級）
```json
{
  "id": "shizuka",
  "name": "山田静香",
  "age": 30,
  "job": "図書館司書",
  "personality": "控えめ・慎重",
  "difficulty": "上級",
  "description": "最初は心を開きにくい",
  "conversation_style": {
    "response_speed": "ゆっくり",
    "topic_depth": "徐々に深く",
    "emotion_expression": "最初は少なめ"
  }
}
```

## 会話フロー

### 1. キャラクター選択
- 4人のキャラクターカードから選択
- 難易度とプロフィール表示
- おすすめ表示機能（前回と違うキャラを推奨）

### 2. 会話セッション（10分）
```
【画面構成】
┌─────────────────────────┐
│ ⏱️ 8:32 / 10:00         │ ← タイマー
├─────────────────────────┤
│                         │
│   チャット画面           │
│                         │
├─────────────────────────┤
│ [🎤 音声入力] [送信]     │
└─────────────────────────┘
```

### 3. 終了条件
- 10分経過で自動終了
- 5分経過後に「終了」ボタン表示
- テストユーザーは時間無制限オプション

### 4. フィードバック画面
詳細は「フィードバック仕様」セクション参照

## API設計

### エンドポイント

#### 1. 会話API
```
POST /api/conversation/practice/chat
{
  "character_id": "misaki",
  "message": "ユーザーのメッセージ",
  "conversation_history": [...],
  "session_id": "xxx"
}
```

#### 2. フィードバック生成API
```
POST /api/conversation/practice/feedback
{
  "character_id": "misaki",
  "conversation_history": [...],
  "duration": 600,
  "session_id": "xxx"
}
```

### OpenAI プロンプト設計

#### キャラクター別システムプロンプト
```python
SYSTEM_PROMPTS = {
    "misaki": """
    あなたは28歳の看護師、佐藤美咲です。
    性格：優しく穏やかで、相手の話をよく聞きます。
    話し方：丁寧で温かみがあり、共感的な相槌を多く使います。
    特徴：
    - 「そうなんですね」「大変でしたね」など共感的な返答
    - 相手が話しやすいよう適度に質問を返す
    - 沈黙があっても焦らない
    設定：婚活中の男性との初デートで、カフェで会話しています。
    """,
    # 他のキャラクターも同様に定義
}
```

## フィードバック仕様

### 評価項目
1. **挨拶スキル** (5段階評価)
   - 初対面の挨拶
   - 締めの挨拶
   - 礼儀正しさ

2. **相槌・共感スキル** (5段階評価)
   - 相槌のバリエーション数
   - 共感表現の質
   - 感情への寄り添い

3. **聞く力（全返し）** (5段階評価)
   - オープンクエスチョンの使用
   - フォローアップ質問
   - 感情を引き出す質問

### フィードバック生成プロンプト
```python
FEEDBACK_PROMPT = """
以下の会話ログを分析し、フィードバックを生成してください。

【評価項目】
1. 挨拶スキル（初対面の印象、締めの挨拶）
2. 相槌・共感スキル（バリエーション、共感の質）
3. 聞く力（質問の質、深掘り、感情への注目）

【分析内容】
- 会話バランス（発言比率）
- 良かった発言を3つ抜粋
- 改善できる発言を3つ、改善例付き
- 次回への具体的アドバイス

会話ログ：{conversation_log}
"""
```

## 利用制限

### ユーザータイプ別制限
```python
# config.py
TEST_USERS = ["miraim@test.com", "demo@test.com", "test@example.com"]
DAILY_LIMIT = 3  # 通常ユーザーの1日あたり利用回数

def check_usage_limit(user_email):
    if user_email in TEST_USERS:
        return {"allowed": True, "remaining": "unlimited"}
    
    today_count = get_today_usage_count(user_email)
    remaining = DAILY_LIMIT - today_count
    
    return {
        "allowed": remaining > 0,
        "remaining": remaining,
        "reset_time": "明日0:00"
    }
```

## NGワード・不適切発言対応

### NGワードリスト
```python
NG_PATTERNS = [
    # 個人情報の詮索
    r"電話番号|住所|LINE|ライン",
    # 不適切な内容
    r"下ネタ|エッチ|セクハラ",
    # 攻撃的な表現
    r"ブス|デブ|死ね|殺す"
]
```

### 対応方法
1. 警告メッセージ表示
2. 3回違反で会話強制終了
3. キャラクターの反応変化（不快感を表現）

## UI/UXデザイン

### カラーパレット（ネオモーフィズム）
```css
:root {
  --primary-orange: #FF6B35;
  --light-orange: #FFB08A;
  --bg-color: #FAF5F2;
  --shadow-light: 8px 8px 16px rgba(209, 186, 172, 0.5);
  --shadow-dark: -8px -8px 16px rgba(255, 255, 255, 0.8);
}
```

### コンポーネント構成
```
/components/conversation/
├── CharacterCard.js       # キャラクター選択カード
├── ConversationTimer.js   # タイマー表示
├── ChatMessage.js          # チャットメッセージ
├── FeedbackDisplay.js      # フィードバック表示
└── SkillMeter.js          # スキル評価メーター
```

## 実装優先順位

### Phase 1（MVP）
1. ✅ 仕様書作成
2. キャラクター選択画面
3. 基本的な会話機能
4. 10分タイマー

### Phase 2
5. フィードバック機能
6. 音声入力（Whisper）
7. 利用制限機能

### Phase 3（今後の拡張）
8. 会話履歴保存
9. 成長グラフ
10. NGワード対応

## テスト項目

### 機能テスト
- [ ] キャラクター選択が正しく動作
- [ ] 10分タイマーが正確
- [ ] 会話のやり取りがスムーズ
- [ ] フィードバックが適切に生成

### 負荷テスト
- [ ] 同時接続ユーザー数
- [ ] OpenAI API レスポンス時間
- [ ] セッション管理

## 更新履歴
- 2025-01-18: v2.0 仕様書作成（登録制から固定キャラクター制へ）
- 今後: 会話履歴機能、成長トラッキング機能追加予定