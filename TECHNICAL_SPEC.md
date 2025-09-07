# MiraiM 技術仕様書

**Version**: 1.0.0  
**Last Updated**: 2024-09-05  
**Classification**: Confidential

## 目次

1. [システムアーキテクチャ](#システムアーキテクチャ)
2. [技術スタック詳細](#技術スタック詳細)
3. [API仕様](#api仕様)
4. [データベース設計](#データベース設計)
5. [セキュリティ実装](#セキュリティ実装)
6. [デプロイメント](#デプロイメント)
7. [パフォーマンス最適化](#パフォーマンス最適化)
8. [監視とログ](#監視とログ)

## システムアーキテクチャ

### 全体構成図

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Web App   │  │  Mobile PWA  │  │   Admin UI    │ │
│  │  (Next.js)  │  │  (Next.js)   │  │  (Next.js)    │ │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘ │
└─────────┼─────────────────┼──────────────────┼─────────┘
          │                 │                  │
     ┌────▼─────────────────▼──────────────────▼────┐
     │          API Gateway (Azure APIM)            │
     └────┬─────────────────┬──────────────────┬────┘
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼─────────┐
│                 Microservices Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │Auth Service  │  │ AI Service   │  │Voice Service ││
│  │  (FastAPI)   │  │  (FastAPI)   │  │  (FastAPI)   ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐│
│  │User Service  │  │Style Service │  │Match Service ││
│  │  (FastAPI)   │  │  (FastAPI)   │  │  (FastAPI)   ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
└──────────────────────────┬──────────────────────────────┘
                           │
     ┌─────────────────────▼─────────────────────┐
     │           Data Layer                      │
     │  ┌──────────┐  ┌─────────┐  ┌─────────┐ │
     │  │  MySQL   │  │  Redis  │  │  Blob   │ │
     │  │   8.0    │  │   7.0   │  │ Storage │ │
     │  └──────────┘  └─────────┘  └─────────┘ │
     └────────────────────────────────────────────┘
```

### マイクロサービス設計

各サービスは独立してデプロイ・スケール可能な設計：

| サービス名 | 責務 | 技術 | ポート |
|-----------|------|------|--------|
| Auth Service | 認証・認可 | FastAPI + JWT | 8001 |
| User Service | ユーザー管理 | FastAPI + SQLAlchemy | 8002 |
| AI Service | AI処理・対話 | FastAPI + OpenAI | 8003 |
| Voice Service | 音声処理 | FastAPI + Whisper | 8004 |
| Style Service | スタイリング | FastAPI + ML | 8005 |
| Match Service | マッチング | FastAPI + ML | 8006 |

## 技術スタック詳細

### フロントエンド

```json
{
  "framework": "Next.js 14.2.5",
  "language": "TypeScript 5.5",
  "styling": "Tailwind CSS 3.4",
  "stateManagement": "Zustand 4.5",
  "apiClient": "Axios 1.6",
  "pwa": {
    "workbox": "7.0",
    "manifest": "PWA Manifest",
    "serviceWorker": "Custom SW"
  }
}
```

### バックエンド

```python
{
  "framework": "FastAPI 0.111.0",
  "language": "Python 3.11",
  "orm": "SQLAlchemy 2.0",
  "validation": "Pydantic 2.7",
  "async": "asyncio + aiohttp",
  "testing": "pytest 8.2"
}
```

### AI/ML スタック

```yaml
openai:
  model: "gpt-4o-mini"
  embedding: "text-embedding-3-small"
  whisper: "whisper-1"
  
custom_models:
  personality_classifier: "sklearn + tensorflow"
  compatibility_scorer: "pytorch 2.0"
  style_recommender: "lightgbm"
```

## API仕様

### 認証API

#### POST /auth/login
```json
// Request
{
  "email": "user@example.com",
  "password": "encrypted_password"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### POST /auth/refresh
```json
// Request Header
Authorization: Bearer {refresh_token}

// Response
{
  "access_token": "new_access_token",
  "expires_in": 3600
}
```

### AIカウンセラーAPI

#### POST /api/counselor/chat
```json
// Request
{
  "message": "デートで何を話せばいいか分かりません",
  "context": {
    "user_profile": "profile_id",
    "conversation_history": ["..."]
  }
}

// Response
{
  "response": "デートでの会話のコツは...",
  "suggestions": ["話題1", "話題2"],
  "confidence": 0.92
}
```

### 音声解析API

#### POST /api/voice/analyze
```json
// Request (multipart/form-data)
{
  "audio": "base64_encoded_audio",
  "format": "webm",
  "duration": 120
}

// Response
{
  "transcription": "音声の文字起こし",
  "analysis": {
    "speaking_ratio": 0.3,
    "listening_ratio": 0.7,
    "interruptions": 2,
    "empathy_score": 85
  }
}
```

## データベース設計

### ERD（主要テーブル）

```sql
-- ユーザー基本情報
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- ユーザープロフィール
CREATE TABLE user_profiles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(100),
    age INT,
    occupation VARCHAR(100),
    personality_type VARCHAR(10),
    communication_level INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- 会話練習記録
CREATE TABLE conversation_practices (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    session_date TIMESTAMP,
    duration INT,
    scenario_type VARCHAR(50),
    performance_score INT,
    feedback_json JSON,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, session_date)
);

-- AI対話履歴
CREATE TABLE ai_conversations (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    message TEXT,
    response TEXT,
    tokens_used INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_created (user_id, created_at)
);
```

### インデックス戦略

- 主キー: UUID v4使用
- 外部キー: 全てにインデックス付与
- 検索頻度の高いカラム: 複合インデックス
- パーティショニング: 日付ベース（conversation_practices）

## セキュリティ実装

### 認証・認可

```python
# JWT設定
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30

# パスワードハッシュ
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

### データ暗号化

- **転送時**: TLS 1.3
- **保存時**: AES-256-GCM
- **個人情報**: フィールドレベル暗号化

### セキュリティヘッダー

```python
# FastAPIミドルウェア
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://miraim.jp"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# セキュリティヘッダー
headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000",
}
```

## デプロイメント

### Docker構成

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### Azure Container Apps設定

```yaml
# デプロイ設定
resources:
  cpu: 0.5
  memory: 1Gi
  
scale:
  minReplicas: 1
  maxReplicas: 10
  rules:
    - name: http-rule
      http:
        metadata:
          concurrentRequests: 100
          
ingress:
  external: true
  targetPort: 3000
  transport: http2
  customDomains:
    - name: miraim.jp
      certificateId: /subscriptions/.../certificates/miraim-cert
```

### CI/CDパイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Push Docker Images
        run: |
          docker build -t ${{ secrets.ACR_URL }}/frontend:${{ github.sha }} ./frontend
          docker build -t ${{ secrets.ACR_URL }}/backend:${{ github.sha }} ./backend
          docker push ${{ secrets.ACR_URL }}/frontend:${{ github.sha }}
          docker push ${{ secrets.ACR_URL }}/backend:${{ github.sha }}
      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy@v1
```

## パフォーマンス最適化

### フロントエンド最適化

- **コード分割**: Dynamic imports
- **画像最適化**: Next.js Image component
- **キャッシュ戦略**: SWR + Redis
- **バンドルサイズ**: Tree shaking + Minification

### バックエンド最適化

- **非同期処理**: asyncio + aiohttp
- **データベース**: Connection pooling
- **キャッシュ**: Redis (TTL: 5分)
- **レート制限**: 100 req/min per user

### 負荷テスト結果

| メトリクス | 目標値 | 実測値 |
|----------|--------|--------|
| レスポンス時間 (P50) | < 200ms | 145ms |
| レスポンス時間 (P99) | < 1000ms | 820ms |
| スループット | > 1000 RPS | 1250 RPS |
| エラー率 | < 0.1% | 0.03% |

## 監視とログ

### 監視スタック

- **メトリクス**: Prometheus + Grafana
- **APM**: Azure Application Insights
- **ログ**: Azure Log Analytics
- **アラート**: PagerDuty

### ログレベル

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# 構造化ログ
logger.info({
    "event": "user_login",
    "user_id": user_id,
    "ip": request.client.host,
    "timestamp": datetime.utcnow()
})
```

### 主要メトリクス

- **ビジネスメトリクス**
  - DAU/MAU
  - 成婚率
  - 練習完了率
  
- **技術メトリクス**
  - API応答時間
  - エラー率
  - DB接続数
  - キャッシュヒット率

## 開発環境セットアップ

### 必要要件

```bash
# ツールバージョン
Node.js: 20.x
Python: 3.11
Docker: 24.x
MySQL: 8.0
Redis: 7.0
```

### セットアップ手順

```bash
# 1. リポジトリクローン
git clone https://github.com/your-org/miraim.git
cd miraim

# 2. 環境変数設定
cp .env.example .env
# .envファイルを編集

# 3. Dockerコンテナ起動
docker-compose up -d

# 4. データベース初期化
cd backend
python scripts/init_db.py

# 5. 開発サーバー起動
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

## トラブルシューティング

### よくある問題と解決法

| 問題 | 原因 | 解決法 |
|------|------|--------|
| DB接続エラー | SSL設定 | `ssl_disabled=False`を追加 |
| CORS エラー | Origin設定 | 環境変数で許可URLを設定 |
| 認証エラー | トークン期限 | Refresh tokenで更新 |
| 音声認識エラー | フォーマット | webm形式に変換 |

## 付録

### API レート制限

```python
# レート制限設定
RATE_LIMITS = {
    "default": "100/minute",
    "ai_chat": "20/minute",
    "voice_analysis": "10/minute"
}
```

### 環境変数一覧

```bash
# 認証
JWT_SECRET_KEY=xxx
JWT_ALGORITHM=HS256

# データベース
DATABASE_URL=mysql+aiomysql://user:pass@host/db
REDIS_URL=redis://localhost:6379

# AI/ML
OPENAI_API_KEY=sk-xxx
WHISPER_API_KEY=xxx

# Azure
AZURE_STORAGE_CONNECTION_STRING=xxx
AZURE_APP_INSIGHTS_KEY=xxx

# 外部API
MANDAM_API_KEY=xxx
MANDAM_API_URL=https://api.mandam.co.jp/v1
```

---

**Document Control**
- Author: MiraiM Development Team
- Review: Technical Lead
- Approval: CTO
- Next Review: 2024-12-01