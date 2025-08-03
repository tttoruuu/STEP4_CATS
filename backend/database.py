from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import sys
import tempfile
from dotenv import load_dotenv
from pathlib import Path

# .envファイルの絶対パスを取得
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

# .envファイルを読み込み
load_dotenv(dotenv_path=env_path)

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
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3307/testdb?charset=utf8mb4")

# SSL設定の準備
ssl_cert_path = create_ssl_cert_file()
connect_args = {"charset": "utf8mb4"}

# SSL証明書が利用可能な場合はSSL接続を設定
if ssl_cert_path:
    connect_args.update({
        "ssl_ca": ssl_cert_path,
        "ssl_disabled": False
    })
else:
    # SSL証明書がない場合はSSLを無効化
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
