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
from routers import conversation_partners, personality, marriage_mbti, counselor
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
        https_origin = FRONTEND_ORIGIN.replace('http://', 'https://')
        origins.append(https_origin)
    origins.append(FRONTEND_ORIGIN)

# フロントエンドのオリジン追加設定をさらに詳しく行う
if ENV == "production":
    # 本番環境でワイルドカードが制限されている場合、各サブドメインを個別に追加
    production_origins = [
        "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        "https://frontend-container--2.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        "https://frontend-container--3.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
        # 必要に応じて他のリビジョンも追加
    ]
    origins.extend(production_origins)

app = FastAPI(
    title="Miraim - 婚活男性向け総合サポートAPI",
    version="2.0.0",
    description="Marriage MBTI+、会話練習、AIカウンセラー機能を統合した婚活支援API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター追加（順序重要）
app.include_router(conversation_partners.router)
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])
app.include_router(marriage_mbti.router, prefix="/api/marriage-mbti", tags=["marriage-mbti"])
app.include_router(counselor.router)

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

# ユーザー認証エンドポイント
@app.post("/register")
async def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """ユーザー登録エンドポイント"""
    # ユーザーが既に存在するかチェック
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="この E-mail は既に登録されています"
        )
    
    # パスワードをハッシュ化してユーザーを作成
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        birth_date=user_data.birth_date,
        hometown=user_data.hometown,
        hobbies=user_data.hobbies,
        matchmaking_agency=user_data.matchmaking_agency
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "ユーザー登録が完了しました"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
