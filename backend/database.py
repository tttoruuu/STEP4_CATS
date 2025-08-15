from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import sys
import tempfile
from config import DATABASE_URL, MYSQL_SSL_ENABLED, IS_PRODUCTION

# SSL証明書の処理
def create_ssl_cert_file():
    """環境変数からSSL証明書を取得し、一時ファイルとして作成"""
    ssl_cert_content = os.getenv("MYSQL_SSL_CERT")
    if ssl_cert_content:
        # 一時ファイルを作成してSSL証明書を保存
        cert_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.pem')
        cert_file.write(ssl_cert_content)
        cert_file.close()
        return cert_file.name
    return None

# データベース接続設定
SQLALCHEMY_DATABASE_URL = DATABASE_URL

# 接続引数の設定
connect_args = {}

# SQLiteかMySQLかを判定
if DATABASE_URL.startswith("sqlite"):
    # SQLiteの場合は追加設定不要
    connect_args = {"check_same_thread": False}
else:
    # MySQLの場合
    connect_args = {"charset": "utf8mb4"}
    
    # 本番環境でのSSL設定
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        ssl_cert_path = create_ssl_cert_file()
        if ssl_cert_path:
            connect_args.update({
                "ssl": {
                    "ca": ssl_cert_path,
                    "check_hostname": False,
                    "verify_identity": False
                }
            })
        else:
            # Azure MySQLの場合、証明書がなくてもSSLを有効にする（最小限のSSL設定）
            connect_args.update({
                "ssl": {
                    "check_hostname": False,
                    "verify_identity": False,
                    "ssl_mode": "REQUIRED"
                }
            })
    else:
        # 開発環境ではSSLを無効化
        connect_args["ssl_disabled"] = True

# エンジン作成とセッションの設定
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル定義用のベースクラス
Base = declarative_base()

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
