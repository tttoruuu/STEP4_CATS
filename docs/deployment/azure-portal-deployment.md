# Azure Portal Web Shell デプロイメント手順

**認証情報を外部に出さずにデプロイする方法**

## 本部担当者様へのお願い

### 🛡️ セキュリティを保持したデプロイ方法

**問題**: 認証情報の共有はセキュリティリスクが高い
**解決**: Azure Portal Web Shell内でスクリプト実行（認証自動）

### 📋 実行手順

1. **Azure Portalにログイン**
   - https://portal.azure.com にアクセス
   - 右上の `>_` (Cloud Shell) アイコンをクリック

2. **スクリプトダウンロード & 実行**
   ```bash
   # スクリプトをダウンロード
   curl -O https://raw.githubusercontent.com/tttoruuu/STEP4_CATS/main/scripts/deploy-azure-webshell.sh
   
   # 実行権限付与
   chmod +x deploy-azure-webshell.sh
   
   # デプロイ実行
   ./deploy-azure-webshell.sh
   ```

3. **結果確認**
   - スクリプト完了後、表示されるURLにアクセス
   - アプリケーションが正常動作することを確認

### 🔒 セキュリティメリット

- ✅ **認証情報の外部共有不要**
- ✅ **Azure Portal内で完結**
- ✅ **最小権限の原則に準拠**
- ✅ **ログ・監査証跡が残る**

### ⚡ 自動化オプション（推奨）

より効率的な運用のため、以下の設定も可能です：

**GitHub Actions用Service Principal作成**
```bash
az ad sp create-for-rbac \
  --name "github-actions-miraim" \
  --role "Contributor" \
  --scopes "/subscriptions/9b680e6d-e5a6-4381-aad5-a30afcbc8459/resourceGroups/rg-001-gen9/providers/Microsoft.App/containerapps/aca-wild-australiaeast" \
  --sdk-auth
```

結果のJSONをGitHub Secretsに設定することで、完全自動デプロイが可能になります。

### 📞 サポート

デプロイ中に問題が発生した場合は、エラーメッセージと共にご連絡ください。