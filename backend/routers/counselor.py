from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
import os
from pydantic import BaseModel

from database import get_db
from auth.jwt import get_current_user
from models.user import User
from models.conversation import Conversation

router = APIRouter(prefix="/api/counselor", tags=["counselor"])

# 開発環境用の簡易認証機能
async def get_dev_user(db: Session = Depends(get_db)):
    """開発環境用：認証をバイパスしてテストユーザーを返す"""
    if os.getenv("ENV") == "development":
        # 開発環境では taniguchi ユーザーを返す
        user = db.query(User).filter(User.username == "taniguchi").first()
        if user:
            return user
        # フォールバック：最初のユーザーを返す
        user = db.query(User).first()
        if user:
            return user
    # 本番環境では通常の認証を使用（実装時は適切な認証を設定）
    raise HTTPException(status_code=401, detail="Authentication required")

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

class ConversationSaveRequest(BaseModel):
    messages: List[dict]

class ConversationSaveResponse(BaseModel):
    conversation_id: str
    saved: bool

class ConversationHistoryResponse(BaseModel):
    messages: List[dict]

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
- 抽象的ではなく、具体的で実践可能なアドバイスを提供する
- 相談者が「何に困っているのか」「なぜ困っているのか」「どうして欲しいのか」を理解し、寄り添う
- 励ましと希望を与える前向きなメッセージ
- 必要に応じて、心理学的な知見も交えて説明
- 相談者のペースに合わせた段階的なサポート

【具体的なアドバイスの提供方法】
- 「頑張って」ではなく「明日、○○をしてみましょう」といった具体的な行動を提案
- 「大丈夫ですよ」ではなく「こういう理由で、このような方法を試すと改善されます」と理論的に説明
- 抽象的な励ましより、実際に使える会話例やフレーズを提示
- 相談者の状況に応じた個別最適化されたアドバイス

【相談者への寄り添い方】
- 相談者の感情を受け止め「○○で辛いんですね」と具体的に反映
- 困っている理由を一緒に整理し「おそらく△△が原因かもしれませんね」と分析
- 相談者が求めていることを汲み取り「□□したいということですね」と確認
- その上で、実現可能な具体的ステップを提案

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

【返答のルール】
- 返答は150〜200文字程度を目安にする
- 内容によっては200文字を超えても良いが、その場合は適切に改行を入れて読みやすくする
- 簡潔で分かりやすい表現を心がける
- 1つの返答で1〜2つのポイントに絞って話す
- 抽象的な表現は避け、具体的で実践的な内容にする
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
    current_user: User = Depends(get_dev_user),
    db: Session = Depends(get_db)
):
    """AIカウンセラーとのチャット"""
    try:
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        client = OpenAI(api_key=api_key)
        
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
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.8,
            max_tokens=300,  # 文字数制限のため調整
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
        
    except Exception as e:
        # OpenAI APIエラーの場合はフォールバック応答
        print(f"OpenAI API Error: {str(e)}")
        fallback_message = "申し訳ございません。現在、システムに一時的な問題が発生しております。お悩みをお聞かせいただければ、私なりのアドバイスをさせていただきます。どのようなことでお困りでしょうか？"
        
        return ChatResponse(
            message=fallback_message,
            timestamp=datetime.utcnow()
        )

@router.post("/profile-generation", response_model=ProfileGenerationResponse)
async def generate_profile(
    request: ProfileGenerationRequest,
    current_user: User = Depends(get_dev_user)
):
    """自己紹介文の生成"""
    try:
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        client = OpenAI(api_key=api_key)
        
        # 質問と回答を整形
        qa_text = "\n".join([f"{k}: {v}" for k, v in request.answers.items()])
        
        # プロンプトを構築
        prompt = PROFILE_GENERATION_PROMPT + qa_text
        
        # OpenAI APIを呼び出し
        response = client.chat.completions.create(
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
        
    except Exception as e:
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

async def generate_conversation_title(messages: List[dict]) -> str:
    """会話内容からタイトルを生成"""
    try:
        # OpenAI APIキーの確認
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # フォールバック: 最初のユーザーメッセージから作成
            first_user_msg = next((msg["content"] for msg in messages if msg["role"] == "user"), "")
            return first_user_msg[:20] + "..." if len(first_user_msg) > 20 else first_user_msg or "相談セッション"
        
        # 会話の要約を作成するためのプロンプト
        conversation_text = ""
        for msg in messages[:6]:  # 最初の3往復のみ使用
            role = "相談者" if msg["role"] == "user" else "カウンセラー"
            conversation_text += f"{role}: {msg['content']}\n"
        
        title_prompt = f"""
以下の婚活カウンセリング会話から、相談内容を的確に要約した短いタイトルを生成してください。

【会話内容】
{conversation_text}

【タイトル生成ルール】
- 10-20文字程度で簡潔に
- 相談者の悩みや課題の核心を表現
- 相談者が「何について」悩んでいるかを明確に
- 具体的で分かりやすい表現を使用
- 語尾「について」「の相談」「の悩み」は省略

【良い例】
- 相談内容：「プロフィール写真をどう選べばいいか分からない」→「プロフィール写真選び」
- 相談内容：「初回デートで何を話せばいいか不安」→「初回デート会話術」
- 相談内容：「マッチングしても続かない」→「マッチング後の進め方」
- 相談内容：「自己紹介文が書けない」→「魅力的な自己紹介文作成」

相談内容を分析して、最も適切なタイトルを1つ生成してください。

タイトル:"""

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは会話内容から適切なタイトルを生成するAIです。"},
                {"role": "user", "content": title_prompt}
            ],
            temperature=0.3,
            max_tokens=50
        )
        
        title = response.choices[0].message.content.strip()
        # 「タイトル:」プレフィックスがある場合は除去
        title = title.replace("タイトル:", "").strip()
        
        return title if title else "婚活相談"
        
    except Exception as e:
        print(f"Title generation error: {e}")
        # エラー時のフォールバック
        first_user_msg = next((msg["content"] for msg in messages if msg["role"] == "user"), "")
        return first_user_msg[:20] + "..." if len(first_user_msg) > 20 else first_user_msg or "相談セッション"

@router.post("/save", response_model=ConversationSaveResponse)
async def save_conversation(
    request: ConversationSaveRequest,
    current_user: User = Depends(get_dev_user),
    db: Session = Depends(get_db)
):
    """会話の保存"""
    try:
        # 会話IDを生成
        conversation_id = f"conv_{current_user.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        print(f"Generated conversation_id: {conversation_id}")
        
        # 会話内容からタイトルを自動生成
        title = await generate_conversation_title(request.messages)
        print(f"Generated title: {title}")
        
        # メッセージをペアで保存
        conversation_saved = False
        saved_count = 0
        i = 0
        
        # 最初のAIメッセージをスキップ
        if len(request.messages) > 0 and request.messages[0]["role"] == "ai":
            i = 1
        
        # ユーザーメッセージから始まるペアを探す
        while i < len(request.messages) - 1:
            if request.messages[i]["role"] == "user" and request.messages[i + 1]["role"] == "ai":
                user_msg = request.messages[i]
                ai_msg = request.messages[i + 1]
                
                print(f"Processing pair at index {i}: user_content='{user_msg['content'][:50]}...', ai_content='{ai_msg['content'][:50]}...'")
                
                try:
                    # タイムスタンプの処理
                    timestamp = user_msg.get("timestamp")
                    if timestamp:
                        if isinstance(timestamp, str):
                            # ISO形式の文字列をパース
                            created_at = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        else:
                            # すでにdatetimeオブジェクトの場合
                            created_at = timestamp
                    else:
                        created_at = datetime.utcnow()
                    
                    conversation = Conversation(
                        user_id=current_user.id,
                        role="counselor",
                        user_message=user_msg["content"],
                        ai_message=ai_msg["content"],
                        conversation_id=conversation_id,
                        conversation_title=title if not conversation_saved else None,  # 最初のレコードのみタイトルを保存
                        created_at=created_at
                    )
                    db.add(conversation)
                    conversation_saved = True
                    saved_count += 1
                    print(f"Saved conversation pair {saved_count} with conversation_id: {conversation_id}")
                    
                except Exception as e:
                    print(f"Error creating conversation: {e}")
                    print(f"User message: {user_msg}")
                    print(f"AI message: {ai_msg}")
                    raise
                
                # 次のペアへ（2つずつ進める）
                i += 2
            else:
                # ペアになっていない場合は1つずつ進める
                i += 1
        
        if saved_count == 0:
            print("No conversation pairs were saved")
            return ConversationSaveResponse(
                conversation_id=conversation_id,
                saved=False
            )
        
        db.commit()
        print(f"Successfully saved {saved_count} conversation pairs")
        
        return ConversationSaveResponse(
            conversation_id=conversation_id,
            saved=True
        )
        
    except Exception as e:
        db.rollback()
        print(f"Save conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save conversation: {str(e)}")

@router.get("/current-time")
async def get_current_time():
    """現在の日本時間を取得（認証不要）"""
    from datetime import timezone, timedelta
    jst = timezone(timedelta(hours=9))
    now = datetime.now(jst)
    print(f"Current time requested: {now.strftime('%H:%M')}")
    return {
        "current_time": now.isoformat(),
        "formatted_time": now.strftime("%H:%M"),
        "formatted_date": now.strftime("%Y/%m/%d(%a)")
    }

@router.get("/history")
async def get_counselor_history(
    current_user: User = Depends(get_dev_user),
    db: Session = Depends(get_db)
):
    """カウンセリング履歴の取得（会話セッションごとにグループ化）"""
    # conversation_idごとにグループ化して取得
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        Conversation.role == "counselor",
        Conversation.conversation_id.isnot(None)
    ).order_by(Conversation.created_at.desc()).all()
    
    # conversation_idでグループ化
    grouped_conversations = {}
    for conv in conversations:
        conv_id = getattr(conv, 'conversation_id', None)
        if conv_id:
            if conv_id not in grouped_conversations:
                grouped_conversations[conv_id] = []
            grouped_conversations[conv_id].append(conv)
    
    # 会話セッションごとの履歴を作成
    session_history = []
    for conv_id, conv_list in grouped_conversations.items():
        # 最初のメッセージを取得
        first_conv = min(conv_list, key=lambda x: x.created_at)
        
        # タイトル取得（保存されたタイトルまたはフォールバック）
        title = getattr(first_conv, 'conversation_title', None)
        if not title:
            # フォールバック: 最初のユーザーメッセージから作成
            user_message = first_conv.user_message
            title = user_message[:30] + "..." if len(user_message) > 30 else user_message
        
        # サマリー生成（最初のAIレスポンスの冒頭を使用）
        ai_message = first_conv.ai_message
        summary = ai_message[:60] + "..." if len(ai_message) > 60 else ai_message
        
        # やり取り回数を計算
        exchange_count = len(conv_list)
        
        session_history.append({
            "id": first_conv.id,
            "conversation_id": conv_id,
            "title": title,
            "summary": summary,
            "exchange_count": exchange_count,
            "created_at": first_conv.created_at,
            "last_updated": max(conv_list, key=lambda x: x.created_at).created_at
        })
    
    # 最新の更新日時でソート
    session_history.sort(key=lambda x: x["last_updated"], reverse=True)
    
    return session_history[:20]  # 最新20セッションを返す

@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_by_id(
    conversation_id: str,
    current_user: User = Depends(get_dev_user),
    db: Session = Depends(get_db)
):
    """特定の会話履歴の取得"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        Conversation.conversation_id == conversation_id
    ).order_by(Conversation.created_at.asc()).all()
    
    if not conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = []
    for conv in conversations:
        messages.append({
            "role": "user",
            "content": conv.user_message,
            "timestamp": conv.created_at.isoformat()
        })
        messages.append({
            "role": "ai",
            "content": conv.ai_message,
            "timestamp": conv.created_at.isoformat()
        })
    
    return ConversationHistoryResponse(messages=messages)