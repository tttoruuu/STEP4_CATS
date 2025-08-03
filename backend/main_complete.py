from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routers import personality, marriage_mbti
from pydantic import BaseModel
import logging
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")

# ログレベル設定
logging.basicConfig(
    level=logging.ERROR if ENV == "production" else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# CORS設定
origins = [
    "http://localhost:3000",  # ローカル開発環境
    "http://frontend:3000",   # Docker Compose環境
    "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",  # 本番環境
]

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

# 基本的なルーター追加
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])
app.include_router(marriage_mbti.router, prefix="/api/marriage-mbti", tags=["marriage-mbti"])

# 認証用のPydanticモデル（フロントエンドに合わせてusernameを使用）
class UserLogin(BaseModel):
    username: str  # フロントエンドは username フィールドを送信
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    age: int
    gender: str

# JWT設定
SECRET_KEY = "demo-secret-key-for-development"
ALGORITHM = "HS256"

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
            "marriage-mbti-plus"
        ],
        "environment": ENV
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "api_version": "2.0.0",
        "features_status": {
            "conversation": "active",
            "personality": "active", 
            "marriage_mbti": "active"
        }
    }

# 認証機能（デモ用）
def create_access_token(data: dict):
    """JWTアクセストークンを作成"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/register")
async def register(user_data: UserCreate):
    """ユーザー登録エンドポイント（デモ用）"""
    # デモ用：すべての登録を受け入れる
    return {"message": "ユーザー登録が完了しました"}

@app.post("/login")
async def login(user_data: UserLogin):
    """ユーザーログインエンドポイント（デモ用）"""
    # デモ用：特定のユーザーまたは任意のusername/パスワードを受け入れる
    demo_users = {
        "test@example.com": "password",
        "demo@test.com": "demo123", 
        "user@miraim.com": "miraim2024",
        "testuser": "password",  # シンプルなユーザー名も追加
        "demo": "demo123"
    }
    
    # デモユーザーまたは任意のユーザーを許可
    if user_data.username in demo_users and demo_users[user_data.username] == user_data.password:
        # 正規のデモユーザー
        access_token = create_access_token(data={"sub": user_data.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {"email": user_data.username, "name": "デモユーザー"}
        }
    elif len(user_data.password) >= 4:  # 4文字以上のパスワードなら許可
        # 開発用：任意のユーザーを許可
        access_token = create_access_token(data={"sub": user_data.username})
        return {
            "access_token": access_token,
            "token_type": "bearer", 
            "user": {"email": user_data.username, "name": user_data.username.split('@')[0] if '@' in user_data.username else user_data.username}
        }
    else:
        raise HTTPException(
            status_code=401,
            detail="ユーザー名またはパスワードが間違っています"
        )

# 会話相手管理機能（認証なし・シンプル版）
@app.get("/conversation-partners")
async def get_conversation_partners():
    """会話相手一覧を取得（デモ用データ）"""
    demo_partners = [
        {
            "id": "1",
            "name": "田中さくら",
            "age": 25,
            "occupation": "看護師",
            "description": "優しくて思いやりのある方です",
            "image_url": "/images/demo.png",
            "personality": "優しい",
            "meetingCount": 0
        },
        {
            "id": "2", 
            "name": "山田みゆき",
            "age": 28,
            "occupation": "教師",
            "description": "明るく話しやすい方です",
            "image_url": "/images/demo.png",
            "personality": "明るい",
            "meetingCount": 1
        }
    ]
    return {"partners": demo_partners}

@app.get("/conversation-partners/{partner_id}")
async def get_conversation_partner(partner_id: str):
    """特定の会話相手の詳細を取得"""
    if partner_id == "1":
        return {
            "id": "1",
            "name": "田中さくら", 
            "age": 25,
            "occupation": "看護師",
            "description": "優しくて思いやりのある方です",
            "image_url": "/images/demo.png",
            "personality": "優しい",
            "meetingCount": 0,
            "details": {
                "hobby": "読書、映画鑑賞",
                "favorite_food": "和食",
                "dream": "家族を大切にする生活"
            }
        }
    elif partner_id == "2":
        return {
            "id": "2",
            "name": "山田みゆき",
            "age": 28, 
            "occupation": "教師",
            "description": "明るく話しやすい方です",
            "image_url": "/images/demo.png",
            "personality": "明るい",
            "meetingCount": 1,
            "details": {
                "hobby": "旅行、料理",
                "favorite_food": "イタリアン",
                "dream": "世界中を旅すること"
            }
        }
    else:
        raise HTTPException(status_code=404, detail="Partner not found")

# 会話フィードバック機能
@app.post("/conversation-feedback")
async def generate_conversation_feedback(data: dict):
    """会話履歴に基づいてフィードバックを生成"""
    # パラメータの取得
    partner_id = data.get('partnerId', '')
    meeting_count = data.get('meetingCount', '')
    chat_history = data.get('chatHistory', [])
    
    # デモ用フィードバック
    demo_feedback = {
        "score": 75,
        "encouragement": [
            "質問に丁寧に答えていました",
            "相手の話を聞く姿勢が良かったです", 
            "自然な会話の流れを作れていました"
        ],
        "advice": [
            "もう少し相手の趣味について深掘りしてみましょう",
            "共通点を見つけて話を広げてみてください",
            "自分の経験も交えて話すとより親近感が湧きます"
        ]
    }
    
    try:
        import openai
        import os
        import json
        from openai import OpenAI
        
        # OpenAI APIキーを設定
        api_key = os.environ.get("OPENAI_API_KEY")
        
        if not api_key:
            logger.info("OpenAI APIキーが設定されていません - デモ用フィードバックを返します")
            return demo_feedback
            
        # OpenAIクライアントを初期化
        client = OpenAI(api_key=api_key)
        
        # 会話履歴からユーザーとパートナーの会話を抽出
        conversation_text = ""
        for msg in chat_history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role and content:
                sender = "User" if role == "user" else "Partner"
                conversation_text += f"{sender}: {content}\n"
        
        if not conversation_text.strip():
            return demo_feedback
        
        # 会話状況の文脈を追加
        context = "初回のお見合い会話" if meeting_count == "first" else "2回目以降のお見合い会話"
        
        # フィードバック生成のためのプロンプト
        feedback_prompt = f"""
会話履歴を分析して、お見合い・デートの会話のフィードバックを生成してください。

会話の状況：{context}
会話履歴：
{conversation_text}

返答は以下のJSON形式で返してください：
{{
  "score": 評価スコア（0〜100の整数）,
  "encouragement": ["良かった点1", "良かった点2", "良かった点3"],
  "advice": ["改善点1", "改善点2", "改善点3"]
}}
"""

        # ChatGPT APIを呼び出してフィードバックを生成
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": feedback_prompt}],
            temperature=0.7,
            max_tokens=500,
            timeout=30
        )
        
        if response and response.choices:
            feedback_text = response.choices[0].message.content
            
            # JSONをパース
            import re
            json_match = re.search(r'\{.*\}', feedback_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                feedback_data = json.loads(json_str)
                
                # 必要なフィールドが含まれているか確認
                if "score" in feedback_data and "encouragement" in feedback_data and "advice" in feedback_data:
                    return feedback_data
                    
        return demo_feedback
                
    except Exception as e:
        logger.error(f"フィードバック生成エラー: {type(e).__name__}: {str(e)}")
        return demo_feedback

# 音声認識機能
@app.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    """音声ファイルをテキストに変換"""
    import tempfile
    import aiofiles
    
    # 対応音声形式のチェック
    allowed_extensions = ['wav', 'mp3', 'm4a', 'webm']
    file_extension = audio.filename.split('.')[-1].lower() if audio.filename else 'wav'
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"サポートされていないファイル形式です。対応形式: {', '.join(allowed_extensions)}"
        )
    
    # ファイルサイズのチェック（25MB）
    MAX_FILE_SIZE = 25 * 1024 * 1024
    contents = await audio.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="ファイルサイズが大きすぎます。最大25MBまでです。"
        )
    
    await audio.seek(0)
    
    try:
        from openai import OpenAI
        
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            # デモ用レスポンス
            return {
                "text": "こんにちは。今日は良い天気ですね。",
                "duration": 2.5
            }
        
        client = OpenAI(api_key=api_key)
        
        # 一時ファイルに保存
        with tempfile.NamedTemporaryFile(suffix=f".{file_extension}", delete=False) as tmp_file:
            async with aiofiles.open(tmp_file.name, 'wb') as f:
                content = await audio.read()
                await f.write(content)
            
            tmp_file_path = tmp_file.name
        
        # 音声ファイルを開いてWhisper APIに送信
        with open(tmp_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="ja"
            )
        
        # 音声の長さを取得（簡易的に推定）
        duration = file_size / (16000 * 2)
        
        logger.info(f"音声認識成功: {len(transcript.text)}文字")
        
        return {
            "text": transcript.text,
            "duration": round(duration, 2)
        }
            
    except Exception as e:
        logger.error(f"音声認識エラー: {type(e).__name__}: {str(e)}")
        # フォールバック
        return {
            "text": "音声の認識中にエラーが発生しました。",
            "duration": 1.0
        }
    finally:
        # 一時ファイルのクリーンアップ
        try:
            if 'tmp_file_path' in locals():
                os.unlink(tmp_file_path)
        except Exception:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)