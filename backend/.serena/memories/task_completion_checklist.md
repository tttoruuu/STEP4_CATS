# タスク完了時チェックリスト

## コード品質チェック

### フロントエンド
```bash
cd frontend
npm run lint                  # ESLint実行
npm run type-check            # TypeScript型チェック
npm run validate-env          # 環境変数検証
npm run build                 # ビルド確認
```

### バックエンド
```bash
cd backend
python -m flake8 .           # コードスタイルチェック
python -m black --check .    # フォーマットチェック
pytest                       # テスト実行
```

## テスト実行
```bash
make test                    # 全テスト実行
./scripts/production-test.sh # 本番環境疎通テスト（デプロイ後）
```

## セキュリティチェック
- [ ] 個人情報の適切な取り扱い確認
- [ ] API認証・認可の動作確認
- [ ] 環境変数・シークレット管理確認
- [ ] CORS設定の確認

## デプロイ前チェック
- [ ] 環境変数設定の確認
- [ ] Docker設定の確認
- [ ] データベースマイグレーション確認
- [ ] 依存関係の更新確認

## デプロイ後チェック
```bash
./scripts/deploy-check.sh     # デプロイ状態確認
```

### 手動確認項目
- [ ] フロントエンド本番URL疎通確認
- [ ] バックエンドAPI本番URL疎通確認
- [ ] 主要機能の動作確認
- [ ] ログ・エラー確認

## Git操作
```bash
git add -A                   # 変更ファイル追加
git commit -m "変更内容"      # コミット
git push origin [ブランチ名]  # プッシュ
```

## ドキュメント更新（必要に応じて）
- [ ] CLAUDE.md の更新（プロジェクトルール変更時）
- [ ] API仕様書の更新（APIエンドポイント変更時）
- [ ] README.md の更新（セットアップ手順変更時）

## 完了報告
- [ ] 実装内容の要約
- [ ] テスト結果の報告
- [ ] 既知の問題・制限事項の報告
- [ ] 次のタスクへの引き継ぎ事項