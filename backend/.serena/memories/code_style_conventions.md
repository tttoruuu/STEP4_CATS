# MIRAIM コーディング規約・スタイル

## 言語設定
- **基本言語**: 日本語
- **UIテキスト**: 日本語
- **コメント**: 日本語
- **変数名・関数名**: 日本語を基本とする
- **ファイル名**: 日本語可

## フロントエンド (Next.js + TypeScript)

### 設定ファイル
- **ESLint**: eslint-config-next使用
- **Prettier**: 自動フォーマット
- **TypeScript**: strict mode有効
- **Tailwind CSS**: 設定済み

### コーディングスタイル
- **コンポーネント**: React関数コンポーネント使用
- **型定義**: TypeScript strict必須
- **フォーム**: React Hook Form + Zod バリデーション
- **状態管理**: React Hooks + Context API
- **スタイリング**: Tailwind CSS + shadcn/ui
- **API通信**: Axios使用

### ファイル構成
```
frontend/
├── pages/             # Pages Router（Next.js）
├── components/        # 再利用可能コンポーネント
├── services/          # API通信層
├── types/             # TypeScript型定義
├── utils/             # ユーティリティ関数
├── styles/            # グローバルスタイル
└── public/            # 静的アセット
```

## バックエンド (FastAPI + Python)

### コーディングスタイル
- **フォーマッター**: Black
- **リンター**: flake8
- **インポート順序**: isort
- **型ヒント**: 必須
- **Docstring**: 必須（Google形式推奨）
- **バリデーション**: Pydantic必須

### ファイル構成
```
backend/
├── main.py            # FastAPIアプリケーション
├── database.py        # データベース設定
├── models/            # SQLAlchemyモデル
├── schemas/           # Pydanticスキーマ
├── routers/           # APIルーター
├── services/          # ビジネスロジック
├── auth/              # 認証関連
└── migrations/        # Alembicマイグレーション
```

### API設計
- **RESTful設計**: 標準的なHTTPメソッド使用
- **レスポンス形式**: JSON
- **エラーハンドリング**: HTTPException使用
- **認証**: JWT Bearer token
- **CORS**: 本番・開発環境別設定

## Git運用ルール

### ブランチ戦略
- **main**: 本番デプロイ専用（安定版のみ）
- **develop**: チーム開発統合ブランチ
- **feature**: 個別機能開発（feature/機能名-担当者名）
- **hotfix**: 緊急修正用

### コミットメッセージ
- **形式**: Conventional Commits
- **例**: 
  - `feat: AIカウンセラー機能追加`
  - `fix: ログイン認証エラー修正`
  - `docs: API仕様書更新`

## テスト方針
- **単体テスト**: 80%以上のカバレッジ目標
- **統合テスト**: API間連携テスト
- **E2Eテスト**: 主要ユーザージャーニー
- **AI応答品質テスト**: 会話精度、音声解析精度

## セキュリティ要件
- **個人情報保護**: 婚活データの適切な暗号化
- **音声データ**: 匿名化処理必須
- **認証**: JWT + OAuth2
- **機密情報**: GitHub Secrets管理
- **CORS**: 本番環境の適切な設定

## 環境変数管理
- **フロントエンド**: NEXT_PUBLIC_* プレフィックス必須
- **バックエンド**: python-dotenv使用
- **本番環境**: Azure環境変数設定
- **機密情報**: .env.example提供、実際の値は別管理