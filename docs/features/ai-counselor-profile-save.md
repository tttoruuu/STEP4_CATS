# AIカウンセラー自己紹介文保存機能

## ブランチ名
`development-captain-aicounseler-selfproduction`

## 実装日
2025年1月28日

## 機能概要
AIカウンセラーで作成した自己紹介文をチャット履歴として保存し、後から参照・再利用できる機能を実装しました。

## 実装内容

### 1. フロントエンド実装（frontend/pages/counselor/profile-creator.js）

#### 追加した状態管理
```javascript
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [savedProfileTitle, setSavedProfileTitle] = useState('');
```

#### saveProfile関数の改修
- 自己紹介文をチャット履歴形式で保存
- `session_type: 'profile'`として区別
- 保存成功時にモーダルを表示

```javascript
const messages = [
  {
    role: 'user',
    content: `自己紹介文を作成してください。\n\n【基本情報】\n${profileData.basicInfo}...`,
    timestamp: new Date().toISOString()
  },
  {
    role: 'ai', 
    content: `【${profile.title}】の自己紹介文を作成いたしました。\n\n${profile.content}...`,
    timestamp: new Date().toISOString()
  }
];

const response = await fetch(`${apiUrl}/api/counselor/save`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ 
    messages,
    session_type: 'profile'  // プロフィール作成セッションであることを明示
  })
});
```

#### 保存成功モーダルの追加
- 保存完了通知
- 「相談履歴を見る」ボタンで履歴画面へ遷移
- 「続ける」ボタンで作業継続

### 2. バックエンド実装（backend/routers/counselor.py）

#### 開発環境ユーザーの固定化
```python
async def get_dev_user(db: Session = Depends(get_db)):
    if os.getenv("ENV") == "development":
        # 開発環境用: 固定ユーザーを使用
        user_id = "dev_user_fixed"  # 固定ユーザーID
        user = db.query(User).filter(User.username == user_id).first()
        # ...
```

#### 履歴取得APIの改修
```python
# session_typeの判定ロジック
"session_type": first_conv.role if first_conv.role in ['profile', 'counselor', 'practice'] else "counselor"
```

### 3. データベース構造
- conversationsテーブルのroleフィールドに'profile'を格納
- conversation_idによるセッション管理
- conversation_titleでAI生成タイトルを保存

## 動作確認手順

1. **自己紹介文作成**
   - http://localhost:3000/counselor/profile-creator にアクセス
   - 5つの質問に回答（音声またはテキスト）
   - 3パターンの自己紹介文を生成

2. **保存操作**
   - 任意のパターンの「保存」ボタンをクリック
   - 保存成功モーダルが表示される
   - モーダルから履歴画面に遷移可能

3. **履歴確認**
   - http://localhost:3000/counselor/history にアクセス
   - 「プロフィール作成」タイプとして保存された自己紹介文を確認
   - クリックで詳細表示

## 技術的なポイント

1. **セッションタイプの管理**
   - `session_type: 'profile'`でプロフィール作成を識別
   - データベースのroleフィールドに保存

2. **開発環境の改善**
   - 時間ベースのユーザー切り替えを廃止
   - 固定ユーザー（dev_user_fixed）で一貫性確保

3. **UXの向上**
   - 保存成功時の視覚的フィードバック
   - 履歴画面への導線提供

## 今後の改善案
- 保存した自己紹介文の編集機能
- 履歴画面での直接コピー機能
- お気に入り機能の追加
- 自己紹介文のバージョン管理