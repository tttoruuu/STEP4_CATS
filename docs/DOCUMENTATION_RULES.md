# 📚 ドキュメント運用ルール

このファイルは、MIRAIMプロジェクトのマークダウンファイル運用ルールを定義します。

## 🗂️ ディレクトリ構造

```
/miraim
├── CLAUDE.md              # 🔴 基盤: Claude Code用指示書（更新頻度: 高）
├── APP_PLAN.md           # 🔴 基盤: アプリ仕様・機能定義（更新頻度: 中）
├── CLAUDE_PRIVATE.md     # 🔐 機密: Azure設定・認証情報（Git除外）
├── README.md             # 📖 公開: GitHubリポジトリ説明
│
├── /docs                 # 📁 設計・仕様ドキュメント
│   ├── UI_DESIGN_GUIDE.md      # UIデザインガイドライン
│   ├── DOCUMENTATION_RULES.md   # このファイル
│   ├── API_SPEC.md             # API仕様書
│   ├── DATABASE_SCHEMA.md      # DB設計書
│   └── ARCHITECTURE.md         # システム構成図
│
├── /docs/features        # 📁 機能別仕様書
│   ├── ai-counselor.md         # AIカウンセラー機能
│   ├── conversation-practice.md # 会話練習機能
│   ├── compatibility-test.md   # 相性診断機能
│   └── styling-proposal.md     # スタイリング提案機能
│
├── /docs/meetings        # 📁 チーム作業記録
│   ├── 2025-01-08_design.md   # 日付_内容.md形式
│   └── template.md             # 議事録テンプレート
│
├── /scripts              # 🔧 実行スクリプト
│   └── README.md               # スクリプト説明書
│
├── /frontend             # 🎨 フロントエンド
│   └── README.md               # フロントエンド開発ガイド
│
└── /backend              # ⚙️ バックエンド
    └── README.md               # バックエンド開発ガイド
```

## 📝 ファイル種別と役割

### 1. 🔴 基盤ファイル（変更は慎重に）
| ファイル | 役割 | 更新権限 | 更新時ルール |
|---------|------|---------|------------|
| CLAUDE.md | Claude Code作業指示書 | チームリーダー | 事前確認必須 |
| APP_PLAN.md | アプリ全体仕様書 | 全員 | PR必須 |
| CLAUDE_PRIVATE.md | 機密情報 | 管理者のみ | Git除外 |

### 2. 📁 設計ドキュメント（/docs）
| ファイル | 役割 | 更新タイミング |
|---------|------|--------------|
| UI_DESIGN_GUIDE.md | UIルール統一 | デザイン変更時 |
| API_SPEC.md | API仕様 | エンドポイント追加時 |
| DATABASE_SCHEMA.md | DB設計 | テーブル変更時 |
| ARCHITECTURE.md | システム構成 | 構成変更時 |

### 3. 📋 機能仕様書（/docs/features）
- 各機能の詳細仕様を記載
- ファイル名: `機能名-英語.md`（kebab-case）
- 内容: 要件、設計、実装メモ

### 4. 📝 作業記録（/docs/meetings）
- ファイル名: `YYYY-MM-DD_内容.md`
- 個人メモや一時的な記録
- 定期的にアーカイブ

## ✍️ 記述ルール

### ファイル名規則
```
✅ 良い例:
- ai-counselor.md（機能仕様）
- 2025-01-08_ui-design.md（作業記録）
- API_SPEC.md（設計文書）

❌ 悪い例:
- AIカウンセラー.md（日本語）
- ai_counselor_機能.md（混在）
- memo.md（不明確）
```

### 必須セクション
```markdown
# タイトル

## 概要
簡潔な説明

## 目的
なぜこのドキュメントが必要か

## 内容
本文

## 更新履歴
- YYYY-MM-DD: 更新内容
```

### マークダウン記法
```markdown
# 見出し1 - ファイルタイトル
## 見出し2 - 大セクション
### 見出し3 - 小セクション

- リスト項目
  - ネストリスト

1. 番号付きリスト

`コード` - インラインコード

​```言語名
コードブロック
​```

| 表 | ヘッダー |
|----|---------|
| 内容 | 内容 |

**太字** *斜体*

> 引用

[リンク](URL)
```

## 🚀 運用フロー

### 新規ドキュメント作成時
1. 適切なディレクトリを選択
2. ファイル名規則に従う
3. 必須セクションを含める
4. CLAUDE.mdの索引を更新

### 既存ドキュメント更新時
1. 更新履歴を記載
2. 関連ファイルも確認
3. 重要変更はチームに通知

### 定期メンテナンス（月1回）
1. 不要ファイルをアーカイブ
2. リンク切れチェック
3. 内容の最新化確認

## 🎯 目的別ガイド

### Claude Codeに作業させたい時
→ `CLAUDE.md` を更新

### 新機能の仕様を書きたい時
→ `/docs/features/` に新規作成

### 今日の作業メモを残したい時
→ `/docs/meetings/YYYY-MM-DD_内容.md` を作成

### UIの統一ルールを確認したい時
→ `/docs/UI_DESIGN_GUIDE.md` を参照

### APIの仕様を確認したい時
→ `/docs/API_SPEC.md` を参照

## ⚠️ 注意事項

### やってはいけないこと
- ❌ ルートディレクトリに個人メモを作成
- ❌ 日本語ファイル名の使用
- ❌ CLAUDE.mdの無断変更
- ❌ 更新履歴なしの大幅変更

### 推奨事項
- ✅ 定期的な整理整頓
- ✅ 明確なファイル名
- ✅ 適切なディレクトリ配置
- ✅ 更新履歴の記載

## 📊 現在のドキュメント状況

### ✅ 整理完了（2025-01-08）
- AIカウンセラー関連 → `/docs/features/` へ統合
- 作業記録・修正ログ → `/docs/meetings/` へ移動
- 機能仕様 → `/docs/features/` へ集約
- `/docs/README.md` 更新済み（インデックス機能追加）

### 📁 最適化されたディレクトリ構造
```
/docs
├── README.md（インデックス）
├── DOCUMENTATION_RULES.md（このファイル）
├── UI_DESIGN_GUIDE.md（UIガイド）
├── API_KEY_SETUP.md（API設定）
├── /features/（機能仕様 - 17ファイル）
├── /deployment/（デプロイ - 5ファイル）
├── /development/（開発 - 5ファイル）
├── /infrastructure/（インフラ - 3ファイル）
├── /meetings/（作業記録 - 4ファイル）
├── /testing/（テスト - 1ファイル）
├── /wireframes/（UI - 2ファイル）
├── /diagrams/（設計図 - 2ファイル）
├── /resources/（参考資料）
└── /audio/（音声仕様 - 1ファイル）
```

## 更新履歴
- 2025-01-08: 初版作成、運用ルール定義
- 2025-01-08: ディレクトリ構造最適化完了