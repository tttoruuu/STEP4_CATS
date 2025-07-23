# Documentation

このディレクトリには、STEP4_CATSプロジェクトの技術ドキュメントが整理されています。

## ディレクトリ構成

### 📁 development/
開発・デプロイ関連のドキュメント
- `alembic-migration-guide.md` - データベースマイグレーション手順
- `development-deployment-guide.md` - 開発・デプロイガイド
- `Github開発手順.md` - GitHub開発フロー
- `setup-guide.md` - 初期セットアップ手順

### 📁 features/
機能仕様・実装関連のドキュメント
- `ActivityDiagram.md` - アクティビティ図の説明
- `DeepQuestioningPractice.md` - 深堀り質問練習機能
- `SpeechRecognition.md` - 音声認識機能
- `TextToSpeech.md` - 音声合成機能
- `conversation-quiz-data-structure.md` - 会話クイズデータ構造
- `personality-test.md` - 性格診断機能

### 📁 infrastructure/
インフラ・運用関連のドキュメント
- `azure-docker-troubleshooting.md` - Azureトラブルシューティング
- `azure-proxy-check.md` - Azureプロキシ設定確認
- `security-guide.md` - セキュリティガイド

### 📁 diagrams/
図表・設計図ファイル
- `STEP4_CATS_ER_Diagram.drawio` - ER図
- `ScreenFlowDiagram.drawio` - 画面フロー図

### 📁 wireframes/
UI/UXデザインファイル
- `wireframe-mvp-updated.html` - 更新版ワイヤーフレーム
- `wireframe-mvp.html` - 初期ワイヤーフレーム

### 📁 resources/
参考資料・リソースファイル
- `pdfs/` - 婚活・会話スキル関連の参考資料PDF

## ドキュメント更新ルール

1. **新規ドキュメント作成時**: 適切なカテゴリフォルダに配置
2. **機能追加時**: `features/` に仕様書を追加
3. **インフラ変更時**: `infrastructure/` の該当ドキュメントを更新
4. **開発手順変更時**: `development/` の該当ドキュメントを更新

## 命名規約

- ファイル名: kebab-case（例: `speech-recognition.md`）
- 日本語ファイル名: そのまま維持（例: `Github開発手順.md`）
- 図表ファイル: PascalCase（例: `ERDiagram.drawio`）