"""
データベース接続管理モジュール（SSL対応版）
Azure MySQL用のSSL接続を確実に管理
"""
from sqlalchemy import create_engine, text, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
import logging
from pathlib import Path
from config import DATABASE_URL, MYSQL_SSL_ENABLED, IS_PRODUCTION

# ロガー設定（デバッグ用に詳細ログ追加）
logger = logging.getLogger("dbdebug")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

# 環境変数の確認
logger.info(f"[ENV CHECK] ENV={os.getenv('ENV')} ENVIRONMENT={os.getenv('ENVIRONMENT')}")
logger.info(f"[CONFIG] IS_PRODUCTION={IS_PRODUCTION} MYSQL_SSL_ENABLED={MYSQL_SSL_ENABLED}")

# SSL証明書のパスを取得（単一の真実の源）
def get_ssl_cert_path():
    """SSL証明書のパスを返す"""
    cert_candidates = [
        os.getenv("MYSQL_SSL_CA"),  # 環境変数から
        "/app/BaltimoreCyberTrustRoot.crt.pem",  # Dockerコンテナ内
        "/etc/ssl/certs/ca-certificates.crt",    # システム証明書
        "./BaltimoreCyberTrustRoot.crt.pem"       # ローカル開発
    ]
    
    for path in cert_candidates:
        if path and Path(path).exists():
            logger.info(f"SSL証明書を発見: {path}")
            return path
    
    logger.warning("SSL証明書が見つかりません - 証明書なしでSSL接続を試みます")
    return None

# ====== SSL設定構築（常にconnect_argsに集約）======
ssl_args = {}
connect_args = {}

if DATABASE_URL and not DATABASE_URL.startswith("sqlite"):
    # MySQLの場合
    connect_args = {"charset": "utf8mb4"}
    
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        # Azure MySQL用のSSL設定 - 証明書なしでSSLを強制
        # PyMySQLの仕様：fake_flag_to_enable_tlsでTLSを強制有効化
        ssl_config = {
            "fake_flag_to_enable_tls": True,
            "check_hostname": False,
            "verify_identity": False
        }
        logger.info("SSL設定: 証明書なしでSSL接続を強制（Azure MySQL対応）")
        
        connect_args["ssl"] = ssl_config
        logger.info(f"最終SSL設定: {ssl_config}")
elif DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    # SQLiteの場合
    connect_args = {"check_same_thread": False}
    logger.info("SQLite接続モード")

# ====== Engineの作成（単一のEngine）======
ENGINE_CONFIG = {
    "pool_pre_ping": True,           # 接続前にpingで生存確認
    "pool_recycle": 1800,            # 30分ごとに接続をリサイクル
    "pool_reset_on_return": "rollback",  # 返却時に状態をクリア
    "connect_args": connect_args,    # SSL設定を含む接続引数
    "echo": False                    # SQLログは無効化
}

# 本番環境での追加設定
if IS_PRODUCTION:
    # プールを無効化して毎回新規接続（SSL問題の解決）
    ENGINE_CONFIG["poolclass"] = NullPool
    logger.info("NullPool使用: 毎回新規接続でSSLを確実に適用")

# エンジン作成（アプリケーション全体で唯一のEngine）
try:
    engine = create_engine(DATABASE_URL, **ENGINE_CONFIG)
    # デバッグ情報を詳細に出力
    actual_connect_args = ENGINE_CONFIG.get("connect_args", {})
    logger.info(f"[ENGINE CREATED] url={engine.url} dbapi={engine.dialect.dbapi.__name__} "
                f"pool={engine.pool.__class__.__name__}")
    logger.info(f"[CONNECT_ARGS] {actual_connect_args}")
    logger.info(f"[SSL CONFIG] {actual_connect_args.get('ssl', 'No SSL config')}")
    logger.info(f"[ENGINE ID] {id(engine)}")
except Exception as e:
    logger.error(f"データベースエンジン作成エラー: {e}")
    raise

# ====== イベントリスナー：SSL検証 ======
@event.listens_for(engine, "connect")
def verify_ssl_on_connect(dbapi_conn, connection_record):
    """接続時にSSL状態を検証"""
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        with dbapi_conn.cursor() as cur:
            try:
                cur.execute("SHOW STATUS LIKE 'Ssl_version'")
                ssl_version = cur.fetchone()
                cur.execute("SHOW STATUS LIKE 'Ssl_cipher'")
                ssl_cipher = cur.fetchone()
                
                version = ssl_version[1] if ssl_version else "None"
                cipher = ssl_cipher[1] if ssl_cipher else "None"
                
                logger.info(f"接続時SSL状態 - Version: {version}, Cipher: {cipher}")
                
                if not cipher or cipher == "None":
                    logger.error("警告: SSL暗号化が有効になっていません！")
            except Exception as e:
                logger.error(f"SSL状態確認エラー: {e}")

@event.listens_for(engine, "checkout")
def verify_ssl_on_checkout(dbapi_conn, connection_record, connection_proxy):
    """プールから接続を取得時にSSL状態を検証（最重要）"""
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        cur = dbapi_conn.cursor()
        try:
            cur.execute("SHOW SESSION STATUS LIKE 'Ssl_cipher'")
            row = cur.fetchone()
            ssl_cipher = row[1] if row else ""
            
            if not ssl_cipher:
                # SSL接続でない場合は例外を投げて再接続を強制
                logger.error("エラー: プールから取得した接続がSSLではありません！再接続を強制します。")
                raise RuntimeError("SSL is NOT active on checked-out connection - forcing reconnection")
            else:
                logger.debug(f"プール取得時SSL暗号: {ssl_cipher}")
        except RuntimeError:
            # 再接続を強制
            raise
        except Exception as e:
            logger.error(f"SSL検証エラー: {e}")
        finally:
            cur.close()

# ====== SessionMaker（必ずbind=engine）======
SessionLocal = sessionmaker(
    bind=engine,            # 必ずengineをバインド
    autoflush=False,
    autocommit=False,
    expire_on_commit=False  # コミット後もオブジェクトを使用可能に
)

# セッション開始時のSSL検証（開発/デバッグ用）
if IS_PRODUCTION and MYSQL_SSL_ENABLED:
    @event.listens_for(SessionLocal, "after_begin")
    def assert_ssl_on_session_begin(session, transaction, connection):
        """セッション開始時にSSLを確認"""
        try:
            result = session.execute(text("SHOW SESSION STATUS LIKE 'Ssl_cipher'")).fetchone()
            if not result or not result[1]:
                logger.error("エラー: セッション開始時にSSLが無効です！")
                raise RuntimeError("SSL missing at session begin")
            else:
                logger.debug(f"セッション開始時SSL暗号: {result[1]}")
        except RuntimeError:
            raise
        except Exception as e:
            logger.error(f"セッションSSL検証エラー: {e}")

# モデル定義用のベースクラス
Base = declarative_base()

# ====== 依存関数（FastAPI用）======
def get_db():
    """データベースセッションを取得する依存関数"""
    db = SessionLocal()
    try:
        # SSL状態を毎回確認して詳細ログ出力
        result = db.execute(text("SHOW SESSION STATUS LIKE 'Ssl_cipher'"))
        row = result.fetchone()
        ssl_cipher = row[1] if row else None
        
        # エンジンIDとSSL状態をログ出力
        logger.info(f"[SESSION] engine_id={id(db.get_bind())} ssl_cipher={ssl_cipher} "
                   f"is_ssl={'YES' if ssl_cipher else 'NO'}")
        
        # 本番環境でSSLが無効な場合はエラー
        if IS_PRODUCTION and MYSQL_SSL_ENABLED and not ssl_cipher:
            logger.error("[ERROR] SSL connection required but not established!")
            raise RuntimeError("SSL connection required but not established")
            
        yield db
    except Exception as e:
        logger.error(f"データベースセッションエラー: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# ====== 初期接続テスト ======
def test_connection():
    """データベース接続をテスト"""
    try:
        with engine.connect() as conn:
            # 基本的な接続テスト
            result = conn.execute(text("SELECT 1")).scalar()
            logger.info(f"接続テスト成功: SELECT 1 = {result}")
            
            # SSL状態の確認
            if IS_PRODUCTION and MYSQL_SSL_ENABLED:
                ssl_status = conn.execute(text("SHOW STATUS LIKE 'Ssl_cipher'")).fetchone()
                if ssl_status and ssl_status[1]:
                    logger.info(f"SSL暗号化確認: {ssl_status[1]}")
                else:
                    logger.error("警告: SSL暗号化が有効になっていません！")
                    
        return True
    except Exception as e:
        logger.error(f"データベース接続テスト失敗: {e}")
        return False

# アプリケーション起動時に接続テスト
if IS_PRODUCTION:
    test_connection()