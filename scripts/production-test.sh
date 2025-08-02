#!/bin/bash
# 本番デプロイ前の事前検証テスト（コスト¥0）

set -e

echo "🧪 本番デプロイ事前検証テスト開始"
echo "======================================="

# 環境変数チェック
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY が設定されていません"
    echo "export OPENAI_API_KEY=your_key を実行してください"
    exit 1
fi

echo "✅ 環境変数確認完了"

# 本番模擬環境起動
echo "🚀 本番模擬環境を起動中..."
docker-compose -f docker-compose.production-test.yml up -d

# 起動待機
echo "⏳ サービス起動を待機中..."
sleep 30

# ヘルスチェック
echo "🔍 サービス疎通確認"

# フロントエンド確認
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ フロントエンド: 正常"
else
    echo "❌ フロントエンド: エラー"
    echo "ログを確認: docker-compose -f docker-compose.production-test.yml logs frontend"
fi

# バックエンドAPI確認
if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
    echo "✅ バックエンドAPI: 正常"
else
    echo "❌ バックエンドAPI: エラー"
    echo "ログを確認: docker-compose -f docker-compose.production-test.yml logs backend"
fi

# データベース接続確認（Azure MySQL）
echo "🗄️ Azure MySQL接続テスト"
DB_TEST=$(docker-compose -f docker-compose.production-test.yml exec -T backend python -c "
import pymysql
try:
    conn = pymysql.connect(
        host='eastasiafor9th.mysql.database.azure.com',
        user='tech09thstudents',
        password='9th-tech0',
        port=3306
    )
    print('SUCCESS')
    conn.close()
except Exception as e:
    print('FAILED:', str(e))
" 2>/dev/null || echo "FAILED")

if echo "$DB_TEST" | grep -q "SUCCESS"; then
    echo "✅ データベース: Azure MySQL接続正常"
else
    echo "❌ データベース: Azure MySQL接続エラー"
    echo "詳細: $DB_TEST"
fi

# 認証APIテスト
echo "🔐 ユーザー認証テスト"
sleep 5

# テストユーザー作成
REGISTER_RESULT=$(curl -s -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prodtest@azure.com",
    "username": "azureprodtest",
    "password": "testpass123",
    "full_name": "Azure Production Test",
    "birth_date": "1990-01-01"
  }' | grep -o "ユーザー登録が完了" || echo "FAILED")

if [ "$REGISTER_RESULT" = "ユーザー登録が完了" ]; then
    echo "✅ ユーザー登録: 正常"
    
    # ログインテスト
    TOKEN=$(curl -s -X POST http://localhost:8000/login \
      -H "Content-Type: application/json" \
      -d '{
        "username": "prodtest@azure.com",
        "password": "testpass123"
      }' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo "✅ ログイン: 正常"
        
        # AIカウンセラーAPIテスト
        AI_RESPONSE=$(curl -s -X POST http://localhost:8000/api/counselor/chat \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d '{
            "message": "本番テストです",
            "context": ""
          }' | grep -o '"message"' || echo "FAILED")
        
        if [ "$AI_RESPONSE" = '"message"' ]; then
            echo "✅ AIカウンセラー: 正常（OpenAI API接続確認）"
        else
            echo "❌ AIカウンセラー: エラー（OpenAI API要確認）"
        fi
    else
        echo "❌ ログイン: エラー"
    fi
else
    echo "❌ ユーザー登録: エラー"
fi

echo "======================================="
echo "🎯 事前検証完了"
echo ""
echo "📊 結果サマリー:"
echo "- フロントエンド: http://localhost:3000"
echo "- バックエンドAPI: http://localhost:8000/docs"
echo "- データベース接続テスト完了"
echo "- 認証フローテスト完了"
echo "- AI機能テスト完了"
echo ""
echo "🚀 問題なければ本番デプロイを実行してください"
echo "❌ エラーがある場合は修正後に再テストしてください"
echo ""
echo "🛑 テスト環境停止: docker-compose -f docker-compose.production-test.yml down"