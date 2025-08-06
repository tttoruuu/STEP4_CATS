# 📚 MIRAIM ドキュメント

このディレクトリにはMIRAIMプロジェクトの設計・仕様・開発に関するドキュメントが整理されています。

## 📋 重要ドキュメント

- **[DOCUMENTATION_RULES.md](./DOCUMENTATION_RULES.md)** - ドキュメント運用ルール（必読）
- **[UI_DESIGN_GUIDE.md](./UI_DESIGN_GUIDE.md)** - UIデザインガイドライン（ネオモーフィズム）
- **[API_KEY_SETUP.md](./API_KEY_SETUP.md)** - API認証設定ガイド

## 🗂️ ディレクトリ構成

### `/features` - 機能仕様書
主要機能の詳細仕様と技術ドキュメント
- **AIカウンセラー関連**
  - `ai-counselor-config.md` - AIカウンセラー設定
  - `ai-counselor-profile-save.md` - プロフィール保存機能
- **会話練習機能**
  - `DeepQuestioningPractice.md` - 深堀り質問練習
  - `integrated-conversation-practice.md` - 統合会話練習
  - `listening-training-questions.md` - 聞く力トレーニング問題集
  - `conversation-quiz-data-structure.md` - 会話クイズデータ構造
- **音声処理**
  - `SpeechRecognition.md` - 音声認識（STT）
  - `TextToSpeech.md` - 音声合成（TTS）
  - `mp3-audio-setup.md` - MP3音声設定
  - `tts-to-mp3-migration.md` - TTS→MP3移行ガイド
- **その他機能**
  - `personality-test.md` - 性格診断
  - `tms-proposal.md` - トータルマッチングシステム提案
  - `ActivityDiagram.md` - アクティビティ図

### `/deployment` - デプロイメント
Azure Container Apps環境構築とデプロイ手順
- `efficient-deployment-proposal.md` - 効率的デプロイ提案
- `azure-portal-deployment.md` - Azureポータル設定
- `github-secrets-setup.md` - GitHub Secrets設定
- `database-setup.md` - データベース構築
- `cost-effective-testing.md` - コスト最適化テスト

### `/development` - 開発ガイド
開発環境構築と開発フロー
- `setup-guide.md` - 初期セットアップ
- `development-deployment-guide.md` - 開発デプロイガイド
- `Github開発手順.md` - GitHub開発フロー
- `alembic-migration-guide.md` - DBマイグレーション
- `profile.md` - プロファイル設定

### `/infrastructure` - インフラ・セキュリティ
インフラ設定とセキュリティ対策
- `security-guide.md` - セキュリティガイド
- `azure-docker-troubleshooting.md` - Dockerトラブルシューティング
- `azure-proxy-check.md` - プロキシ設定確認

### `/meetings` - 作業記録
日々の作業ログとバグ修正記録（YYYY-MM-DD_内容.md形式）
- 最新の修正履歴
- チーム作業メモ
- バグ対応記録

### `/testing` - テスト関連
- `user-flow-test-report.md` - ユーザーフローテスト結果

### `/wireframes` - UI/UXデザイン
- `wireframe-mvp-updated.html` - 最新ワイヤーフレーム
- `wireframe-mvp.html` - 初期ワイヤーフレーム

### `/diagrams` - 設計図
- `STEP4_CATS_ER_Diagram.drawio` - ER図
- `ScreenFlowDiagram.drawio` - 画面フロー図

### `/resources` - リソース
- `/pdfs` - 婚活・会話スキル関連の参考資料

### `/audio` - 音声機能仕様
- `advanced-scenarios-audio-files.md` - 高度な音声シナリオ

## 🚀 クイックアクセス

### 新機能開発時
1. `/features/` で既存機能を確認
2. 新規仕様書を作成（kebab-case.md）
3. `/development/setup-guide.md` で開発環境構築

### デプロイ時
1. `/deployment/efficient-deployment-proposal.md` でデプロイ手順確認
2. `/deployment/github-secrets-setup.md` でシークレット設定
3. `/scripts/deploy.sh` を実行（ルートディレクトリ）

### トラブル対応時
1. `/infrastructure/azure-docker-troubleshooting.md` で解決策検索
2. `/meetings/` で過去の対応履歴確認

## 📝 更新ルール

ドキュメント作成・更新時は必ず **[DOCUMENTATION_RULES.md](./DOCUMENTATION_RULES.md)** のルールに従ってください。

---
最終更新: 2025-01-08