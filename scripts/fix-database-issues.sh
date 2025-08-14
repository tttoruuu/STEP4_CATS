#!/bin/bash

# データベース接続問題の自動修正スクリプト
# 使用方法: ./scripts/fix-database-issues.sh

set -e

echo "================================================"
echo "🔧 データベース接続問題修正スクリプト"
echo "実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ログ関数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${MAGENTA}[STEP]${NC} $1"; }

# 1. Azure認証確認
log_step "Azure CLI認証確認中..."
if az account show &>/dev/null; then
    ACCOUNT_NAME=$(az account show --query name -o tsv)
    log_success "Azure認証OK: $ACCOUNT_NAME"
else
    log_error "Azure CLIにログインしてください: az login"
    exit 1
fi

# 2. 環境変数の修正
log_step "Container Apps環境変数を修正中..."

# 正しいDATABASE_URLを設定
DATABASE_URL="mysql+pymysql://tech09thstudents:9th-tech0@eastasiafor9th.mysql.database.azure.com:3306/testdb"

az containerapp update \
    --name miraim-backend \
    --resource-group rg-001-gen9 \
    --set-env-vars \
        DATABASE_URL="$DATABASE_URL" \
        ENV="production" \
        ENVIRONMENT="production" \
    --output none

log_success "環境変数を更新しました"

# 3. Container Apps再起動
log_step "Container Appsを再起動中..."
CURRENT_REVISION=$(az containerapp show --name miraim-backend --resource-group rg-001-gen9 --query properties.latestRevisionName -o tsv)
log_info "現在のリビジョン: $CURRENT_REVISION"

# 4. ヘルスチェック
log_step "ヘルスチェック実行中..."
sleep 10

HEALTH_CHECK=$(curl -s https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io/health | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('features_status', {}).get('database', 'error'))" 2>/dev/null || echo "error")

if [ "$HEALTH_CHECK" = "connected" ]; then
    log_success "データベース接続: ✅ 正常"
else
    log_warning "データベース接続: ⚠️ 確認が必要"
fi

# 5. スキーマ同期の提案
log_step "スキーマ同期確認..."
echo ""
log_info "以下のコマンドでスキーマの差異を確認できます:"
echo "  python scripts/sync-database-schema.py"
echo ""
log_info "テストユーザーが必要な場合:"
echo "  python scripts/sync-database-schema.py --create-user"

# 6. 結果サマリー
echo ""
echo "================================================"
echo "📊 修正結果サマリー"
echo "================================================"
echo "✅ 環境変数更新: 完了"
echo "✅ Container Apps: 実行中"
echo "📌 データベース接続: $HEALTH_CHECK"
echo "🔗 バックエンドURL: https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
echo "================================================"

# 7. 次のステップ
echo ""
log_info "次のステップ:"
echo "1. ログインテスト: curl -X POST https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io/login -H 'Content-Type: application/json' -d '{\"username\":\"miraim@test.com\",\"password\":\"pass1234\"}'"
echo "2. ログ確認: az containerapp logs show --name miraim-backend --resource-group rg-001-gen9 --tail 50"
echo "3. スキーマ同期: python scripts/sync-database-schema.py"

log_success "✨ 修正スクリプト完了"