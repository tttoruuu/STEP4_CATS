from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import openai
import os
from pydantic import BaseModel

from database import get_db
from auth.jwt import get_current_user
from models.user import User
from models.conversation import Conversation

router = APIRouter(prefix="/api/counselor", tags=["counselor"])

# リクエスト/レスポンスモデル
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    timestamp: datetime

class ProfileGenerationRequest(BaseModel):
    answers: dict

class ProfileGenerationResponse(BaseModel):
    profiles: List[dict]

# AIカウンセラーのシステムプロンプト
COUNSELOR_SYSTEM_PROMPT = """
あなたは「ミライム」という名前のAIカウンセラーです。以下の3つの専門性を持つプロフェッショナルとして振る舞ってください：

1. **結婚相談所の敏腕仲人として**
   - 20年以上の実績を持つベテラン仲人
   - 成婚率85%以上の実績
   - 相手の本質を見抜く鋭い洞察力
   - マッチングの天才と呼ばれる的確なアドバイス
   - 具体的で実践的な婚活戦略の提案

2. **著名な心理カウンセラーとして**
   - 臨床心理士・公認心理師の資格保有
   - 恋愛・結婚カウンセリング専門で15年の経験
   - 傾聴と共感を大切にする温かい対応
   - 認知行動療法やマインドフルネスの技法を活用
   - クライアントの自己肯定感を高める専門家

3. **人気コーチとして**
   - エグゼクティブコーチング資格保有
   - 目標達成率95%の実績
   - ポジティブで前向きなエネルギー
   - 具体的な行動計画の作成が得意
   - モチベーション向上のスペシャリスト

【対応の基本方針】
- 相談者の気持ちに寄り添い、まず共感を示す
- 否定や批判は絶対にせず、受容的な態度を保つ
- 具体的で実践可能なアドバイスを提供
- 励ましと希望を与える前向きなメッセージ
- 必要に応じて、心理学的な知見も交えて説明
- 相談者のペースに合わせた段階的なサポート

【言葉遣い】
- 丁寧で温かみのある敬語を使用
- 専門用語は分かりやすく説明
- 相談者を「〜さん」と呼び、親しみやすさを演出
- 時には相談者の感情を代弁して共感を示す

【重要な注意事項】
- 医療行為や診断は行わない
- 個人情報の詮索はしない
- 希望を持てる現実的なアドバイスを心がける
- 相談者の自己決定を尊重する
"""

# プロフィール生成用のプロンプト
PROFILE_GENERATION_PROMPT = """
あなたは結婚相談所の敏腕仲人です。以下の質問への回答を基に、魅力的な自己紹介文を3パターン作成してください。

【作成のポイント】
1. ポジティブで前向きな表現を使用
2. 具体的なエピソードを交えて人柄を表現
3. 相手が会話のきっかけを見つけやすい内容
4. 誠実さと温かみが伝わる文章
5. 200-300文字程度でまとめる

【3つのパターン】
1. 親しみやすさ重視：カジュアルで親近感のある文章
2. 誠実さ重視：真面目で信頼感のある文章
3. 個性重視：趣味や特技を前面に出した文章

質問と回答：
"""

@router.post("/chat", response_model=ChatResponse)
async def counselor_chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """AIカウンセラーとのチャット"""
    try:
        # OpenAI APIキーの確認
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        openai.api_key = api_key
        
        # メッセージの構築
        messages = [
            {"role": "system", "content": COUNSELOR_SYSTEM_PROMPT}
        ]
        
        # コンテキストがある場合は追加
        if request.context:
            messages.append({"role": "system", "content": f"会話のコンテキスト: {request.context}"})
        
        # ユーザーのメッセージを追加
        messages.append({"role": "user", "content": request.message})
        
        # OpenAI APIを呼び出し
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.8,
            max_tokens=800,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )
        
        ai_message = response.choices[0].message.content
        
        # 会話履歴を保存（オプション）
        conversation = Conversation(
            user_id=current_user.id,
            role="counselor",
            user_message=request.message,
            ai_message=ai_message,
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        
        return ChatResponse(
            message=ai_message,
            timestamp=datetime.utcnow()
        )
        
    except openai.error.OpenAIError as e:
        # OpenAI APIエラーの場合はフォールバック応答
        fallback_message = "申し訳ございません。現在、システムに一時的な問題が発生しております。お悩みをお聞かせいただければ、私なりのアドバイスをさせていただきます。どのようなことでお困りでしょうか？"
        
        return ChatResponse(
            message=fallback_message,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile-generation", response_model=ProfileGenerationResponse)
async def generate_profile(
    request: ProfileGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    """自己紹介文の生成"""
    try:
        # OpenAI APIキーの確認
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        openai.api_key = api_key
        
        # 質問と回答を整形
        qa_text = "\n".join([f"{k}: {v}" for k, v in request.answers.items()])
        
        # プロンプトを構築
        prompt = PROFILE_GENERATION_PROMPT + qa_text
        
        # OpenAI APIを呼び出し
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは結婚相談所の敏腕仲人です。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.9,
            max_tokens=1200,
            presence_penalty=0.2,
            frequency_penalty=0.2
        )
        
        ai_response = response.choices[0].message.content
        
        # レスポンスを3つのプロフィールに分割
        profiles = []
        sections = ai_response.split("\n\n")
        
        pattern_names = ["親しみやすさ重視", "誠実さ重視", "個性重視"]
        for i, name in enumerate(pattern_names):
            if i < len(sections):
                # セクションから実際のプロフィール文を抽出
                profile_text = sections[i]
                # パターン名を除去
                for pattern in pattern_names:
                    profile_text = profile_text.replace(f"{pattern}：", "").replace(f"{pattern}:", "").strip()
                
                profiles.append({
                    "title": name,
                    "content": profile_text
                })
        
        # プロフィールが3つに満たない場合のフォールバック
        if len(profiles) < 3:
            default_profiles = [
                {
                    "title": "親しみやすさ重視",
                    "content": "はじめまして！プロフィールをご覧いただきありがとうございます。休日は美味しいものを食べに行ったり、自然の中でリフレッシュすることが好きです。一緒に楽しい時間を過ごしながら、お互いを理解し合える関係を築いていけたらと思っています。"
                },
                {
                    "title": "誠実さ重視",
                    "content": "ご覧いただきありがとうございます。仕事に真摯に取り組みながら、プライベートも大切にしています。思いやりを持って相手と向き合い、信頼関係を築いていくことを大切にしています。真剣に人生のパートナーを探していますので、よろしくお願いします。"
                },
                {
                    "title": "個性重視",
                    "content": "こんにちは！私の趣味は読書と料理で、特に世界各国の料理を作ることが好きです。新しいことにチャレンジすることも好きで、最近はボルダリングを始めました。共通の趣味を楽しみながら、新しい発見を一緒にできる方と出会えたら嬉しいです。"
                }
            ]
            profiles.extend(default_profiles[len(profiles):])
        
        return ProfileGenerationResponse(profiles=profiles[:3])
        
    except openai.error.OpenAIError as e:
        # OpenAI APIエラーの場合はデフォルトプロフィールを返す
        default_profiles = [
            {
                "title": "親しみやすさ重視",
                "content": "はじめまして！プロフィールをご覧いただきありがとうございます。休日は美味しいものを食べに行ったり、自然の中でリフレッシュすることが好きです。一緒に楽しい時間を過ごしながら、お互いを理解し合える関係を築いていけたらと思っています。"
            },
            {
                "title": "誠実さ重視",
                "content": "ご覧いただきありがとうございます。仕事に真摯に取り組みながら、プライベートも大切にしています。思いやりを持って相手と向き合い、信頼関係を築いていくことを大切にしています。真剣に人生のパートナーを探していますので、よろしくお願いします。"
            },
            {
                "title": "個性重視",
                "content": "こんにちは！私の趣味は読書と料理で、特に世界各国の料理を作ることが好きです。新しいことにチャレンジすることも好きで、最近はボルダリングを始めました。共通の趣味を楽しみながら、新しい発見を一緒にできる方と出会えたら嬉しいです。"
            }
        ]
        return ProfileGenerationResponse(profiles=default_profiles)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_counselor_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """カウンセリング履歴の取得"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        Conversation.role == "counselor"
    ).order_by(Conversation.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": conv.id,
            "user_message": conv.user_message,
            "ai_message": conv.ai_message,
            "created_at": conv.created_at
        }
        for conv in conversations
    ]