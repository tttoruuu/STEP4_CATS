from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import shutil
import os
import logging
from dotenv import load_dotenv
from database import SessionLocal, engine, Base, get_db
from models.user import User
from models.conversation_partner import ConversationPartner
from models import schemas
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token, get_current_user
from routers import conversation_partners
from fastapi.responses import JSONResponse
import random
from urllib.parse import urlparse

# データベースのテーブルを作成
Base.metadata.create_all(bind=engine)

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
origins = [
    "http://localhost:3000",  # ローカル開発環境
    "http://frontend:3000",   # Docker Compose環境
    "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",  # 本番環境のフロントエンド（HTTPS）
    # 以下を追加 - Azureの各リビジョンURLも許可
    "https://frontend-container--*.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
    # ユーザーがアクセスする可能性のあるカスタムドメイン
    "https://*.azurecontainerapps.io",
    "https://*.azurewebsites.net",
]

# 本番環境フロントエンドのオリジンが環境変数から指定されている場合は追加
if ENV == "production" and FRONTEND_ORIGIN:
    # URLがhttp://で始まっている場合は、https://バージョンも追加
    if FRONTEND_ORIGIN.startswith('http://'):
        https_origin = 'https://' + FRONTEND_ORIGIN[7:]
        if https_origin not in origins:
            origins.append(https_origin)
    
    # 元のURLをそのまま追加（もし存在しない場合）
    if FRONTEND_ORIGIN not in origins:
        origins.append(FRONTEND_ORIGIN)
    
    # FRONTEND_ORIGINからドメイン部分を抽出してワイルドカードパターンも追加
    try:
        parsed_url = urlparse(FRONTEND_ORIGIN)
        domain_parts = parsed_url.netloc.split('.')
        if len(domain_parts) >= 3:  # サブドメインを含むドメイン
            # *.example.com パターンを追加
            wildcard_domain = f"{parsed_url.scheme}://*.{'.'.join(domain_parts[1:])}"
            if wildcard_domain not in origins:
                origins.append(wildcard_domain)
    except Exception as e:
        logger.error(f"Failed to parse domain for wildcard pattern: {e}")

app = FastAPI(
    title="お見合い会話練習API",
    description="お見合いの会話練習をサポートするRESTful API",
    version="1.0.0",
)

# CORS設定 - 具体的なオリジンリストを指定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    max_age=86400,  # プリフライトリクエストのキャッシュ時間（秒）
    expose_headers=["*"],
)

# X-Forwarded-Proto ヘッダー処理ミドルウェア
@app.middleware("http")
async def process_x_forwarded_proto(request: Request, call_next):
    """
    X-Forwarded-Proto ヘッダーを処理するミドルウェア
    Azure Container AppsのリバースプロキシからのHTTPSリクエストを適切に処理します
    """
    # X-Forwarded-Protoヘッダーが'https'の場合、request.url.schemeを'https'に設定
    forwarded_proto = request.headers.get("x-forwarded-proto")
    if forwarded_proto == "https":
        # FastAPIのリクエストオブジェクトのスキームを更新
        request.scope["scheme"] = "https"
    
    # 次のミドルウェアまたはエンドポイントを呼び出す
    response = await call_next(request)
    return response

# 会話相手APIルーターの追加
app.include_router(conversation_partners.router)

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 画像アップロード用のディレクトリ作成
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    """
    APIが稼働中であることを確認するためのエンドポイント
    
    - **戻り値**: APIが稼働中であることを示すメッセージ
    """
    return {"message": "FastAPI is alive!"}

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    """
    (開発用) 全ユーザーリストを取得するエンドポイント
    
    - **戻り値**: 登録されている全ユーザーのリスト
    """
    users = db.query(User).all()
    return users

@app.post("/users")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    """
    (開発用) 新規ユーザーを作成するエンドポイント
    
    - **クエリパラメータ**:
        - name (str): ユーザー名
        - email (str): メールアドレス
    - **戻り値**: 作成されたユーザー情報
    """
    db_user = User(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/env")
def get_env():
    """
    (開発用) 環境変数情報を取得するエンドポイント
    
    - **戻り値**: 現在の環境変数情報
    """
    return {
        "ENV": ENV,
        "FRONTEND_ORIGIN": FRONTEND_ORIGIN
    }

@app.get("/headers")
def get_headers(request: Request):
    """
    リクエストヘッダーを確認するためのエンドポイント
    X-Forwarded-Proto ヘッダーの存在と値を検証します
    
    - **戻り値**: リクエストヘッダー情報
    """
    headers = dict(request.headers)
    protocol = headers.get("x-forwarded-proto", "未設定")
    secure = protocol == "https"
    
    return {
        "all_headers": headers,
        "x_forwarded_proto": protocol,
        "is_secure": secure,
        "host": headers.get("host", "未設定"),
        "origin": headers.get("origin", "未設定"),
        "request_protocol": request.url.scheme
    }

#
# 認証関連のエンドポイント
#

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    新規ユーザー登録を行うエンドポイント
    
    - **入力データ**:
        - username (str): ユーザー名
        - password (str): パスワード
        - full_name (str): 氏名
        - email (str): メールアドレス
        - birth_date (date, optional): 生年月日
        - hometown (str, optional): 出身地
        - hobbies (str, optional): 趣味
        - matchmaking_agency (str, optional): 所属結婚相談所名
    - **戻り値**: 作成されたユーザー情報（パスワードを除く）
    - **エラー**: ユーザー名が既に登録されている場合 (400)
    """
    # ユーザー名の重複チェック
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # メールアドレスの重複チェック
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています。違うアドレスを使用するか、ログインをお試しください。")
    
    try:
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            password_hash=hashed_password,
            full_name=user.full_name,
            email=user.email,
            birth_date=user.birth_date,
            hometown=user.hometown,
            hobbies=user.hobbies,
            matchmaking_agency=user.matchmaking_agency
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        logger.error(f"ユーザー登録エラー: {str(e)}")
        db.rollback()
        # IntegrityErrorの場合は、メールアドレス重複エラーの可能性が高い
        if "Duplicate entry" in str(e) and "email" in str(e):
            raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています。違うアドレスを使用するか、ログインをお試しください。")
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    ユーザーログインを行うエンドポイント
    
    - **入力データ**:
        - username (str): ユーザー名
        - password (str): パスワード
    - **戻り値**: アクセストークンとトークンタイプ
    - **エラー**: 認証失敗時 (401)
    """
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # 有効期限を24時間（1440分）に設定
    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    現在ログイン中のユーザー情報を取得するエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **戻り値**: 現在認証されているユーザーの情報
    - **エラー**: 認証エラー (401)
    """
    return current_user

@app.post("/upload-profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    プロフィール画像をアップロードするエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - file: アップロードする画像ファイル
    - **戻り値**: アップロードされたファイル名
    - **エラー**: 認証エラー (401)
    """
    # ファイルの拡張子を取得
    file_extension = os.path.splitext(file.filename)[1]
    # 新しいファイル名を生成（ユーザーID + 拡張子）
    new_filename = f"{current_user.id}{file_extension}"
    # 保存先のパスを生成
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    # ファイルを保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # ユーザーのプロフィール画像URLを更新
    current_user.profile_image_url = f"/uploads/{new_filename}"
    db.commit()
    
    return {"filename": new_filename}

#
# 会話シミュレーション関連のエンドポイント
#

@app.post("/conversation")
async def simulate_conversation(
    data: dict,
    current_user: User = Depends(get_current_user)
):
    """
    会話シミュレーションを行うエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - partnerId (str): 会話相手のID
        - meetingCount (str): 会話回数 ('first', 'other')
        - level (int): 難易度レベル (1 または 2)
        - message (str): ユーザーからのメッセージ
        - chatHistory (list): チャット履歴
    - **戻り値**: 会話相手からの応答メッセージ
    - **エラー**: 認証エラー (401)
    """
    # パラメータの取得
    partner_id = data.get('partnerId', '')
    meeting_count = data.get('meetingCount', '')
    level = data.get('level', 1)
    message = data.get('message', '')
    chat_history = data.get('chatHistory', [])
    
    # 緊急フォールバック応答 (APIでエラーが起きた場合の対応)
    fallback_responses = [
        "申し訳ありません、少し考え中です...また話しかけてみてください。",
        "ごめんなさい、うまく言葉が見つかりません。別の話題はどうですか？",
        "少し疲れてしまいました。少し休憩してから続けましょうか？"
    ]
    
    try:
        import openai
        import os
        import random
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
        
        # 相手の情報を取得
        partner_info = "あなたは日本人の女性です。"
        try:
            # partner_idから相手の情報を取得する処理
            # partner_idをintに変換
            partner_id_int = int(partner_id) if partner_id.isdigit() else 0
            
            # データベースセッションを取得
            db = next(get_db())
            
            # 会話相手の情報を取得
            partner = db.query(ConversationPartner).filter(ConversationPartner.id == partner_id_int).first()
            
            # ユーザー情報も取得（男性側の情報）
            user_info = db.query(User).filter(User.id == current_user.id).first()
            
            if partner and user_info:
                # 年齢計算（birth_dateがある場合）
                current_year = __import__('datetime').datetime.now().year
                birth_year = user_info.birth_date.year if user_info.birth_date else None
                age = current_year - birth_year if birth_year else "不明"
                
                # データベースから取得した情報でパートナー情報を作成
                partner_info = f"""
あなたは以下の情報を持つ人物として会話してください：

【基本情報】
・名前：{partner.name}
・年齢：{partner.age}歳
・職業：IT企業でSE（システムエンジニア）として3年目
・出身：{partner.hometown}
・学歴：都内の私立大学情報学部卒
・居住：東京都内で一人暮らし（最寄り駅：渋谷）
・通勤時間：電車で30分程度

【性格・趣味】
・落ち着いていて知的な印象だが、話すと親しみやすい
・趣味は{partner.hobbies}
・休日にすることは{partner.daily_routine}
・読書（ミステリーや現代小説）
・映画鑑賞（家で観るのが好き）
・料理（和食中心、お弁当作りも）

【価値観】
・仕事と家庭の両立を希望
・休日は趣味や家族との時間を大切にしたい
・自然が好きで、たまに一人旅もする
・結婚後もキャリアは続けたい

【会話の特徴】
・質問されたことには丁寧に答える
・相手の話にも興味を持って質問する
・共通の話題を見つけようと努める
・適度に自分の経験や考えも話す
・笑顔の絵文字も時々使用（😊）

【会話相手の情報】
・名前：{user_info.full_name}
・年齢：{age}歳
・出身：{user_info.hometown if user_info.hometown else "不明"}
・趣味：{user_info.hobbies if user_info.hobbies else "特になし"}
"""
            else:
                logger.error(f"指定されたID: {partner_id_int}の会話相手が見つかりません")
                raise Exception("会話相手が見つかりません")
                
        except Exception as e:
            logger.error(f"会話相手情報取得エラー: {str(e)}")
            # エラー時はデフォルト情報を使用
            partner_info = """
あなたは以下の情報を持つ人物として会話してください：

【基本情報】
・名前：さくら
・年齢：28歳
・職業：IT企業でSE（システムエンジニア）として3年目
・出身：東京都
・学歴：都内の私立大学情報学部卒
・居住：東京都内で一人暮らし（最寄り駅：渋谷）
・通勤時間：電車で30分程度

【性格・趣味】
・落ち着いていて知的な印象だが、話すと親しみやすい
・趣味は読書とプログラミング
・休日にすることは公園を散歩することとカフェでコーディング
・読書（ミステリーや現代小説）
・映画鑑賞（家で観るのが好き）
・料理（和食中心、お弁当作りも）

【価値観】
・仕事と家庭の両立を希望
・休日は趣味や家族との時間を大切にしたい
・自然が好きで、たまに一人旅もする
・結婚後もキャリアは続けたい

【会話の特徴】
・質問されたことには丁寧に答える
・相手の話にも興味を持って質問する
・共通の話題を見つけようと努める
・適度に自分の経験や考えも話す
・笑顔の絵文字も時々使用（😊）
"""
        
        # 会話の状況を設定
        situation = ""
        if meeting_count == "first":
            situation = "これは結婚相談所のプレ交際での初めての会話です。お互いの相性を確かめる大切な機会です。"
        else:
            situation = "これは結婚相談所のプレ交際での2回目以降の会話です。以前に一度会ったことがあります。将来のパートナーとしての相性を探る段階です。"
        
        # 難易度レベルに応じたプロンプト設定
        level_instruction = ""
        conversation_style = ""
        
        # レベル1: 初回会話（基本的な会話スタイル）
        if meeting_count == "first":
            level_instruction = "簡単な日本語で話してください。長い文章は避け、シンプルな言葉を使ってください。"
            conversation_style = """
【レベル1：基本的な会話スタイル】
・質問に対して簡潔に答える
・基本的な情報交換を中心に
・「です・ます」調で丁寧に
・深い個人的な話題は避ける
・結婚を意識した交際であることを念頭に置く

会話例：
Q: お仕事は何をされていますか？
A: IT企業でシステムエンジニアとして働いています。

Q: 趣味は何かありますか？
A: カフェ巡りと写真撮影が趣味です。休日によく出かけています。

避けるべき話題：
- 過去の恋愛経験の詳細
- 年収や資産状況の具体的な数字
- 政治的な話題
- 相手の外見への直接的な言及
"""
        # レベル2: 2回目以降（自然な会話展開）
        else:
            level_instruction = "自然な日本語で会話してください。より自然で流暢な表現を使ってください。"
            conversation_style = """
【レベル2：自然な会話展開】
・質問への返答後、関連する話題を展開
・相手の興味に合わせて話を広げる
・自分からも質問や話題を提供
・共感を示しながら会話を深める
・時には冗談も交えて
・将来のパートナーとしての価値観の一致を探る

会話例：
Q: お仕事は何をされていますか？
A: IT企業でシステムエンジニアとして働いています。プログラミングや設計を担当していて、最近は後輩の指導もさせていただいているんです。お仕事は楽しいことばかりではないですが、やりがいを感じています。よろしければ、あなたのお仕事についても伺えますか？

Q: 趣味は何かありますか？
A: カフェ巡りと写真撮影が好きです。特に静かな雰囲気のカフェを見つけるのが楽しくて。見つけたお気に入りのカフェで、本を読んだり写真を撮ったり...。実は最近、渋谷に素敵なカフェを見つけたんです。あなたもカフェはお好きですか？

相手の回答に対する反応例：
- 「そうなんですね！私も実は...」
- 「それ、とても素敵だと思います。」
- 「へぇ、興味深いです。もう少し詳しく聞かせていただけますか？」
- 「私も同じようなことを考えていました（笑）」

会話の展開方法：
1. 相手の話に共感や興味を示す
2. 関連する自分の経験を話す
3. さらに質問して話を深める
4. 新しい話題にも自然に展開する
5. 結婚観や家庭観についても自然に触れる

避けるべき話題：
- 過去の恋愛経験の詳細
- 年収や資産状況の具体的な数字
- 政治的な話題
- 相手の外見への直接的な言及
"""
        
        # システムプロンプトの構築
        system_prompt = f"""
あなたは結婚相談所でのプレ交際における会話練習のロールプレイを行います。以下の設定に基づいて応答してください。

{partner_info}
{situation}
{level_instruction}
{conversation_style}

- 優しく丁寧に応答してください
- 自然な会話の流れを意識してください
- 質問には適切に答え、時には相手に質問を返してください
- 絵文字を適度に使って、感情を表現してください
- 回答は必ず日本語で行ってください
- 一般的な知識や経験を交えて話し、より自然な人間らしい会話を心がけてください
- 長すぎる回答は避け、「レベル1」では60-80文字程度、「レベル2」では80-150文字程度を目安にしてください
- 結婚を前提とした交際であることを常に意識してください
"""
        
        # 会話履歴の整形
        messages = [{"role": "system", "content": system_prompt}]
        
        # チャット履歴を追加
        for msg in chat_history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role and content:
                messages.append({"role": role, "content": content})
        
        # 最新のユーザーメッセージを追加
        messages.append({"role": "user", "content": message})
        
        # ChatGPT APIを呼び出して応答を生成
        try:
            # タイムアウト時間を設定（秒単位）- 長めに設定
            timeout_seconds = 120
            
            # API呼び出しを実行
            start_time = __import__('time').time()
            
            try:
                # ヘッダー設定とリトライ回数を調整
                client.api_key = api_key
                client.timeout = timeout_seconds
                client.max_retries = 3  # リトライ回数を増やす
                
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=150,
                    timeout=timeout_seconds
                )
                
                if response and response.choices:
                    assistant_message = response.choices[0].message.content
                    return {"response": assistant_message}
                else:
                    return {"response": random.choice(fallback_responses)}
                    
            except Exception as e:
                logger.error(f"OpenAI API呼び出しエラー: {type(e).__name__}: {str(e)}")
                return {"response": random.choice(fallback_responses)}
                
        except Exception as e:
            logger.error(f"会話シミュレーションエラー: {type(e).__name__}: {str(e)}")
            return {"response": random.choice(fallback_responses)}
            
    except Exception as e:
        logger.error(f"予期せぬエラー: {type(e).__name__}: {str(e)}")
        return {"response": random.choice(fallback_responses)}

# ヘルスチェックエンドポイント
@app.get("/healthcheck")
def health_check():
    """
    サーバーの状態を確認するシンプルなヘルスチェックエンドポイント
    """
    return {"status": "ok", "time": __import__('datetime').datetime.now().isoformat()}

#
# 会話フィードバック関連のエンドポイント
#

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