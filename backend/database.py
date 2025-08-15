from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import sys
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
    
    print("警告: SSL証明書が見つかりません - 証明書なしでSSL接続を試みます")
    return None

# データベース接続設定
SQLALCHEMY_DATABASE_URL = DATABASE_URL

# 接続引数の設定
connect_args = {}

# SQLiteかMySQLかを判定
if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    # SQLiteの場合は追加設定不要
    connect_args = {"check_same_thread": False}
    print("SQLite接続モード")
else:
    # MySQLの場合（PyMySQL使用）
    # 基本設定
    connect_args = {"charset": "utf8mb4"}
    
    # 本番環境でのSSL設定
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        print("本番環境: Azure MySQL SSL接続を設定中...")
        cert_path = get_ssl_cert_path()
        
        # PyMySQL用のSSL設定（Azure MySQL対応）
        # 証明書の有無に関わらずSSLを有効化
        if cert_path:
            # 証明書がある場合は明示的に指定
            ssl_config = {
                "ca": cert_path,
                "check_hostname": False,
                "verify_identity": False,
                "verify_mode": 0  # ssl.CERT_NONE相当
            }
            print(f"SSL設定: 証明書を使用 ({cert_path})")
        else:
            # 証明書がない場合でもSSLを強制的に有効化
            # Azure MySQLはSSLが必須なので、最小限のSSL設定で接続
            ssl_config = {
                "fake_flag_to_enable_tls": True,
                "check_hostname": False,
                "verify_identity": False
            }
            print("SSL設定: 証明書なしでSSL接続（Azure MySQL要求対応）")
        
        connect_args["ssl"] = ssl_config
        
        # デバッグ用: 接続設定を表示
        print(f"接続設定: ssl={ssl_config}")
    else:
        # 開発環境ではSSLを無効化
        connect_args["ssl_disabled"] = True
        print("開発環境: SSL無効")

# エンジン作成とセッションの設定
try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,  # 接続プールの事前チェック
        pool_recycle=3600,   # 1時間ごとに接続をリサイクル
        echo=False           # SQLログは無効化（本番環境）
    )
    
    # 接続テスト（本番環境のみ）
    if IS_PRODUCTION:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("データベース接続成功")
            
            # SSL状態の確認
            ssl_status = conn.execute(text("SHOW STATUS LIKE 'Ssl_cipher'")).fetchone()
            if ssl_status and ssl_status[1]:
                print(f"SSL暗号化: {ssl_status[1]}")
            else:
                print("警告: SSL暗号化が有効になっていません")
                
except Exception as e:
    print(f"データベース接続エラー: {e}")
    if IS_PRODUCTION:
        print("Azure MySQL接続に失敗しました。SSL設定を確認してください。")
    raise

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