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
elif "mysqlconnector" in DATABASE_URL:
    # mysql-connector-pythonの場合
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        cert_path = get_ssl_cert_path()
        # mysql-connector-python用のSSL設定
        # 最小限のSSL設定で証明書検証はスキップ
        connect_args = {
            "use_ssl": True,
            "ssl_verify_cert": False,
            "ssl_verify_identity": False,
            "use_pure": True,  # Pure Pythonバージョンを使用
            "raise_on_warnings": False
        }
        
        # 証明書がある場合は追加
        if cert_path:
            connect_args["ssl_ca"] = cert_path
            print(f"SSL設定: 有効 (mysql-connector-python, 証明書: {cert_path})")
        else:
            print("SSL設定: 有効 (mysql-connector-python, 証明書検証なし)")
    else:
        # 開発環境ではSSLを無効化
        connect_args = {"ssl_disabled": True}
        print("SSL設定: 無効")
else:
    # PyMySQLの場合（フォールバック）
    connect_args = {"charset": "utf8mb4"}
    
    # 本番環境でのSSL設定
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        cert_path = get_ssl_cert_path()
        # PyMySQL用のSSL設定
        ssl_context = {
            "check_hostname": False,
            "verify_mode": ssl.CERT_NONE  # 証明書検証を無効化
        }
        if cert_path:
            ssl_context["ca"] = cert_path
        
        connect_args["ssl"] = ssl_context
        print(f"SSL設定: 有効 (PyMySQL, 証明書: {cert_path if cert_path else '検証なし'})")
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
