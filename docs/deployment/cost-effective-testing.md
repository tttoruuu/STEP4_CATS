# コスト効率的デプロイテスト戦略

## 現状分析
- **ローカルDocker動作**: ✅ 確認済み
- **本番デプロイ**: 未テスト（Azure Container Apps）
- **課題**: テストコストの最適化

## 段階的テスト戦略

### Phase 1: 事前検証（コスト: ¥0）
```bash
# ローカルで本番環境模擬テスト
docker-compose -f docker-compose.production-test.yml up
```

**検証項目**:
- 本番用環境変数での動作
- 外部API接続（OpenAI）
- データベース接続
- 静的ファイル配信

### Phase 2: 最小限本番テスト（コスト: ¥100-200）
**1回のデプロイテスト**:
- Container Apps: ¥50-100/日
- Database: ¥50-100/日
- **短時間テスト**: 2-3時間で削除

**検証項目**:
- デプロイ成功
- アプリケーション起動
- 基本API疎通
- 認証フロー

### Phase 3: 段階的機能テスト
**成功後に追加テスト**:
- AIカウンセラー機能
- 会話練習機能
- ファイルアップロード

## 事前検証環境構築

### docker-compose.production-test.yml 作成
```yaml
# 本番環境を模擬したローカルテスト
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.production
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    ports:
      - "3000:3000"
  
  backend:
    build:
      context: ./backend  
      dockerfile: Dockerfile.production
    environment:
      - ENV=production
      - DATABASE_URL=mysql+pymysql://root:password@db:3306/testdb
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=testdb
```

## テスト手順

### 1. 事前検証（必須）
```bash
# 本番用Dockerfileテスト
docker-compose -f docker-compose.production-test.yml up

# 動作確認
curl http://localhost:3000
curl http://localhost:8000/docs
curl -X POST http://localhost:8000/api/counselor/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"message": "テスト"}'
```

### 2. 本番デプロイ（1回のみ）
- 事前検証で問題なければ実行
- 2-3時間でテスト完了・削除

### 3. 問題発生時
- ログ取得・分析
- ローカルで修正・再検証
- 修正版で再デプロイ

## リスク軽減策

### デプロイ前チェックリスト
- [ ] ローカル本番モードで動作確認
- [ ] 環境変数すべて設定済み
- [ ] OpenAI API接続確認
- [ ] Docker production buildエラーなし
- [ ] ポート・ネットワーク設定確認

### 緊急時計画
- **即座停止**: Container Apps削除
- **ログ取得**: エラー解析用
- **ロールバック**: 前バージョンに復旧

## 推奨アプローチ

1. **まず事前検証実施**（コスト¥0）
2. **問題なければ本番テスト1回**（コスト¥100-200）
3. **成功すれば継続運用開始**

**期待成功率**: 事前検証により90%以上