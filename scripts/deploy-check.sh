#!/bin/bash

# =================================================================
# デプロイ時自動チェックスクリプト
# Container Apps環境のAPIエンドポイント設定を検証・修正する
# =================================================================

set -e  # エラー時にスクリプトを終了

# 色付きログ用の定数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 設定
RESOURCE_GROUP="rg-001-gen9"
FRONTEND_APP="miraim-frontend"
BACKEND_APP="miraim-backend"
EXPECTED_BACKEND_URL="https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"

# ログ関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Azure CLIの認証確認
check_azure_auth() {
    log_info "Azure CLI認証状態を確認中..."
    
    if ! az account show &> /dev/null; then
        log_error "Azure CLIにログインしていません"
        log_info "以下のコマンドでログインしてください:"
        echo "az login"
        exit 1
    fi
    
    local subscription_id=$(az account show --query id -o tsv)
    local subscription_name=$(az account show --query name -o tsv)
    log_success "Azure認証OK: $subscription_name ($subscription_id)"
}

# Container Appsの状態確認
check_container_apps_status() {
    log_info "Container Apps状態を確認中..."
    
    # フロントエンドの状態確認
    local frontend_status=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.runningStatus" -o tsv 2>/dev/null || echo "NotFound")
    
    # バックエンドの状態確認
    local backend_status=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "properties.runningStatus" -o tsv 2>/dev/null || echo "NotFound")
    
    log_info "フロントエンド状態: $frontend_status"
    log_info "バックエンド状態: $backend_status"
    
    if [[ "$frontend_status" != "Running" ]]; then
        log_warning "フロントエンドが実行中ではありません"
    fi
    
    if [[ "$backend_status" != "Running" ]]; then
        log_warning "バックエンドが実行中ではありません"
    fi
    
    if [[ "$frontend_status" == "Running" && "$backend_status" == "Running" ]]; then
        log_success "両方のContainer Appsが正常に実行中です"
        return 0
    else
        return 1
    fi
}

# フロントエンド環境変数の確認・修正
fix_frontend_env_vars() {
    log_info "フロントエンドの環境変数を確認中..."
    
    # 現在の環境変数を取得
    local current_api_url=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.template.containers[0].env[?name=='NEXT_PUBLIC_API_URL'].value" -o tsv 2>/dev/null || echo "")
    
    log_info "現在のAPI URL: $current_api_url"
    log_info "期待されるAPI URL: $EXPECTED_BACKEND_URL"
    
    # API URLの確認
    if [[ -z "$current_api_url" ]]; then
        log_warning "NEXT_PUBLIC_API_URLが設定されていません"
        needs_update=true
    elif [[ "$current_api_url" != "$EXPECTED_BACKEND_URL" ]]; then
        log_warning "API URLが期待値と異なります"
        log_warning "現在: $current_api_url"
        log_warning "期待: $EXPECTED_BACKEND_URL"
        needs_update=true
    else
        log_success "API URLは正しく設定されています"
        needs_update=false
    fi
    
    # 問題があるURLパターンの検出
    if [[ "$current_api_url" == *"backend:8000"* ]] || [[ "$current_api_url" == *"localhost"* ]]; then
        log_error "本番環境で不適切なAPI URLが検出されました: $current_api_url"
        needs_update=true
    fi
    
    # 環境変数の更新が必要な場合
    if [[ "$needs_update" == "true" ]]; then
        log_info "環境変数を修正中..."
        
        az containerapp update \
            --name $FRONTEND_APP \
            --resource-group $RESOURCE_GROUP \
            --set-env-vars \
                NEXT_PUBLIC_API_URL="$EXPECTED_BACKEND_URL" \
                NODE_ENV=production \
                ENVIRONMENT=production \
            --query "properties.runningStatus" -o tsv > /dev/null
        
        log_success "環境変数を修正しました"
        
        # 少し待機してから状態確認
        log_info "新しいリビジョンの展開を待機中..."
        sleep 30
        
        # 更新後の確認
        local updated_api_url=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.template.containers[0].env[?name=='NEXT_PUBLIC_API_URL'].value" -o tsv)
        
        if [[ "$updated_api_url" == "$EXPECTED_BACKEND_URL" ]]; then
            log_success "環境変数の修正が確認されました"
        else
            log_error "環境変数の修正に失敗しました"
            return 1
        fi
    fi
    
    return 0
}

# リビジョンの確認
check_revisions() {
    log_info "最新リビジョンを確認中..."
    
    # フロントエンドのリビジョン
    log_info "フロントエンドリビジョン:"
    az containerapp revision list --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "[].{Name:name,Active:properties.active,TrafficWeight:properties.trafficWeight,HealthState:properties.healthState}" -o table
    
    # バックエンドのリビジョン
    log_info "バックエンドリビジョン:"
    az containerapp revision list --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "[].{Name:name,Active:properties.active,TrafficWeight:properties.trafficWeight,HealthState:properties.healthState}" -o table
}

# エンドポイントの疎通確認
test_endpoints() {
    log_info "エンドポイントの疎通確認中..."
    
    # フロントエンドエンドポイント
    local frontend_url="https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    local backend_url="$EXPECTED_BACKEND_URL"
    
    log_info "フロントエンド疎通確認: $frontend_url"
    if curl -s -o /dev/null -w "%{http_code}" "$frontend_url" | grep -q "200\|301\|302"; then
        log_success "フロントエンドは正常にアクセス可能です"
    else
        log_warning "フロントエンドへのアクセスに問題があります"
    fi
    
    log_info "バックエンド疎通確認: $backend_url"
    if curl -s -o /dev/null -w "%{http_code}" "$backend_url" | grep -q "200\|404"; then
        log_success "バックエンドは正常にアクセス可能です"
    else
        log_warning "バックエンドへのアクセスに問題があります"
    fi
}

# 最終確認とサマリー
show_summary() {
    log_info "デプロイ確認サマリー"
    echo "=================================="
    
    # Container Apps URL
    echo "📱 フロントエンド: https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    echo "🔧 バックエンド: $EXPECTED_BACKEND_URL"
    
    # 現在の状態
    local frontend_status=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.runningStatus" -o tsv)
    local backend_status=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "properties.runningStatus" -o tsv)
    
    echo "📊 ステータス:"
    echo "   フロントエンド: $frontend_status"
    echo "   バックエンド: $backend_status"
    
    # 環境変数確認
    local current_api_url=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.template.containers[0].env[?name=='NEXT_PUBLIC_API_URL'].value" -o tsv)
    echo "🔗 API URL: $current_api_url"
    
    echo "=================================="
    
    if [[ "$frontend_status" == "Running" && "$backend_status" == "Running" && "$current_api_url" == "$EXPECTED_BACKEND_URL" ]]; then
        log_success "✅ デプロイ確認完了 - すべて正常です"
        return 0
    else
        log_warning "⚠️ 一部に問題があります - 手動で確認してください"
        return 1
    fi
}

# メイン処理
main() {
    echo "================================================"
    echo "🚀 Miraim デプロイ自動チェック"
    echo "実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
    
    # 各チェックを実行
    check_azure_auth
    echo ""
    
    check_container_apps_status
    echo ""
    
    fix_frontend_env_vars
    echo ""
    
    check_revisions
    echo ""
    
    test_endpoints
    echo ""
    
    show_summary
    
    local exit_code=$?
    echo ""
    echo "================================================"
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "🎉 デプロイチェック完了"
    else
        log_warning "⚠️ 要注意事項があります"
    fi
    
    exit $exit_code
}

# ヘルプ表示
show_help() {
    echo "Miraim デプロイ自動チェックスクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0                    - フルチェックを実行"
    echo "  $0 --help            - このヘルプを表示"
    echo "  $0 --env-only        - 環境変数のチェックのみ"
    echo "  $0 --status-only     - ステータス確認のみ"
    echo ""
    echo "このスクリプトは以下を実行します:"
    echo "1. Azure CLI認証確認"
    echo "2. Container Apps状態確認"
    echo "3. 環境変数の確認・修正"
    echo "4. リビジョン確認"
    echo "5. エンドポイント疎通確認"
    echo "6. 最終サマリー表示"
}

# コマンドライン引数の処理
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --env-only)
        check_azure_auth
        fix_frontend_env_vars
        exit $?
        ;;
    --status-only)
        check_azure_auth
        check_container_apps_status
        show_summary
        exit $?
        ;;
    *)
        main
        ;;
esac