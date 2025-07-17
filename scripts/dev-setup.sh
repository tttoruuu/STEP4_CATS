#!/bin/bash
# 開発環境セットアップスクリプト

set -e

echo "🚀 Miraim開発環境セットアップを開始します..."

# 必要なツールの確認
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 が見つかりません。インストールしてください。"
        exit 1
    fi
}

echo "📋 必要なツールの確認中..."
check_command "node"
check_command "npm"
check_command "python3"
check_command "pip"
check_command "docker"
check_command "docker-compose"

echo "✅ 必要なツールが揃っています"

# Node.jsバージョン確認
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v18\. ]]; then
    echo "⚠️  Node.js 18.x の使用を推奨します"
fi

# Pythonバージョン確認
PYTHON_VERSION=$(python3 --version)
echo "🐍 Python version: $PYTHON_VERSION"
if [[ ! "$PYTHON_VERSION" =~ "Python 3.10" ]]; then
    echo "⚠️  Python 3.10 の使用を推奨します"
fi

# フロントエンド依存関係のインストール
echo "📦 フロントエンド依存関係をインストール中..."
cd frontend
npm install
cd ..

# バックエンド依存関係のインストール
echo "🐍 バックエンド依存関係をインストール中..."
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
cd ..

# 環境変数ファイルの設定
echo "🔧 環境変数ファイルを設定中..."
if [ ! -f "config/.env.development" ]; then
    cp config/.env.example config/.env.development
    echo "✅ 開発環境用設定ファイルを作成しました: config/.env.development"
else
    echo "📄 開発環境用設定ファイルは既に存在します"
fi

# Dockerイメージのビルド
echo "🐳 Dockerイメージをビルド中..."
docker-compose -f docker-compose.development.yml build

echo ""
echo "🎉 開発環境のセットアップが完了しました！"
echo ""
echo "開発を開始するには以下のコマンドを選択してください:"
echo ""
echo "ローカル開発:"
echo "  make dev                # ローカルでフロントエンド・バックエンドを起動"
echo "  cd frontend && npm run dev    # フロントエンドのみ"
echo "  cd backend && uvicorn main:app --reload    # バックエンドのみ"
echo ""
echo "Docker開発:"
echo "  make docker-dev         # Docker環境で全サービス起動"
echo "  docker-compose -f docker-compose.development.yml up -d"
echo ""
echo "アクセス先:"
echo "  フロントエンド: http://localhost:3000"
echo "  バックエンド: http://localhost:8000"
echo "  API仕様書: http://localhost:8000/docs"
echo ""
echo "その他のコマンド:"
echo "  make help              # 利用可能なコマンド一覧"
echo "  make test              # テスト実行"
echo "  make lint              # コード品質チェック"