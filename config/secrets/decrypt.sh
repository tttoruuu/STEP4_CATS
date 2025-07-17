#!/bin/bash
# 暗号化された本番環境変数を復号化するスクリプト

set -e

# 暗号化ファイルの存在確認
if [ ! -f "config/secrets/.env.prod.encrypted" ]; then
    echo "Error: 暗号化された環境変数ファイルが見つかりません"
    exit 1
fi

# GPGの存在確認
if ! command -v gpg &> /dev/null; then
    echo "Error: GPGが見つかりません。インストールしてください"
    exit 1
fi

# 復号化の実行
echo "本番環境変数ファイルを復号化しています..."
gpg --decrypt config/secrets/.env.prod.encrypted > config/.env.production

if [ $? -eq 0 ]; then
    echo "✅ 復号化が完了しました: config/.env.production"
    echo "⚠️  このファイルは秘密情報を含むため、適切に管理してください"
else
    echo "❌ 復号化に失敗しました"
    exit 1
fi

# ファイル権限の設定
chmod 600 config/.env.production
echo "✅ ファイル権限を設定しました (600)"