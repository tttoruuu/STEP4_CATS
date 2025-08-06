"""
非同期データベース接続設定
FastAPIの非同期処理パフォーマンスを最大化
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os
import sys
import tempfile
from dotenv import load_dotenv
from pathlib import Path
from typing import AsyncGenerator

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

# データベース接続設定（非同期用URL）
# pymysqlではなくaiomysqlを使用
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3307/testdb?charset=utf8mb4")
# 非同期用URLに変換
ASYNC_DATABASE_URL = DATABASE_URL.replace("mysql+pymysql", "mysql+aiomysql")

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

# 非同期エンジンの作成
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    connect_args=connect_args,
    echo=False,  # SQLログを表示しない（本番環境）
    pool_size=20,  # 接続プールサイズ
    max_overflow=10,  # 最大オーバーフロー
    pool_pre_ping=True,  # 接続前にpingで確認
)

# 非同期セッションファクトリー
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# 同期エンジン（マイグレーション等で必要な場合）
sync_engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

# 同期セッションファクトリー（後方互換性のため）
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine
)

# モデル定義用のベースクラス
Base = declarative_base()

# 非同期データベースセッションの依存関係
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """非同期データベースセッションを提供"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# 同期データベースセッションの依存関係（後方互換性）
def get_db():
    """同期データベースセッションを提供（後方互換性）"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()