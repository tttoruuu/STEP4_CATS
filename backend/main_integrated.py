from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import conversation_partners, personality, marriage_mbti
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv

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

# ルーター追加（conversation系を最初に、認証なしで動作）
app.include_router(conversation_partners.router)
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])
app.include_router(marriage_mbti.router, prefix="/api/marriage-mbti", tags=["marriage-mbti"])

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
            "conversation": "active",
            "personality": "active", 
            "marriage_mbti": "active"
        }
    }

# 会話フィードバック機能（認証なし版 - 開発用）
@app.post("/conversation-feedback")
async def generate_conversation_feedback_simple(data: dict):
    """
    会話履歴に基づいてフィードバックを生成するエンドポイント（認証なし版）
    """
    # パラメータの取得
    partner_id = data.get('partnerId', '')
    meeting_count = data.get('meetingCount', '')
    chat_history = data.get('chatHistory', [])
    
    # 緊急フォールバック応答
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
        from openai import OpenAI
        
        # OpenAI APIキーを設定
        api_key = os.environ.get("OPENAI_API_KEY")
        
        if not api_key:
            logger.warning("OpenAI APIキーが設定されていません - フォールバック応答を返します")
            return fallback_feedback
            
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
            timeout=60
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
                    
        return fallback_feedback
                
    except Exception as e:
        logger.error(f"フィードバック生成エラー: {type(e).__name__}: {str(e)}")
        return fallback_feedback

# 音声認識機能（認証なし版 - 開発用）
@app.post("/speech-to-text")
async def speech_to_text_simple(audio: UploadFile = File(...)):
    """
    音声ファイルをテキストに変換するエンドポイント（認証なし版）
    """
    import tempfile
    import aiofiles
    
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