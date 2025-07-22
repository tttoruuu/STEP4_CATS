# 🐳 Miraim - 会話練習アプリ セットアップガイド

このドキュメントは、AI を使った会話練習アプリ「Miraim」をローカル環境で動かす手順を説明します。
Dockerを使ったことがない方でも簡単にセットアップできるよう、丁寧に解説しています。

## アプリについて

Miraimは結婚相談所での会話練習を支援するWebアプリケーションです。
- AI相手との自然な会話練習
- 会話後の詳細なフィードバック
- 複数の会話相手パターン
- 難易度レベルの調整

---

## 1. Dockerって何？

Dockerは「アプリを動かすための環境まるごとパッケージ」にできる便利なツールです。  
自分のPCでも、他の人のPCでも、同じようにアプリを動かせるようになります。

---

## 2. 必要なツールをインストール

### ✅ Docker Desktop（必須）

- 公式サイト: https://www.docker.com/products/docker-desktop/
- 自分のOSに合ったバージョンをインストールしてください
- インストール後、一度再起動しておくと確実です

---

## 3. リポジトリをクローンする

```bash
git clone リポジトリURL
cd プロジェクトディレクトリ
```

## 4. 環境変数ファイル（.env）を設定する

### ルートディレクトリの `.env` ファイルを作成

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の内容を記述:
```
OPENAI_API_KEY=あなたのOpenAI APIキー
```

※ OpenAI APIキーは [OpenAI Platform](https://platform.openai.com/) から取得できます  
※ キーは他の人と共有しないように注意してください

### backend/.env ファイルを作成

```
ENV=development
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=mysql+pymysql://root:password@db:3306/testdb
```

### frontend/.env.local ファイルを作成

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 5. Dockerでアプリを起動する

以下のコマンド1つで、フロントエンド / バックエンド / DB が一括で起動します：

```bash
docker-compose up -d
```

初回起動時は、ビルドに数分かかることがあります。

### ビルドが必要なケース
- Dockerfile を変更したとき（例：パッケージ追加など）
- requirements.txt や package.json を変更したとき
- .dockerignore を追加・編集したとき

ビルドコマンド:
```bash
docker-compose up -d --build
```

※ コード変更のみならリアルタイムで反映されています

### アプリケーションへのアクセス

起動後、以下のURLにアクセスできます：

| サービス名 | アクセスURL |
|------------|------------|
| フロントエンド（Next.js） | http://localhost:3000 |
| バックエンドAPI（FastAPI） | http://localhost:8000 |
| バックエンドドキュメント | http://localhost:8000/docs |
| MySQLデータベース | localhost:3306 (ユーザー: root, パスワード: password) |

## 6. アプリを止めたいとき

```bash
docker-compose down
```

これで全てのコンテナが停止します。

## 7. よくあるトラブルと対処法

| トラブル内容 | 原因 | 解決策 |
|--------------|------|--------|
| `port is already in use` | すでにそのポートを使っているアプリがある | 別のアプリを終了する or ポート番号を変更 |
| `Cannot connect to database` | `.env` の設定ミス | DBのユーザー名・パスワードが合っているか確認 |
| 起動が遅い | 初回は時間がかかる | 2回目以降は早くなります |
| `command not found: docker` | Docker未インストール | Docker Desktopをインストールしてください |
| **OpenAI APIの認証エラー** | APIキーの問題 | `.env` ファイルのキーを確認、OpenAIダッシュボードでキーの有効性を確認 |
| **バックエンドとフロントエンドの接続問題** | 環境変数の設定ミス | `frontend/.env.local` の API URL 設定を確認 |

## 8. データベースの中身を確認する

MySQLに入ってテーブルやデータを直接確認することもできます。

```bash
# コンテナに入る
docker exec -it db mysql -u root -p
# パスワードは password（環境変数で設定した値）

# 中に入ったら以下のように操作できます
USE testdb;
SHOW TABLES;
SELECT * FROM users;
```

## 9. ログの確認

アプリケーションの動作やエラーを確認するには、コンテナのログを表示します:

```bash
# バックエンドのログを表示
docker-compose logs -f backend

# フロントエンドのログを表示
docker-compose logs -f frontend

# すべてのコンテナのログを表示
docker-compose logs -f
```

## 10. 開発上の注意点

### 会話機能の仕組み
- **AI会話**: OpenAI GPT-4oを使用した自然な会話
- **会話相手**: データベースに登録された複数のキャラクター
- **難易度調整**: 初回会話・2回目以降で会話スタイルを調整
- **フィードバック**: 会話終了後にAIが分析した改善点を提供

### 技術構成
- **フロントエンド**: Next.js (React) - ユーザーインターフェース
- **バックエンド**: FastAPI (Python) - API・AI処理
- **データベース**: MySQL - ユーザー・会話相手データ
- **AI**: OpenAI GPT-4o - 会話生成・フィードバック分析

### セキュリティとAPIキー管理
- OpenAI APIキーは`.env`ファイルで管理
- **重要**: APIキーは絶対にGitHubなどの公開リポジトリにコミットしない
- チーム内共有時は安全な方法（パスワード管理ツールなど）を使用

---

🎉 お疲れさまでした！
以上でセットアップは完了です！何か分からないことがあれば、チームに気軽に聞いてください。

