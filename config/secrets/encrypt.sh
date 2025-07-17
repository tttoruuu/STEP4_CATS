#!/bin/bash
# 本番環境変数を暗号化するスクリプト

set -e

# 本番環境変数ファイルの存在確認
if [ ! -f "config/.env.production" ]; then
    echo "Error: 本番環境変数ファイルが見つかりません: config/.env.production"
    exit 1
fi

# GPGの存在確認
if ! command -v gpg &> /dev/null; then
    echo "Error: GPGが見つかりません。インストールしてください"
    exit 1
fi

# 暗号化の実行
echo "本番環境変数ファイルを暗号化しています..."
gpg --symmetric --cipher-algo AES256 --armor --output config/secrets/.env.prod.encrypted config/.env.production

if [ $? -eq 0 ]; then
    echo "✅ 暗号化が完了しました: config/secrets/.env.prod.encrypted"
    echo "⚠️  元のファイルは削除することをお勧めします"
    echo "    rm config/.env.production"
else
    echo "❌ 暗号化に失敗しました"
    exit 1
fi

# 暗号化ファイルの権限設定
chmod 644 config/secrets/.env.prod.encrypted
echo "✅ 暗号化ファイルの権限を設定しました (644)"