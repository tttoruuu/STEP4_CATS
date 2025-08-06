#!/bin/bash

# =================================================================
# Miraim Azure Container Apps 統合デプロイスクリプト
# GitHub Actionsを使わずにAzure CLIから直接デプロイ
# =================================================================

set -e  # エラー時にスクリプトを終了

# 色付きログ用の定数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 設定
RESOURCE_GROUP="rg-001-gen9"
REGISTRY_NAME="acrtech0for9th"
REGISTRY_URL="acrtech0for9th.azurecr.io"
FRONTEND_APP="miraim-frontend"
BACKEND_APP="miraim-backend"

# イメージタグ（タイムスタンプベース）
TIMESTAMP=$(date +%Y%m%d%H%M%S)
FRONTEND_TAG="frontend:${TIMESTAMP}"
BACKEND_TAG="miraim-backend:${TIMESTAMP}"

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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 前提条件の確認
check_prerequisites() {
    log_step "前提条件の確認中..."
    
    # Azure CLI認証確認
    if ! az account show &> /dev/null; then
        log_error "Azure CLIにログインしていません"
        log_info "以下のコマンドでログインしてください:"
        echo "az login"
        exit 1
    fi
    
    # Docker確認
    if ! command -v docker &> /dev/null; then
        log_error "Dockerが見つかりません"
        exit 1
    fi
    
    # Container Registry認証
    log_info "Container Registryにログイン中..."
    az acr login --name $REGISTRY_NAME
    
    local subscription_id=$(az account show --query id -o tsv)
    local subscription_name=$(az account show --query name -o tsv)
    log_success "Azure認証OK: $subscription_name ($subscription_id)"
}

# フロントエンドのビルドとプッシュ
deploy_frontend() {
    log_step "フロントエンドのデプロイ開始..."
    
    cd frontend
    
    # 環境変数検証
    log_info "環境変数の検証中..."
    export NEXT_PUBLIC_API_URL=https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io
    export NODE_ENV=production
    npm run validate-env:production || true
    
    # Dockerイメージビルド
    log_info "Dockerイメージをビルド中... (タグ: $FRONTEND_TAG)"
    docker build \
        --build-arg NODE_ENV=production \
        --build-arg NEXT_PUBLIC_API_URL=https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io \
        -t $REGISTRY_URL/$FRONTEND_TAG \
        -f Dockerfile .
    
    # Container Registryにプッシュ
    log_info "Container Registryにプッシュ中..."
    docker push $REGISTRY_URL/$FRONTEND_TAG
    
    # Container Appを更新
    log_info "Container Appを更新中..."
    az containerapp update \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image $REGISTRY_URL/$FRONTEND_TAG \
        --set-env-vars \
            NEXT_PUBLIC_API_URL=https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io \
            NODE_ENV=production \
            ENVIRONMENT=production
    
    # latest タグも更新
    log_info "latestタグを更新中..."
    docker tag $REGISTRY_URL/$FRONTEND_TAG $REGISTRY_URL/frontend:latest
    docker push $REGISTRY_URL/frontend:latest
    
    cd ..
    log_success "フロントエンドデプロイ完了"
}

# バックエンドのビルドとプッシュ
deploy_backend() {
    log_step "バックエンドのデプロイ開始..."
    
    cd backend
    
    # Dockerイメージビルド
    log_info "Dockerイメージをビルド中... (タグ: $BACKEND_TAG)"
    docker build \
        -t $REGISTRY_URL/$BACKEND_TAG \
        -f Dockerfile .
    
    # Container Registryにプッシュ
    log_info "Container Registryにプッシュ中..."
    docker push $REGISTRY_URL/$BACKEND_TAG
    
    # Container Appを更新
    log_info "Container Appを更新中..."
    az containerapp update \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image $REGISTRY_URL/$BACKEND_TAG
    
    # latest タグも更新
    log_info "latestタグを更新中..."
    docker tag $REGISTRY_URL/$BACKEND_TAG $REGISTRY_URL/miraim-backend:latest
    docker push $REGISTRY_URL/miraim-backend:latest
    
    cd ..
    log_success "バックエンドデプロイ完了"
}

# デプロイメント後の確認
verify_deployment() {
    log_step "デプロイメント結果の確認中..."
    
    # 少し待機
    log_info "新しいリビジョンの展開を待機中..."
    sleep 60
    
    # Container Apps状態確認
    log_info "Container Apps状態:"
    az containerapp list \
        --resource-group $RESOURCE_GROUP \
        --query "[?contains(name, 'miraim')].{Name:name, Status:properties.runningStatus, FQDN:properties.configuration.ingress.fqdn}" \
        --output table
    
    # リビジョン確認
    log_info "最新リビジョン:"
    echo "フロントエンド:"
    az containerapp revision list \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --query "[0].{Name:name,TrafficWeight:properties.trafficWeight,HealthState:properties.healthState}" \
        --output table
    
    echo "バックエンド:"
    az containerapp revision list \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --query "[0].{Name:name,TrafficWeight:properties.trafficWeight,HealthState:properties.healthState}" \
        --output table
    
    # エンドポイント疎通確認
    log_info "エンドポイント疎通確認..."
    
    local frontend_url="https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    local backend_url="https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    
    if curl -s -o /dev/null -w "%{http_code}" "$frontend_url" | grep -q "200\|301\|302"; then
        log_success "フロントエンド疎通OK: $frontend_url"
    else
        log_warning "フロントエンド疎通に問題: $frontend_url"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" "$backend_url" | grep -q "200\|404"; then
        log_success "バックエンド疎通OK: $backend_url"
    else
        log_warning "バックエンド疎通に問題: $backend_url"
    fi
}

# デプロイ後の自動チェック実行
run_post_deploy_check() {
    log_step "デプロイ後チェック実行..."
    
    if [[ -f "./scripts/deploy-check.sh" ]]; then
        ./scripts/deploy-check.sh
    else
        log_warning "deploy-check.shが見つかりません。手動で確認してください。"
    fi
}

# 使用方法表示
show_usage() {
    echo "Miraim Azure Container Apps デプロイスクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0                    - フロントエンド・バックエンド両方をデプロイ"
    echo "  $0 --frontend-only    - フロントエンドのみをデプロイ"
    echo "  $0 --backend-only     - バックエンドのみをデプロイ"
    echo "  $0 --verify-only      - デプロイ状態の確認のみ"
    echo "  $0 --help             - このヘルプを表示"
    echo ""
    echo "環境:"
    echo "  リソースグループ: $RESOURCE_GROUP"
    echo "  Container Registry: $REGISTRY_URL"
    echo "  フロントエンドアプリ: $FRONTEND_APP"
    echo "  バックエンドアプリ: $BACKEND_APP"
    echo ""
    echo "デプロイされるイメージ:"
    echo "  フロントエンド: $REGISTRY_URL/$FRONTEND_TAG"
    echo "  バックエンド: $REGISTRY_URL/$BACKEND_TAG"
}

# メイン処理
main() {
    echo "================================================"
    echo "🚀 Miraim Azure Container Apps デプロイ"
    echo "実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "デプロイタグ: $TIMESTAMP"
    echo "================================================"
    
    check_prerequisites
    echo ""
    
    deploy_frontend
    echo ""
    
    deploy_backend
    echo ""
    
    verify_deployment
    echo ""
    
    run_post_deploy_check
    
    echo ""
    echo "================================================"
    log_success "🎉 デプロイ完了!"
    echo ""
    echo "📱 フロントエンド: https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    echo "🔧 バックエンド: https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
    echo ""
    echo "🏷️ デプロイされたイメージ:"
    echo "   Frontend: $REGISTRY_URL/$FRONTEND_TAG"
    echo "   Backend: $REGISTRY_URL/$BACKEND_TAG"
    echo "================================================"
}

# フロントエンドのみデプロイ
frontend_only() {
    echo "================================================"
    echo "🚀 フロントエンドのみデプロイ"
    echo "実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
    
    check_prerequisites
    echo ""
    
    deploy_frontend
    echo ""
    
    verify_deployment
    echo ""
    
    log_success "🎉 フロントエンドデプロイ完了!"
}

# バックエンドのみデプロイ
backend_only() {
    echo "================================================"
    echo "🚀 バックエンドのみデプロイ"
    echo "実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
    
    check_prerequisites
    echo ""
    
    deploy_backend
    echo ""
    
    verify_deployment
    echo ""
    
    log_success "🎉 バックエンドデプロイ完了!"
}

# コマンドライン引数の処理
case "${1:-}" in
    --frontend-only)
        frontend_only
        ;;
    --backend-only)
        backend_only
        ;;
    --verify-only)
        check_prerequisites
        verify_deployment
        run_post_deploy_check
        ;;
    --help|-h)
        show_usage
        exit 0
        ;;
    *)
        main
        ;;
esac