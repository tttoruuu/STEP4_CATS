from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import sys
import ssl
from config import DATABASE_URL, MYSQL_SSL_ENABLED, IS_PRODUCTION

# SSL証明書のパスを取得
def get_ssl_cert_path():
    """SSL証明書のパスを返す"""
    # Dockerコンテナ内での証明書パス
    cert_paths = [
        "/app/BaltimoreCyberTrustRoot.crt.pem",  # アプリディレクトリ
        "/etc/ssl/certs/ca-certificates.crt",    # システム証明書
        "./BaltimoreCyberTrustRoot.crt.pem"       # ローカル開発
    ]
    
    for path in cert_paths:
        if os.path.exists(path):
            print(f"SSL証明書を発見: {path}")
            return path
    
    print("警告: SSL証明書が見つかりません")
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
    # MySQLの場合（PyMySQL使用）
    connect_args = {"charset": "utf8mb4"}
    
    # 本番環境でのSSL設定
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        cert_path = get_ssl_cert_path()
        # PyMySQL用のSSL設定（Azure MySQL対応）
        if cert_path:
            # 証明書がある場合は使用
            ssl_context = {
                "ca": cert_path,
                "check_hostname": False,
                "verify_identity": False
            }
        else:
            # 証明書がない場合でもSSLを有効化（Azure MySQLの要求に対応）
            ssl_context = {
                "fake_flag_to_enable_tls": True,
                "check_hostname": False,
                "verify_identity": False
            }
        
        connect_args["ssl"] = ssl_context
        print(f"SSL設定: 有効 (PyMySQL, 証明書: {cert_path if cert_path else '最小SSL設定'})")
    else:
        # 開発環境ではSSLを無効化
        connect_args["ssl_disabled"] = True
        print("SSL設定: 無効")

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
