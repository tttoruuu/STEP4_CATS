# MIRAIM プロジェクト概要

## プロジェクトの目的
婚活男性向け「内面スタイリング」トータルサポートアプリ
- **ビジョン**: 結婚相談所に通う真剣な婚活男性のコミュニケーション能力向上
- **対象**: 結婚相談所入会者で会話・コミュニケーションに課題を抱える男性
- **目標**: 理想的なパートナーとの出会いを実現

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15.2.4 (Pages Router)
- **言語**: TypeScript
- **UI ライブラリ**: Radix UI + shadcn/ui, Material-UI
- **スタイリング**: Tailwind CSS
- **フォーム**: React Hook Form + Zod
- **HTTP クライアント**: Axios
- **AI統合**: OpenAI API
- **PWA対応**: あり

### バックエンド
- **フレームワーク**: FastAPI 0.104.1
- **言語**: Python
- **ORM**: SQLAlchemy 2.0.23
- **データベース**: MySQL (PyMySQL, mysql-connector-python)
- **認証**: JWT (python-jose, PyJWT)
- **パスワードハッシュ**: Passlib (bcrypt)
- **バリデーション**: Pydantic 2.5.2
- **マイグレーション**: Alembic
- **AI統合**: OpenAI API 1.30.0

### インフラ・デプロイ
- **クラウド**: Microsoft Azure
- **コンテナ**: Docker
- **本番環境**: Azure Container Apps
- **レジストリ**: Azure Container Registry
- **CI/CD**: GitHub Actions

## 主要機能
1. **AIカウンセラー**: 婚活悩み相談・自己紹介文作成支援
2. **会話練習機能**: 聞く力特化のコミュニケーショントレーニング
3. **相性診断機能**: 性格・価値観診断とマッチング支援
4. **スタイリング提案**: 年齢・季節・タイプ別の外見改善提案

## プロジェクト構成
```
/
├── frontend/          # Next.js PWA
├── backend/           # FastAPI
├── config/            # 設定ファイル・シークレット管理
├── scripts/           # デプロイ・開発スクリプト
├── docs/              # 設計書・仕様書
├── docker-compose.*.yml
├── Makefile           # 開発コマンド統合
└── CLAUDE.md          # プロジェクトルール・手順
```

## 本番環境URL
- **フロントエンド**: https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io
- **バックエンドAPI**: https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io