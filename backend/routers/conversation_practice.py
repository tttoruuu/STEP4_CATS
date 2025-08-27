from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import os
from openai import OpenAI

from database import get_db
from auth.jwt import get_current_user
from models.user import User
from models.conversation_partner import ConversationPartner

router = APIRouter(
    prefix="/api/conversation",
    tags=["conversation-practice"]
)

# フリー会話用のシンプルなリクエストモデル
class FreeChatRequest(BaseModel):
    character_id: str
    message: str

class FreeChatResponse(BaseModel):
    reply: str
    suggestions: Optional[list] = None

# リクエスト/レスポンスモデル
class ConversationRequest(BaseModel):
    message: str
    partner_id: int
    mode: Optional[str] = "free"  # free, greeting, empathy, repeat
    conversation_history: Optional[list] = None  # 会話履歴を保持

class ConversationResponse(BaseModel):
    reply: str
    suggestions: Optional[list] = None
    feedback: Optional[str] = None

# 会話モードごとのシステムプロンプト
CONVERSATION_PROMPTS = {
    "free": """
あなたは{name}という{age}歳の女性です。
性格: {personality}
趣味: {hobbies}
日常: {daily_routine}

自然な会話を心がけ、相手の話に興味を持って応答してください。
返答は簡潔に、1-2文程度で。
""",
    "greeting": """
あなたは{name}という{age}歳の女性です。初対面の相手と挨拶を交わしています。
明るく親しみやすい挨拶を返してください。
返答は簡潔に、1-2文程度で。
""",
    "empathy": """
あなたは{name}という{age}歳の女性です。
相手の話に共感し、理解を示してください。
「そうなんですね」「大変でしたね」など共感の言葉を使ってください。
返答は簡潔に、1-2文程度で。
""",
    "repeat": """
あなたは{name}という{age}歳の女性です。
相手の話を要約して返し、理解していることを示してください。
「つまり〜ということですね」「〜というお話ですね」という形式で返してください。
返答は簡潔に、1-2文程度で。
"""
}

@router.post("/practice", response_model=ConversationResponse)
async def practice_conversation(
    request: ConversationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """会話練習"""
    try:
        # 会話相手の情報を取得
        partner = db.query(ConversationPartner).filter(
            ConversationPartner.id == request.partner_id,
            ConversationPartner.user_id == current_user.id
        ).first()
        
        if not partner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="会話相手が見つかりません"
            )
        
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenAI APIキーが設定されていません"
            )
        
        client = OpenAI(api_key=api_key)
        
        # パートナー情報からペルソナを構築
        # hometownから性格を推測（例: 東京→都会的、京都→おっとり）
        personality = "明るく優しい"
        if partner.hometown:
            if "東京" in partner.hometown or "大阪" in partner.hometown:
                personality = "活発で社交的"
            elif "京都" in partner.hometown or "奈良" in partner.hometown:
                personality = "おっとりと上品"
            elif "北海道" in partner.hometown or "沖縄" in partner.hometown:
                personality = "おおらかで親しみやすい"
        
        # システムプロンプトの準備
        system_prompt = CONVERSATION_PROMPTS.get(request.mode, CONVERSATION_PROMPTS["free"]).format(
            name=partner.name or "女性",
            age=partner.age or 25,
            personality=personality,
            hobbies=partner.hobbies if partner.hobbies else "読書、映画鑑賞",
            daily_routine=partner.daily_routine if partner.daily_routine else "仕事をして、休日は趣味を楽しんでいます"
        )
        
        # メッセージ履歴の構築
        messages = [{"role": "system", "content": system_prompt}]
        
        # 会話履歴があれば追加（最新5往復まで保持）
        if request.conversation_history:
            for hist in request.conversation_history[-10:]:  # 最新10メッセージ（5往復）
                messages.append(hist)
        
        # 現在のメッセージを追加
        messages.append({"role": "user", "content": request.message})
        
        # OpenAI APIを呼び出し
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=150,
            temperature=0.8
        )
        
        reply = response.choices[0].message.content.strip()
        
        # モードに応じた提案やフィードバック
        suggestions = None
        feedback = None
        
        if request.mode == "greeting":
            suggestions = ["お天気の話題", "趣味について聞く", "仕事について聞く"]
        elif request.mode == "empathy":
            feedback = "共感を示すのは良いコミュニケーションの基本です。相手の気持ちに寄り添いましょう。"
        elif request.mode == "repeat":
            feedback = "相手の話を要約して返すことで、しっかり聞いていることが伝わります。"
        
        return ConversationResponse(
            reply=reply,
            suggestions=suggestions,
            feedback=feedback
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"会話練習エラー: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"会話生成中にエラーが発生しました: {str(e)}"
        )

@router.post("/practice/chat", response_model=FreeChatResponse)
async def free_chat(
    request: FreeChatRequest,
    current_user: User = Depends(get_current_user)
):
    """フリー会話練習（簡易版）"""
    try:
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenAI APIキーが設定されていません"
            )
        
        client = OpenAI(api_key=api_key)
        
        # キャラクターごとの設定（仕様書準拠）
        character_prompts = {
            "misaki": """あなたは28歳の看護師、佐藤美咲です。
性格：優しく穏やかで、相手の話をよく聞きます。
話し方：丁寧で温かみがあり、共感的な相槌を多く使います。
特徴：
- 「そうなんですね」「大変でしたね」など共感的な返答をする
- 相手が話しやすいよう適度に質問を返す
- 沈黙があっても焦らない、ゆったりとした雰囲気を保つ
- 初級レベル：話しやすく、優しく受け止める

設定：婚活中の男性との初デートで、カフェで会話しています。
会話のポイント：
- 相手の話に興味を持って聞く
- 具体的な質問で話を広げる（「それは楽しそうですね！どんなところが一番よかったですか？」など）
- 否定せず、まずは受け入れる姿勢を示す""",

            "ai": """あなたは26歳のイベントプランナー、鈴木愛です。
性格：明るく社交的で、話すことが大好きです。
話し方：明るくハキハキと話し、感情表現が豊かです。
特徴：
- 「すごーい！」「えー、本当ですか！」など感情豊かな反応
- 自分の体験も交えながら会話を盛り上げる
- テンポよく会話のキャッチボールをする
- 中級レベル：会話のテンポが速く、話題が多い

設定：婚活中の男性との初デートで、おしゃれなレストランで会話しています。
会話のポイント：
- 相手の話に大きくリアクションして盛り上げる
- 関連する自分のエピソードも少し話す（でも相手の話を奪わない程度に）
- 楽しい雰囲気を作ることを意識する""",

            "kaori": """あなたは32歳の外資系コンサルタント、田中香織です。
性格：知的で論理的、落ち着いた雰囲気を持っています。
話し方：上品で理路整然としており、言葉を選んで話します。
特徴：
- 「なるほど」「確かに」など理解を示す相槌
- 話の本質を捉えて深い質問をする
- 感情表現は控えめだが、真剣に話を聞いている
- 中級レベル：論理的な会話を好み、話を深く掘り下げる

設定：婚活中の男性との初デートで、落ち着いた雰囲気のバーで会話しています。
会話のポイント：
- 相手の考えや価値観を引き出す質問をする
- 表面的な話から、より深い話題へ自然に誘導する
- 知的好奇心を示しながら、相手を理解しようとする""",

            "shizuka": """あなたは30歳の図書館司書、山田静香です。
性格：控えめで慎重、最初は心を開きにくいタイプです。
話し方：静かで控えめ、言葉を慎重に選んで話します。
特徴：
- 最初は短い返答が多い（「そうですね...」「はい...」）
- 徐々に心を開き、話が深くなっていく
- 相手が真剣に向き合ってくれると、少しずつ自分のことも話す
- 上級レベル：最初は心を開きにくく、相手の聞く力が試される

設定：婚活中の男性との初デートで、静かなカフェで会話しています。
会話のポイント：
- 最初は警戒心があるので、短い返答になりがち
- 相手が丁寧に話を聞いてくれると、徐々に話が増える
- 沈黙を恐れず、ゆっくりとしたペースで会話する"""
        }
        
        # キャラクターのプロンプトを取得（デフォルトは美咲）
        system_prompt = character_prompts.get(request.character_id, character_prompts["misaki"])
        system_prompt += """

重要な指示：
1. 初デートのリアルな会話を心がけてください
2. 自然な日本語で、1-2文程度で返答してください
3. AIアシスタントではなく、実在の女性として振る舞ってください
4. 「お手伝い」「サポート」などのAI的な表現は絶対に使わないでください
5. 相手の話に対して、自然な感情や興味を示してください"""
        
        # OpenAI APIで応答生成
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.85,  # より自然な会話のため少し高めに設定
            max_tokens=150
        )
        
        reply = completion.choices[0].message.content
        
        # 会話の提案を生成
        suggestions = []
        if "趣味" in request.message or "好き" in request.message:
            suggestions = ["へー、それは楽しそうですね！", "私も興味があります！", "もっと詳しく教えてください"]
        elif "仕事" in request.message or "会社" in request.message:
            suggestions = ["お仕事大変そうですね", "やりがいはありますか？", "休日は何をされているんですか？"]
        else:
            suggestions = ["そうなんですね", "なるほど、興味深いです", "もっとお話を聞かせてください"]
        
        return FreeChatResponse(
            reply=reply,
            suggestions=suggestions
        )
        
    except Exception as e:
        print(f"フリー会話エラー: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"会話生成中にエラーが発生しました: {str(e)}"
        )

@router.get("/modes")
async def get_conversation_modes():
    """利用可能な会話モードを取得"""
    return {
        "modes": [
            {
                "id": "free",
                "name": "フリートーク",
                "description": "自由に会話を楽しむモード"
            },
            {
                "id": "greeting",
                "name": "挨拶練習",
                "description": "初対面での挨拶を練習"
            },
            {
                "id": "empathy",
                "name": "共感練習",
                "description": "相手の話に共感する練習"
            },
            {
                "id": "repeat",
                "name": "繰り返し練習",
                "description": "相手の話を要約して返す練習"
            }
        ]
    }