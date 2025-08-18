# feat(frontend): add features/help pages and top quick links

## 概要
ホーム画面から簡単にアクセスできる `/features`（特徴）と `/help`（ヘルプ）ページを実装し、ユーザビリティを向上させました。右上の固定ボタンにより、どのページからでもこれらの機能にすぐアクセス可能です。

### 主な追加機能
- **機能紹介ページ** (`/features`): アプリの4つの主要機能とその価値をスライダー形式で紹介
- **ヘルプページ** (`/help`): FAQ とガイドを整理し、タブ形式で提供
- **クイックナビゲーション** (`TopQuickLinks`): ホーム画面右上に常時表示される「特徴」「ヘルプ」ボタン
- **API統合**: バックエンドエンドポイント `GET /features`, `GET /help/faqs`（ダミーJSON / CORS対応）

## 変更内容

### Frontend
- **新規ページ**:
  - `pages/features.js`: 機能紹介（スライダー、4つの主要機能詳細）
  - `pages/help.js`: ヘルプ（FAQ、使い方ガイド、タブ式UI）
- **新規コンポーネント**:
  - `components/TopQuickLinks.js`: 右上固定ボタン（特徴・ヘルプ）
  - `lib/api.js`: APIクライアント（features, help用）
- **既存修正**:
  - `components/Layout.js`: Footer表示条件を `/features`, `/help` に拡張
  - `pages/index.js`: TopQuickLinksコンポーネントをマウント
- **スタイル**: 既存 `neo-btn` 系を踏襲、相対遷移（ポート/絶対URLのハードコードなし）

### Backend
- **新規ルーター**:
  - `routers/features.py`: `/features` エンドポイント（4つの機能、キーポイント）
  - `routers/help.py`: `/help/faqs` エンドポイント（FAQ、ガイド、ヒント）
- **設定**:
  - `main.py`: 新ルーター登録、CORS設定更新
  - CORS: `http://localhost:3000`, `http://127.0.0.1:3000` 許可

## 変更ファイル

### Frontend (7ファイル)
- 🆕 `frontend/components/TopQuickLinks.js`
- 🆕 `frontend/lib/api.js`
- 🆕 `frontend/pages/features.js`
- 🆕 `frontend/pages/help.js`
- 🆕 `frontend/test-features.html`
- 🔧 `frontend/components/Layout.js`
- 🔧 `frontend/pages/index.js`

### Backend (3ファイル)
- 🆕 `backend/routers/features.py`
- 🆕 `backend/routers/help.py`
- 🔧 `backend/main.py`

## 動作確認

### 1. 起動
```bash
# バックエンド
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# フロントエンド（別ターミナル）
cd frontend && npm run dev -- --port 3001
```

### 2. API確認
```bash
# Features API
curl http://localhost:8000/features
# → 200: { "features": [...], "key_points": [...] }

# Help API
curl http://localhost:8000/help/faqs
# → 200: { "faqs": [...], "guide_steps": [...], "tips": [...] }
```

### 3. UI確認
- **ホーム画面** (`http://localhost:3001/`): 右上に「特徴」「ヘルプ」ボタン表示
- **特徴ページ** (`/features`): スライダー + 4つの機能詳細、ホームに戻るリンク
- **ヘルプページ** (`/help`): FAQ/ガイドタブ、カテゴリフィルター、ホームに戻るリンク
- **ナビゲーション**: 各ページ間の相対リンクのみ（絶対URL/ポートのハードコードなし）

## チェックリスト
- [x] Next.js Pages Router を使用（App Router ではない）
- [x] 既存UIパターン（neo-btn, Layout）に準拠
- [x] API統合とエラーハンドリング実装
- [x] レスポンシブ対応（mobile-first）
- [x] アクセシビリティ（aria-label）対応
- [x] 相対リンクのみ（絶対URL/ポートのハードコードなし）
- [x] CORS 設定は開発用のみ許可
- [x] 変更ファイルは必要最小限
- [ ] Lint/Build パス
- [ ] スクショ添付

## 実装統計
- **10ファイル変更**: 791行追加、4行削除
- **新規作成**: 7ファイル（frontend: 5, backend: 2）
- **既存修正**: 3ファイル（Layout, index.js, main.py）
- **コミット**: 4件（機能追加 → Layout統合 → クイックナビ → クリーンアップ）

---
🤖 Generated with [Claude Code](https://claude.ai/code)