from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import shutil
import os
import logging
from dotenv import load_dotenv
from database import SessionLocal, engine, Base, get_db
import asyncio
from contextlib import asynccontextmanager
from models.user import User
from models.conversation_partner import ConversationPartner
from models import schemas
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token, get_current_user
from routers import conversation_partners, personality, marriage_mbti, counselor, profile, auth, user_settings
from fastapi.responses import JSONResponse
import random
from urllib.parse import urlparse
import time
import sys
from middleware.error_handler import register_exception_handlers, error_handler_middleware

async def create_tables_with_retry(max_retries=5, delay=5):
    """データベースのテーブルを作成（リトライ機能付き・非同期版）"""
    for attempt in range(max_retries):
        try:
            Base.metadata.create_all(bind=engine)
            print(f"データベーステーブル作成成功 (試行 {attempt + 1}/{max_retries})")
            
            # 不足しているカラムを追加
            await add_missing_columns_if_needed()
            
            return True
        except Exception as e:
            print(f"データベース接続失敗 (試行 {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"{delay}秒待機中...")
                await asyncio.sleep(delay)
            else:
                print("データベース接続に失敗しました。コンテナを確認してください。")
                return False
    return False

async def add_missing_columns_if_needed():
    """不足しているカラムを追加（本番環境対応）"""
    import pymysql
    from config import IS_PRODUCTION, MYSQL_SSL_ENABLED
    from database import get_ssl_cert_path
    import os
    
    # データベース接続情報（本番環境の値を直接使用）
    if IS_PRODUCTION:
        host = os.getenv("AZURE_MYSQL_HOST", "eastasiafor9th.mysql.database.azure.com")
        port = int(os.getenv("AZURE_MYSQL_PORT", "3306"))
        database = os.getenv("AZURE_MYSQL_DATABASE", "tech0students_db")
        user = os.getenv("AZURE_MYSQL_USER", "tech0")
        password = os.getenv("AZURE_MYSQL_PASSWORD", "9th-tech0")
    else:
        from config import MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
        host = MYSQL_HOST
        port = MYSQL_PORT
        database = MYSQL_DATABASE
        user = MYSQL_USER
        password = MYSQL_PASSWORD
    
    # SSL設定
    connect_kwargs = {
        'host': host,
        'port': port,
        'user': user,
        'password': password,
        'database': database,
        'charset': 'utf8mb4'
    }
    
    # 本番環境でSSLが有効な場合
    if IS_PRODUCTION and MYSQL_SSL_ENABLED:
        cert_path = get_ssl_cert_path()
        if cert_path:
            connect_kwargs['ssl'] = {
                'ca': cert_path,
                'check_hostname': False,
                'verify_identity': False
            }
        else:
            # 証明書なしでもSSLを強制
            connect_kwargs['ssl'] = {
                'fake_flag_to_enable_tls': True,
                'check_hostname': False,
                'verify_identity': False
            }
        logger.info(f"add_missing_columns: SSL設定を適用")
    
    try:
        # データベースに接続
        connection = pymysql.connect(**connect_kwargs)
        
        cursor = connection.cursor()
        
        # 追加するカラムのリスト
        columns_to_add = [
            ("konkatsu_status", "VARCHAR(50)"),
            ("occupation", "VARCHAR(255)"),
            ("birth_place", "VARCHAR(255)"),
            ("location", "VARCHAR(255)"),
            ("weekend_activity", "TEXT"),
            ("show_service_video", "BOOLEAN"),
            ("first_login_at", "DATETIME")
        ]
        
        # 既存のカラムを取得
        cursor.execute("SHOW COLUMNS FROM users")
        existing_columns = [row[0] for row in cursor.fetchall()]
        
        # 不足しているカラムを追加
        for column_name, column_type in columns_to_add:
            if column_name not in existing_columns:
                try:
                    alter_query = f"ALTER TABLE users ADD COLUMN {column_name} {column_type}"
                    cursor.execute(alter_query)
                    connection.commit()
                    logger.info(f"カラム '{column_name}' を追加しました")
                except Exception as e:
                    logger.warning(f"カラム '{column_name}' の追加中にエラー: {e}")
                    connection.rollback()
        
        connection.close()
        logger.info("データベースカラムの確認と更新が完了しました")
        
    except Exception as e:
        logger.error(f"カラム追加処理でエラー: {e}")
        # エラーが発生してもアプリケーションは続行

# 非同期スタートアップイベント用のライフサイクル管理
@asynccontextmanager
async def lifespan(app: FastAPI):
    # スタートアップ時の処理
    await create_tables_with_retry()
    logger.info("アプリケーション起動完了")
    yield
    # シャットダウン時の処理
    logger.info("アプリケーションをシャットダウンしています...")

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# ログレベル設定
logging.basicConfig(
    level=logging.ERROR if ENV == "production" else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# CORS設定: 具体的なオリジンのリストを指定する
# 開発環境では柔軟に、本番環境では厳密にCORS設定
if ENV == "development":
    # 開発環境: localhostのすべてのポートを許可
    origins = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002", 
        "http://127.0.0.1:3003",
        "http://frontend:3000",   # Docker Compose環境
    ]
    print(f"[CORS] 開発環境: {len(origins)}個のオリジンを許可 - {origins}")
else:
    # 本番環境: 具体的なオリジンのみ許可
    origins = [
        "https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io",  # 現在のフロントエンド
        "https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io",   # 現在のバックエンド（self）
        "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",  # 旧本番環境のフロントエンド（HTTPS）
        "https://aca-wild-australiaeast.icymoss-273d47c5.australiaeast.azurecontainerapps.io",  # 旧本番環境フロントエンド
        "https://*.azurecontainerapps.io",
        "https://*.azurewebsites.net",
    ]
    print(f"[CORS] 本番環境: {len(origins)}個のオリジンを許可")

# 本番環境フロントエンドのオリジンが環境変数から指定されている場合は追加
if ENV == "production" and FRONTEND_ORIGIN:
    # URLがhttp://で始まっている場合は、https://バージョンも追加
    if FRONTEND_ORIGIN.startswith('http://'):
        https_origin = FRONTEND_ORIGIN.replace('http://', 'https://')
        origins.append(https_origin)
    origins.append(FRONTEND_ORIGIN)

# フロントエンドのオリジン追加設定をさらに詳しく行う
if ENV == "production":
    # 本番環境でワイルドカードが制限されている場合、各サブドメインを個別に追加
    production_origins = [
        "https://miraim-frontend--0000012.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン12（最新）
        "https://miraim-frontend--0000011.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン11
        "https://miraim-frontend--0000010.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン10
        "https://miraim-frontend--0000009.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン9
        "https://miraim-frontend--0000008.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン8
        "https://miraim-frontend--0000007.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン7
        "https://miraim-frontend--0000006.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン6
        "https://miraim-frontend--0000005.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン5
        "https://miraim-frontend--0000004.icymoss-273d47c5.australiaeast.azurecontainerapps.io",    # リビジョン4
        "https://miraim-frontend--login-fix.icymoss-273d47c5.australiaeast.azurecontainerapps.io",  # ログイン修正版
        "https://miraim-frontend--v1754319363.icymoss-273d47c5.australiaeast.azurecontainerapps.io", # 修正版1
        "https://miraim-frontend--v1754320376.icymoss-273d47c5.australiaeast.azurecontainerapps.io", # 修正版2
        "https://miraim-frontend--quickfix1754323427.icymoss-273d47c5.australiaeast.azurecontainerapps.io", # クイック修正
        "https://miraim-frontend--prod1754323663.icymoss-273d47c5.australiaeast.azurecontainerapps.io", # 本番版
        "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        "https://frontend-container--2.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        "https://frontend-container--3.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        "https://aca-wild-australiaeast.icymoss-273d47c5.australiaeast.azurecontainerapps.io",
        "https://aca-wild-australiaeast--0000004.icymoss-273d47c5.australiaeast.azurecontainerapps.io",
        "https://aca-wild-australiaeast--0000005.icymoss-273d47c5.australiaeast.azurecontainerapps.io",
    ]
    origins.extend(production_origins)

app = FastAPI(
    title="Miraim - 婚活男性向け総合サポートAPI",
    version="2.0.0",
    description="Marriage MBTI+、会話練習、AIカウンセラー機能を統合した婚活支援API",
    lifespan=lifespan
)

# 上記で設定したoriginsをそのまま使用（重複設定を削除）

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # 環境ごとに設定されたオリジンを使用
    allow_credentials=True,        # Cookie や認証ヘッダを使う場合
    allow_methods=["*"],           # POST/GET/OPTIONS 等
    allow_headers=["*"],           # Content-Type, Authorization 等
    expose_headers=["*"]           # レスポンスヘッダーをクライアントに公開
)

print(f"[CORS] 設定完了 - ENV: {ENV}")
print(f"[CORS] 使用するオリジン: {origins}")
print(f"[CORS] allow_credentials: True")
print("[CORS] 具体的なオリジン指定CORS設定が適用されました（強制リロード）")

# エラーハンドリングの登録
register_exception_handlers(app)
app.middleware("http")(error_handler_middleware)

# ルーター追加（順序重要）
# 常に実際のデータベース認証を使用
app.include_router(auth.router)
    
app.include_router(conversation_partners.router)
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])
app.include_router(marriage_mbti.router, prefix="/api/marriage-mbti", tags=["marriage-mbti"])
app.include_router(counselor.router)
app.include_router(profile.router)
app.include_router(user_settings.router)

# OpenAI接続テスト用エンドポイント（認証なし）
@app.get("/test-openai")
async def test_openai():
    """OpenAI API接続テスト（デバッグ用）"""
    try:
        from openai import OpenAI
        import os
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return {"status": "error", "message": "OPENAI_API_KEY not set", "key_length": 0}
        
        # APIキーの最初と最後の数文字のみ表示（セキュリティ）
        masked_key = f"{api_key[:8]}...{api_key[-8:]}" if len(api_key) > 16 else "short_key"
        
        client = OpenAI(api_key=api_key)
        
        # シンプルなテストリクエスト
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello, please respond with 'OpenAI connection successful'"}],
            max_tokens=50
        )
        
        return {
            "status": "success", 
            "message": "OpenAI connection successful",
            "key_masked": masked_key,
            "response": response.choices[0].message.content,
            "model": response.model
        }
        
    except Exception as e:
        return {
            "status": "error", 
            "message": str(e),
            "key_masked": masked_key if 'masked_key' in locals() else "unknown",
            "error_type": type(e).__name__
        }

# ヘルスチェックエンドポイント
@app.get("/")
async def root():
    return {
        "message": "Miraim API is running",
        "version": "2.0.0",
        "features": [
            "conversation-partners",
            "conversation-feedback", 
            "speech-to-text",
            "personality-test",
            "marriage-mbti-plus",
            "user-authentication"
        ],
        "environment": ENV
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "api_version": "2.0.0",
        "features_status": {
            "database": "connected",
            "authentication": "active",
            "conversation": "active",
            "personality": "active", 
            "marriage_mbti": "active"
        }
    }

@app.post("/admin/update-database-schema")
async def update_database_schema():
    """データベーススキーマを更新する管理者用エンドポイント"""
    import pymysql
    
    # データベース接続情報
    host = os.getenv('MYSQL_HOST', 'eastasiafor9th.mysql.database.azure.com')
    port = int(os.getenv('MYSQL_PORT', 3306))
    database = os.getenv('MYSQL_DATABASE', 'testdb')
    user = os.getenv('MYSQL_USER', 'students')
    password = os.getenv('MYSQL_PASSWORD', '9th-tech0')
    
    results = []
    
    try:
        # データベースに接続
        # Azure MySQLの場合、SSL設定を追加
        ssl_config = {'ssl_disabled': True} if 'azure' in host.lower() else {}
        
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user if '@' in user else f"{user}@{host.split('.')[0]}",  # Azure MySQL形式
            password=password,
            database=database,
            charset='utf8mb4',
            connect_timeout=30,
            **ssl_config
        )
        
        cursor = connection.cursor()
        
        # 追加するカラムのリスト
        columns_to_add = [
            ("konkatsu_status", "VARCHAR(50)"),
            ("occupation", "VARCHAR(255)"),
            ("birth_place", "VARCHAR(255)"),
            ("location", "VARCHAR(255)"),
            ("weekend_activity", "TEXT")
        ]
        
        # 既存のカラムを取得
        cursor.execute("SHOW COLUMNS FROM users")
        existing_columns = [row[0] for row in cursor.fetchall()]
        results.append(f"既存のカラム: {existing_columns}")
        
        # 不足しているカラムを追加
        added_columns = []
        for column_name, column_type in columns_to_add:
            if column_name not in existing_columns:
                try:
                    alter_query = f"ALTER TABLE users ADD COLUMN {column_name} {column_type}"
                    cursor.execute(alter_query)
                    connection.commit()
                    added_columns.append(column_name)
                    results.append(f"✅ カラム '{column_name}' を追加しました")
                except Exception as e:
                    results.append(f"⚠️ カラム '{column_name}' の追加中にエラー: {e}")
                    connection.rollback()
            else:
                results.append(f"ℹ️ カラム '{column_name}' は既に存在します")
        
        # 最終的なテーブル構造を確認
        cursor.execute("DESCRIBE users")
        table_structure = []
        for row in cursor.fetchall():
            table_structure.append({
                "field": row[0],
                "type": str(row[1]),
                "null": row[2],
                "key": row[3]
            })
        
        connection.close()
        
        return {
            "success": True,
            "message": "データベーススキーマの更新が完了しました",
            "results": results,
            "added_columns": added_columns,
            "table_structure": table_structure
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "results": results
        }

@app.get("/test-profile")
async def test_profile():
    """プロフィールテスト用エンドポイント（認証なし）"""
    return {
        "success": True,
        "message": "Profile test endpoint working!",
        "profile": {
            "user_id": 1,
            "name": "田中 太郎",
            "age": 32,
            "birth_date": "1991年8月15日",
            "konkatsu_experience": "初心者",
            "occupation": "ITエンジニア",
            "birthplace": "大阪府",
            "residence": "東京都渋谷区",
            "hobbies": ["読書", "ジョギング", "カフェ巡り", "映画鑑賞"],
            "weekend_activities": "友人と食事をしたり、新しいカフェを探索したりしています。たまに一人旅も楽しんでいます。",
            "mbti": {
                "mbti_type": "INFP-T",
                "type_name": "仲介者",
                "description": "内向的で創造性豊かな性格タイプです。"
            },
            "profile_image_url": None,
            "email": "tanaka@example.com",
            "created_at": "2025-08-02T00:00:00",
            "updated_at": "2025-08-02T00:00:00"
        }
    }

# ユーザー認証エンドポイント
@app.post("/register")
async def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """ユーザー登録エンドポイント"""
    logger.info(f"Registration attempt for email: {user_data.email}")
    
    # ユーザーが既に存在するかチェック
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="この E-mail は既に登録されています"
        )
    
    # パスワードをハッシュ化してユーザーを作成
    hashed_password = get_password_hash(user_data.password)
    
    # birth_dateがNoneの場合のデフォルト値設定
    from datetime import datetime, date
    birth_date_value = user_data.birth_date if user_data.birth_date else date(1990, 1, 1)
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        birth_date=birth_date_value,
        konkatsu_status=user_data.konkatsu_status,
        occupation=user_data.occupation,
        birth_place=user_data.birth_place,
        location=user_data.location,
        hobbies=user_data.hobbies,
        weekend_activity=user_data.weekend_activity
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # トークンを生成して返す
    access_token = create_access_token(data={"sub": user.email})
    
    logger.info(f"User successfully registered: {user.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user.email, "name": user.full_name}
    }

@app.post("/login")
async def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """ユーザーログインエンドポイント"""
    # ユーザー名またはメールアドレスでログイン可能
    user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.username)
    ).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名・メールアドレスまたはパスワードが間違っています",
        )
    
    # トークンを生成
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user.email, "name": user.full_name}
    }

@app.post("/conversation-feedback")
async def generate_conversation_feedback(
    data: dict,
    current_user: User = Depends(get_current_user)
):
    """
    会話履歴に基づいてフィードバックを生成するエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - partnerId (str): 会話相手のID
        - meetingCount (str): 会話回数 ('first', 'other')
        - chatHistory (list): チャット履歴
    - **戻り値**: フィードバック情報（スコア、良かった点、改善点）
    - **エラー**: 認証エラー (401)
    """
    # パラメータの取得
    partner_id = data.get('partnerId', '')
    meeting_count = data.get('meetingCount', '')
    chat_history = data.get('chatHistory', [])
    
    # 緊急フォールバック応答 (APIでエラーが起きた場合の対応)
    fallback_feedback = {
        "score": 65,
        "encouragement": [
            "質問に丁寧に答えていた",
            "会話を続けようとする姿勢が良かった", 
            "自己開示ができていた"
        ],
        "advice": [
            "質問のバリエーションを増やすと良い",
            "相手の話に共感を示すとより良い",
            "もう少し会話を深掘りしてみよう"
        ]
    }
    
    try:
        import openai
        import os
        import json
        from dotenv import load_dotenv
        from openai import OpenAI
        
        # .envファイルから環境変数を読み込む（コンテナ内の環境変数が優先される）
        load_dotenv()
        
        # OpenAI APIキーを設定
        api_key = os.environ.get("OPENAI_API_KEY")
        
        if not api_key:
            logger.error("OpenAI APIキーが設定されていません")
            raise HTTPException(
                status_code=500,
                detail="サーバー設定エラー: OpenAI APIキーが設定されていません。サーバー管理者に連絡してください。"
            )
            
        # OpenAIクライアントを初期化
        try:
            client = OpenAI(api_key=api_key)
        except Exception as e:
            logger.error(f"OpenAIクライアント初期化エラー: {type(e).__name__}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"OpenAIクライアント初期化エラー: {str(e)}"
            )
        
        # 会話履歴からユーザーとパートナーの会話を抽出
        conversation_text = ""
        for msg in chat_history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role and content:
                sender = "User" if role == "user" else "Partner"
                conversation_text += f"{sender}: {content}\n"
        
        # 会話状況の文脈を追加
        context = "初回のお見合い会話" if meeting_count == "first" else "2回目以降のお見合い会話"
        
        # フィードバック生成のためのプロンプト
        feedback_prompt = f"""
会話履歴を分析して、お見合い・デートの会話のフィードバックを生成してください。
以下の2つの観点から評価し、フィードバックを作成してください：

1. 良かった点（encouragement）: ユーザーの会話でうまくいっていた部分や良い印象を与えた点
2. 改善点（advice）: より自然な会話にするためのアドバイス

＊各フィードバックは3〜4個ずつ作成してください。
＊各フィードバックは具体的で実践的なものにして、30-60字程度で表現してください。
＊主語は省略し、なるべく具体的な指摘にしてください。
＊相手の発言に対する応答や質問の仕方など、より具体的な例を挙げてください。

例：
良かった点の例：
× 「丁寧な自己紹介ができた」
○ 「仕事内容を具体的に説明し、相手が理解しやすかった」

× 「相手に質問ができていた」
○ 「相手の趣味について深掘りする質問ができていた」

改善点の例：
× 「質問の意図を確認しよう」
○ 「『それはどういう意味ですか？』と質問の意図を確認してみよう」

× 「自分の経験も話してみよう」
○ 「趣味の話で『私も以前〇〇をした時に...』と体験を共有しよう」

また、全体的な評価として0〜100のスコアも付けてください。

点数に応じて以下の評価を出して：

90点以上：happy（😊）- 「すごく自然な会話だった〜！その調子！」
70～89点：confident（😎）- 「落ち着いて話せていてGood！とてもスムーズな会話だったよ。」
50～69点：thinking（🤔）- 「会話の流れはいい感じ！もう少し深掘りしてみよう！」
30～49点：shy（😅）- 「緊張してたけど頑張ってたね！次はリラックスしてみよう！」
30点未満：surprised（😮）- 「面白い発言で場が盛り上がったね！意外性がいい感じ！」

会話の状況：{context}

会話履歴：
{conversation_text}

返答は以下のJSON形式で返してください：
{{
  "score": 評価スコア（0〜100の整数）,
  "encouragement": ["良かった点1", "良かった点2", "良かった点3", "良かった点4"],
  "advice": ["改善点1", "改善点2", "改善点3", "改善点4"]
}}

良かった点と改善点は最低3個、最大4個作成してください。状況により3個か4個かは判断してください。
"""

        # ChatGPT APIを呼び出してフィードバックを生成
        try:
            # タイムアウト時間を設定（秒単位）
            timeout_seconds = 120
            
            # API呼び出しを実行
            start_time = __import__('time').time()
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": feedback_prompt}],
                temperature=0.7,
                max_tokens=500,
                timeout=timeout_seconds
            )
            
            if response and response.choices:
                feedback_text = response.choices[0].message.content
                
                # JSONをパース
                try:
                    # 余分なテキストがある場合、JSONのみを抽出
                    import re
                    json_match = re.search(r'\{.*\}', feedback_text, re.DOTALL)
                    if json_match:
                        json_str = json_match.group(0)
                        feedback_data = json.loads(json_str)
                    else:
                        feedback_data = json.loads(feedback_text)
                    
                    # 必要なフィールドが含まれているか確認
                    if "score" in feedback_data and "encouragement" in feedback_data and "advice" in feedback_data:
                        # スコアが数値であることを確認
                        if isinstance(feedback_data["score"], (int, float)):
                            return feedback_data
                        else:
                            return fallback_feedback
                    else:
                        return fallback_feedback
                except json.JSONDecodeError as e:
                    logger.error(f"JSON解析エラー: {str(e)}")
                    return fallback_feedback
            else:
                return fallback_feedback
                
        except Exception as e:
            logger.error(f"OpenAI API呼び出しエラー: {type(e).__name__}: {str(e)}")
            return fallback_feedback
            
    except Exception as e:
        logger.error(f"フィードバック生成エラー: {type(e).__name__}: {str(e)}")
        return fallback_feedback

#
# 音声認識関連のエンドポイント
#

@app.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    音声ファイルをテキストに変換するエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - audio: 音声ファイル (wav, mp3, m4a, webm形式)
    - **戻り値**: 
        - text: 変換されたテキスト
        - duration: 音声の長さ（秒）
    - **エラー**: 
        - 401: 認証エラー
        - 400: 不正なファイル形式
        - 500: 変換エラー
    """
    import tempfile
    import aiofiles
    import httpx
    
    # 対応音声形式のチェック
    allowed_extensions = ['wav', 'mp3', 'm4a', 'webm']
    file_extension = audio.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"サポートされていないファイル形式です。対応形式: {', '.join(allowed_extensions)}"
        )
    
    # ファイルサイズのチェック（25MB）
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB
    contents = await audio.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="ファイルサイズが大きすぎます。最大25MBまでです。"
        )
    
    # ファイルポインタをリセット
    await audio.seek(0)
    
    try:
        # 一時ファイルに保存
        with tempfile.NamedTemporaryFile(suffix=f".{file_extension}", delete=False) as tmp_file:
            async with aiofiles.open(tmp_file.name, 'wb') as f:
                content = await audio.read()
                await f.write(content)
            
            tmp_file_path = tmp_file.name
        
        # OpenAI Whisper APIを使用してテキストに変換
        try:
            from openai import OpenAI
            
            api_key = os.environ.get("OPENAI_API_KEY")
            if not api_key:
                logger.error("OpenAI APIキーが設定されていません")
                raise HTTPException(
                    status_code=500,
                    detail="サーバー設定エラー: 音声認識APIキーが設定されていません。"
                )
            
            client = OpenAI(api_key=api_key)
            
            # 音声ファイルを開いてWhisper APIに送信
            with open(tmp_file_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="ja"  # 日本語に固定
                )
            
            # 音声の長さを取得（簡易的に推定）
            duration = file_size / (16000 * 2)  # 16kHz, 16bit mono を仮定
            
            logger.info(f"音声認識成功: {len(transcript.text)}文字")
            
            return {
                "text": transcript.text,
                "duration": round(duration, 2)
            }
            
        except Exception as e:
            logger.error(f"Whisper API呼び出しエラー: {type(e).__name__}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"音声認識エラー: {str(e)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"音声認識処理エラー: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="音声認識処理中にエラーが発生しました。"
        )
    finally:
        # 一時ファイルのクリーンアップ
        try:
            if 'tmp_file_path' in locals():
                os.unlink(tmp_file_path)
        except Exception as e:
            logger.warning(f"一時ファイル削除エラー: {str(e)}")

@app.post("/api/text-to-speech")
async def text_to_speech(request: Request):
    """Text-to-Speech API エンドポイント"""
    try:
        from openai import OpenAI
        from fastapi.responses import Response
        import json
        
        # リクエストボディを取得
        body = await request.body()
        data = json.loads(body.decode('utf-8'))
        
        text = data.get('text', '')
        voice = data.get('voice', 'alloy')
        model = data.get('model', 'tts-1')
        speed = data.get('speed', 1.0)
        
        if not text:
            raise HTTPException(status_code=400, detail="テキストが提供されていません")
        
        # OpenAI API キーの確認
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # OpenAI クライアントの初期化
        client = OpenAI(api_key=api_key)
        
        # TTS API を呼び出し
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
            speed=speed
        )
        
        # 音声データを返す
        return Response(
            content=response.content,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=speech.mp3"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"TTS API エラー: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"音声生成中にエラーが発生しました: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
