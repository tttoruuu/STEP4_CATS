"""
フリー会話練習機能 v2.0 API
4種類の固定キャラクターとの会話練習
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
from openai import OpenAI
from database import get_db
from auth.jwt import get_current_user
from models.user import User
import json
import re
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

router = APIRouter(prefix="/api/conversation/practice", tags=["conversation-practice"])

# OpenAI クライアント初期化
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# テストユーザーリスト（使用制限なし）
TEST_USERS = ["miraim@test.com", "demo@test.com", "test@example.com"]

# 1日の利用制限（通常ユーザー）
DAILY_LIMIT = 3

# NGワードパターン
NG_PATTERNS = [
    r"電話番号|住所|LINE|ライン",  # 個人情報
    r"下ネタ|エッチ|セクハラ",      # 不適切な内容
    r"ブス|デブ|死ね|殺す"         # 攻撃的表現
]

# キャラクター別システムプロンプト
CHARACTER_PROMPTS = {
    "misaki": """
あなたは28歳の看護師、佐藤美咲です。

【性格】
優しく穏やかで、相手の話をよく聞きます。共感力が高く、相手を安心させる雰囲気を持っています。

【話し方】
- 丁寧で温かみのある敬語を使います
- 「そうなんですね」「大変でしたね」など共感的な相槌を多く使います
- 相手が話しやすいよう、適度に質問を返します
- 沈黙があっても焦らず、相手のペースに合わせます

【設定】
婚活中の男性との初デートで、カフェで会話しています。
相手のことを知りたいと思っており、優しく話を聞きます。

【重要】
- 返答は自然な会話として80-150文字程度にまとめる
- 相手の話を引き出すような返答を心がける
- 個人情報は聞き出さない
""",
    
    "ai": """
あなたは26歳のイベントプランナー、鈴木愛です。

【性格】
明るく社交的で、話すことが大好き。テンポよく会話を楽しみます。

【話し方】
- カジュアルな敬語を使います
- 「えー！すごい！」「それめっちゃ分かります！」など感情豊かな表現
- 話題がコロコロ変わることもある
- リアクションが大きく、相手を楽しませようとします

【設定】
婚活パーティーで知り合った男性との初デート。
楽しい雰囲気を作りながら、お互いのことを知ろうとしています。

【重要】
- 返答は自然な会話として80-150文字程度にまとめる
- 明るく楽しい雰囲気を保つ
- でも聞き役になることも忘れない
""",
    
    "kaori": """
あなたは32歳の外資系コンサルタント、田中香織です。

【性格】
知的で理論的、自立心が強い。はっきりとした意見を持っています。

【話し方】
- ビジネスライクな丁寧語を使います
- 「なぜそう思われるんですか？」と理由を聞くことが多い
- 論理的な会話を好み、曖昧な表現は避けます
- 時事問題や仕事の話題に詳しい

【設定】
結婚相談所で紹介された男性との初対面。
相手の価値観や考え方を知りたいと思っています。

【重要】
- 返答は自然な会話として80-150文字程度にまとめる
- 知的な印象を保ちつつ、威圧的にならない
- 相手の意見を尊重しながら議論を楽しむ
""",
    
    "shizuka": """
あなたは30歳の図書館司書、山田静香です。

【性格】
内向的で慎重、観察力が高い。最初は控えめだが、徐々に心を開きます。

【話し方】
- 最初は短い返答が多い「...そうですね」「はい...」
- 徐々に打ち解けると、文化的な話題で饒舌になる
- 本、映画、美術などの話題を好む
- 相手の反応を見ながら慎重に話す

【設定】
友人の紹介で会った男性との初対面。
最初は緊張していますが、相手の人柄を見極めようとしています。

【重要】
- 返答は自然な会話として80-150文字程度にまとめる
- 会話の序盤は控えめに、徐々に打ち解ける
- 相手が聞き上手かどうかを試すような返答
"""
}

class ChatRequest(BaseModel):
    character_id: str
    message: str
    conversation_history: List[dict] = []
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    character_id: str

class FeedbackRequest(BaseModel):
    character_id: str
    conversation_history: List[dict]
    duration: int
    session_id: Optional[str] = None

def check_ng_words(message: str) -> bool:
    """NGワードチェック"""
    for pattern in NG_PATTERNS:
        if re.search(pattern, message, re.IGNORECASE):
            return True
    return False

def check_usage_limit(user_email: str, db: Session) -> dict:
    """利用制限チェック"""
    if user_email in TEST_USERS:
        return {"allowed": True, "remaining": "unlimited"}
    
    # TODO: データベースに利用履歴テーブルを作成して管理
    # 今は仮実装
    return {"allowed": True, "remaining": 3}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_character(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """キャラクターとの会話"""
    
    # 利用制限チェック
    usage = check_usage_limit(current_user.email, db)
    if not usage["allowed"]:
        raise HTTPException(
            status_code=429,
            detail="本日の利用回数上限に達しました。明日0時にリセットされます。"
        )
    
    # NGワードチェック
    if check_ng_words(request.message):
        return ChatResponse(
            reply="すみません、その話題は少し苦手で...他の話をしませんか？",
            character_id=request.character_id
        )
    
    # キャラクターのプロンプト取得
    if request.character_id not in CHARACTER_PROMPTS:
        raise HTTPException(status_code=400, detail="無効なキャラクターID")
    
    system_prompt = CHARACTER_PROMPTS[request.character_id]
    
    # 会話履歴を構築
    messages = [{"role": "system", "content": system_prompt}]
    
    # 過去の会話履歴を追加（最新10件まで）
    for msg in request.conversation_history[-10:]:
        role = "user" if msg.get("sender") == "user" else "assistant"
        messages.append({"role": role, "content": msg.get("text", "")})
    
    # 現在のメッセージを追加
    messages.append({"role": "user", "content": request.message})
    
    try:
        # OpenAI APIを呼び出し
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.8,
            max_tokens=200,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )
        
        reply = response.choices[0].message.content.strip()
        
        return ChatResponse(
            reply=reply,
            character_id=request.character_id
        )
        
    except Exception as e:
        print(f"OpenAI API エラー: {e}")
        raise HTTPException(status_code=500, detail="会話の生成に失敗しました")

@router.post("/feedback")
async def generate_feedback(
    request: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """会話のフィードバックを生成"""
    
    print(f"フィードバック生成開始: {request.character_id}, 履歴数: {len(request.conversation_history)}")
    
    # 会話ログを文字列に変換
    conversation_log = "\n".join([
        f"{'あなた' if msg.get('sender') == 'user' else 'キャラクター'}: {msg.get('text', msg.get('message', ''))}"
        for msg in request.conversation_history
    ])
    
    # フィードバック生成プロンプト
    feedback_prompt = f"""
以下の会話ログを分析し、婚活デートでの会話力向上のためのフィードバックをJSON形式で生成してください。

【評価項目と基準】
1. greeting（挨拶スキル）: 1-5点
   - 初対面の挨拶の自然さ
   - 会話の締めくくり方
   
2. empathy（相槌・共感スキル）: 1-5点
   - 「そうなんですね」「なるほど」など相槌のバリエーション
   - 相手の感情への共感表現
   
3. listening（聞く力）: 1-5点
   - オープンクエスチョンの使用
   - 話題の深掘り度合い
   - 相手の話を引き出す力

【必須JSON項目】
{{
  "skill_scores": {{
    "greeting": 1-5の数値,
    "empathy": 1-5の数値, 
    "listening": 1-5の数値
  }},
  "conversation_balance": {{
    "user": ユーザーの発言割合（%）,
    "partner": 相手の発言割合（%）
  }},
  "question_count": ユーザーの質問数,
  "empathy_count": 共感表現の回数,
  "good_points": [
    "良かった発言1の引用と理由",
    "良かった発言2の引用と理由",
    "良かった発言3の引用と理由"
  ],
  "improvement_points": [
    {{"before": "改善前の発言", "after": "改善例", "reason": "理由"}},
    {{"before": "改善前の発言", "after": "改善例", "reason": "理由"}},
    {{"before": "改善前の発言", "after": "改善例", "reason": "理由"}}
  ],
  "next_advice": "次回に向けた具体的アドバイス（100文字程度）"
}}

会話ログ：
{conversation_log}

必ず有効なJSONフォーマットで返答してください。
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは会話分析の専門家です。"},
                {"role": "user", "content": feedback_prompt}
            ],
            temperature=0.6,
            max_tokens=1500
        )
        
        feedback_text = response.choices[0].message.content.strip()
        
        # JSONとして解析を試みる
        try:
            feedback_data = json.loads(feedback_text)
        except:
            # JSON解析に失敗した場合は、テキストをそのまま返す
            feedback_data = {"raw_feedback": feedback_text}
        
        # 会話時間を追加
        feedback_data["duration"] = request.duration
        feedback_data["character_id"] = request.character_id
        
        return feedback_data
        
    except Exception as e:
        print(f"フィードバック生成エラー: {e}")
        import traceback
        traceback.print_exc()
        
        # エラー時のデフォルトフィードバック
        return {
            "skill_scores": {
                "greeting": 3,
                "empathy": 3,
                "listening": 3
            },
            "conversation_balance": {
                "user": 50,
                "partner": 50
            },
            "question_count": len([msg for msg in request.conversation_history if msg.get('sender') == 'user' and '？' in msg.get('text', '')]),
            "empathy_count": 2,
            "good_points": [
                "会話を最後まで続けられました",
                "相手の話に関心を示そうとしました",
                "自然な挨拶ができました"
            ],
            "improvement_points": [
                {"before": "はい", "after": "そうなんですね！それは面白いですね", "reason": "相槌にバリエーションを"},
                {"before": "そうですか", "after": "なるほど、もっと詳しく聞かせてください", "reason": "深掘りの質問を"},
                {"before": "ふーん", "after": "それは大変でしたね", "reason": "共感を示す"}
            ],
            "next_advice": "相手の話に「なぜ？」「どのように？」という質問を加えて、より深い会話を目指しましょう。",
            "duration": request.duration,
            "character_id": request.character_id,
            "error_fallback": True
        }

@router.get("/characters")
async def get_characters():
    """利用可能なキャラクター一覧を取得"""
    characters = [
        {
            "id": "misaki",
            "name": "佐藤美咲",
            "age": 28,
            "job": "看護師",
            "difficulty": "初級",
            "description": "穏やかで話しやすい雰囲気"
        },
        {
            "id": "ai",
            "name": "鈴木愛",
            "age": 26,
            "job": "イベントプランナー",
            "difficulty": "中級",
            "description": "明るくテンポの速い会話"
        },
        {
            "id": "kaori",
            "name": "田中香織",
            "age": 32,
            "job": "外資系コンサルタント",
            "difficulty": "中級",
            "description": "論理的で深い会話"
        },
        {
            "id": "shizuka",
            "name": "山田静香",
            "age": 30,
            "job": "図書館司書",
            "difficulty": "上級",
            "description": "控えめで徐々に心を開く"
        }
    ]
    return characters

@router.get("/usage")
async def get_usage_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """利用状況を確認"""
    usage = check_usage_limit(current_user.email, db)
    return usage