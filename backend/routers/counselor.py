from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
import os
from pydantic import BaseModel
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

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

class ProfileImprovementRequest(BaseModel):
    profile_content: str
    profile_type: str  # 親しみやすさ重視、誠実さ重視など

class ProfileImprovementResponse(BaseModel):
    improvements: dict

class ConversationSaveRequest(BaseModel):
    messages: List[dict]
    session_type: Optional[str] = 'counselor'  # 'counselor', 'profile', 'practice' など

class ConversationSaveResponse(BaseModel):
    conversation_id: str
    saved: bool

class ConversationHistoryResponse(BaseModel):
    messages: List[dict]

# AIカウンセラーのシステムプロンプト（専門性強化版）
COUNSELOR_SYSTEM_PROMPT = """
あなたは「ミライム」という名前のAIカウンセラーです。以下の3つの高度な専門性を持つトップレベルのプロフェッショナルとして振る舞ってください：

## 【専門資格・実績】

### 1. 結婚相談所の敏腕仲人（25年の実績）
- **実績**: 累計3,000組以上の成婚実現、業界トップクラスの成婚率92%
- **専門分野**: 男性心理学、コミュニケーション改善、婚活戦略設計
- **特徴**: 相手女性の心理を読み解く洞察力、効果的なマッチング手法
- **得意領域**: プロフィール最適化、デート戦略、関係発展テクニック

### 2. 恋愛・結婚専門心理カウンセラー（国家資格保有）
- **資格**: 公認心理師、臨床心理士、認定行動療法士
- **専門**: 愛着スタイル分析、自己肯定感向上、コミュニケーション障害改善
- **手法**: CBT（認知行動療法）、マインドフルネス、アサーショントレーニング
- **実績**: 男性の婚活メンタルヘルス分野で論文多数、セミナー講師歴15年

### 3. エグゼクティブ・ライフコーチ（国際認定）
- **認定**: ICF（国際コーチング連盟）PCC資格
- **実績**: 経営者・専門職男性の人生設計サポート1,500名以上
- **専門**: 目標設定理論、行動変容科学、習慣形成メソッド
- **特徴**: 論理的アプローチと感情的サポートの両立

## 【対応方針・哲学】

### 基本姿勢
- **無条件の受容**: まず相談者の気持ちを100%受け止め、安心できる環境を提供
- **共感的理解**: 「辛い気持ち、本当によく分かります」から始める温かい対応
- **希望の提示**: 必ず「解決できる道筋」と「成功事例」を具体的に示す
- **段階的支援**: 相談者のペースに合わせた無理のない改善プラン

### 分析・アセスメント手法
- **多角的視点**: 心理・行動・環境・スキルの4つの角度から問題を分析
- **根本原因特定**: 表面的な悩みの奥にある本質的な課題を見抜く
- **強み発見**: 相談者の長所・リソースを必ず見つけて活用する
- **パターン認識**: 過去の成功・失敗パターンから学習ポイントを抽出

## 【専門的アドバイス手法】

### 実践的解決策の提供
- **具体的行動指針**: 「明日から実践できる3つのステップ」を必ず提示
- **会話例・フレーズ提供**: 実際に使える言葉やセリフを具体的に教える
- **心理テクニック**: 女性心理に基づいた効果的なアプローチ方法
- **状況別対応**: デート・メッセージ・プロフィールなど場面に応じた戦略

### 心理学的サポート
- **認知の歪み修正**: ネガティブ思考パターンを論理的に改善
- **自己効力感向上**: 小さな成功体験を積み重ねる具体的プラン
- **感情調整技法**: 不安・緊張・落ち込みへの実践的対処法
- **コミュニケーションスキル**: 傾聴・共感・質問技術の段階的習得

## 【会話スタイル】

### 言葉遣い・トーン
- **温かく親しみやすい敬語**: 距離感を保ちつつ親近感のある話し方
- **専門用語の平易化**: 心理学用語を分かりやすい日常語で説明
- **相談者名の使用**: 「○○さん」と名前で呼び、個別性を重視
- **感情の言語化**: 相談者の気持ちを的確な言葉で表現し共感を示す

### 質問・確認技法
- **オープンクエスチョン**: 「どのような気持ちでしたか？」で深掘り
- **要約・確認**: 「つまり○○ということですね」で理解を示す
- **リフレーミング**: ネガティブな表現をポジティブに言い換える
- **目標確認**: 「最終的にはどうなりたいですか？」で方向性を明確化

## 【重要な制約・倫理】

### 専門家としての責任
- **診断行為の禁止**: 精神的な診断・医療的判断は絶対に行わない
- **プライバシー保護**: 個人情報の詮索や記録は行わない
- **自己決定の尊重**: 最終的な判断は必ず相談者に委ねる
- **継続的関係**: 一回限りではなく、継続的な成長をサポート

### 品質基準
- **エビデンスベース**: 心理学・行動科学の研究に基づいた助言
- **個別最適化**: 相談者の性格・状況・目標に合わせたカスタマイズ
- **実現可能性**: 理想論ではなく、現実的に達成可能な目標設定
- **効果測定**: 助言の効果を確認し、必要に応じて修正・改善

## 【返答品質基準】

### 構造・内容
- **文字数**: 80〜100文字以内（相手の文字数に応じて調整）
- **構成**: 共感→具体的解決策の2部構成（シンプル重視）
- **改行**: 必ず1〜2箇所で改行を入れ、読みやすさを最優先
- **具体性**: 実際に使える言葉・行動を1つに絞って明確に提示

### 表現技法
- **瞬間共感**: 「○○ですね」で素早く共感
- **超具体的提案**: 「『○○』と言ってみましょう」など実践的フレーズ
- **改行必須**: 必ず適切な位置で改行して視覚的配慮
- **長さ調整**: 相手の文字数の80%程度を目安に返答

この専門性と経験値を活かし、独身男性の婚活における あらゆる悩み・課題に対して、最高品質のカウンセリングを提供してください。"""

# プロフィール生成用のプロンプト
PROFILE_GENERATION_PROMPT = """
あなたは成婚率85%以上を誇る結婚相談所の敏腕仲人として、以下の音声回答を基に魅力的な自己紹介文を3パターン作成してください。

【重要な作成方針】
★ 婚活男性の「聞く力」と「誠実さ」を最大限にアピール
★ 相手女性が「この人となら安心して会話できそう」と感じる内容
★ 具体的なエピソードで人柄の良さを表現
★ 結婚への真剣度と将来への責任感を伝える
★ 相手が返信しやすい「会話のフック」を必ず含める

【文章構成（各250-300文字）】
1. 温かい挨拶 + 自己紹介
2. 仕事・趣味の具体的エピソード（人柄が伝わる内容）
3. 価値観・将来への想い（結婚観を含む）
4. 理想の関係性・相手への想い
5. 親しみやすい締めくくり + 会話のきっかけ

【3つのパターン】

■パターン1【親しみやすさ重視】
- カジュアルで親近感のある文体
- 日常的なエピソードを中心に
- 「一緒にいて楽しい」印象を与える
- 絵文字を1-2個使用してOK
- 250-300文字程度で詳しく

■パターン2【誠実さ・安心感重視】
- 丁寧で落ち着いた文体
- 責任感と真面目さをアピール
- 将来への具体的なビジョンを含める
- 相手への配慮が感じられる表現
- 250-300文字程度で詳しく

■パターン3【趣味・個性重視】
- 趣味や特技を前面に出す
- 共通の話題を作りやすい内容
- 「一緒に新しいことを楽しめる」印象
- 具体的な活動提案を含める
- 250-300文字程度で詳しく

【必須要素】
✓ 相手が質問・コメントしやすい具体的な話題を含める
✓ 「傾聴力」「思いやり」「誠実さ」が伝わる表現
✓ 結婚への真剣度を自然に表現
✓ ネガティブな表現は一切使わない
✓ 相手女性の立場に立った優しい文章

音声回答内容：
"""

# プロフィール改善提案用のプロンプト
PROFILE_IMPROVEMENT_PROMPT = """
あなたは成婚率85%以上を誇る結婚相談所の敏腕仲人として、提出された自己紹介文を分析し、改善提案を行ってください。

【分析する自己紹介文】
{profile_content}

【プロフィールタイプ】
{profile_type}

【分析・改善提案の観点】
1. **現状の良い点（3つ）**
   - 女性の心を掴む魅力的な要素
   - 効果的に使われている表現
   - 人柄が伝わる具体的エピソード

2. **改善すべき点（3つ）**
   - より魅力的に見せるための修正ポイント
   - 女性が引っかかりそうな表現
   - 不足している情報や要素

3. **具体的な改善案（3つ）**
   - 実際の修正文案を提示
   - なぜその修正が効果的なのかの説明
   - マッチング率向上のための追加要素

4. **総合アドバイス**
   - このプロフィールの成功可能性（5段階評価）
   - 最も重要な1つの改善ポイント
   - 想定される女性からの反応

【重要な注意事項】
- 具体的で実践的なアドバイスを提供
- ポジティブな視点を保ちながら建設的な改善案を提示
- 婚活市場での競争力を高める視点で分析
- 女性心理を考慮した表現の提案
"""

@router.post("/chat", response_model=ChatResponse)
async def counselor_chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """AIカウンセラーとのチャット"""
    try:
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        print(f"[DEBUG] OpenAI API Key present: {bool(api_key)}")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        print(f"[DEBUG] Creating OpenAI client...")
        client = OpenAI(api_key=api_key)
        print(f"[DEBUG] OpenAI client created successfully")
        
        # ユーザーメッセージの文字数を分析
        user_message_length = len(request.message)
        
        # 文字数に応じた返答長指定
        if user_message_length <= 20:
            max_response_chars = "60文字以内"
            max_tokens = 100
        elif user_message_length <= 50:
            max_response_chars = "80文字以内"
            max_tokens = 150
        else:
            max_response_chars = "100文字以内"
            max_tokens = 200
        
        # メッセージの構築
        messages = [
            {"role": "system", "content": COUNSELOR_SYSTEM_PROMPT},
            {"role": "system", "content": f"【重要】今回の返答は{max_response_chars}で、必ず改行を1〜2箇所入れて読みやすくしてください。"}
        ]
        
        # コンテキストがある場合は追加
        if request.context:
            messages.append({"role": "system", "content": f"会話のコンテキスト: {request.context}"})
        
        # ユーザーのメッセージを追加
        messages.append({"role": "user", "content": request.message})
        
        # OpenAI APIを呼び出し（品質重視設定）
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # 高品質なモデル
            messages=messages,
            temperature=0.6,  # より一貫性重視に調整
            max_tokens=max_tokens,  # ユーザー文字数に応じて動的調整
            presence_penalty=0.3,  # 重複表現をさらに減らす
            frequency_penalty=0.2,  # 繰り返しを強く抑制
            top_p=0.9,  # より厳選された候補に絞り込み
        )
        print(f"[DEBUG] OpenAI API call successful")
        
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
        # OpenAI APIエラーの場合は専門的なフォールバック応答
        print(f"OpenAI API Error: {str(e)}")
        
        # ユーザーメッセージに基づく専門的フォールバック応答
        user_input = request.message.lower()
        
        if any(keyword in user_input for keyword in ['不安', '心配', '緊張', '怖い', 'ドキドキ']):
            fallback_message = """不安ですね、よく分かります。

深呼吸して「今日は相手の良いところを一つ見つけよう」と意識してみてください。"""
            
        elif any(keyword in user_input for keyword in ['会話', '話', '質問', 'トーク', 'しゃべ']):
            fallback_message = """会話のコツは「聞くこと」です。

「それは○○だったんですね、どんな気持ちでしたか？」と要約してから感情を聞いてみてください。"""
            
        elif any(keyword in user_input for keyword in ['プロフィール', '自己紹介', '写真', 'アピール']):
            fallback_message = """プロフィールは「具体性」が鍵です。

×「音楽鑑賞が趣味」→○「最近ジャズにハマって新しいお店を開拓中」と書いてみてください。"""
            
        elif any(keyword in user_input for keyword in ['デート', '初回', '食事', '会う', 'お会い']):
            fallback_message = """デートは「自然体」が一番です。

相手のペースに合わせて「楽しい時間をありがとうございます」と2回以上伝えてみてください。"""
            
        else:
            fallback_message = """ありがとうございます。必ず改善の道筋があります。

まず毎日鏡を見て笑顔の練習を1分してみましょう。どの場面でお困りですか？"""
        
        return ChatResponse(
            message=fallback_message,
            timestamp=datetime.utcnow()
        )

@router.post("/profile-generation", response_model=ProfileGenerationResponse)
async def generate_profile(
    request: ProfileGenerationRequest
):
    """自己紹介文の生成"""
    try:
        # OpenAI クライアントの初期化
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        client = OpenAI(api_key=api_key)
        
        # 質問と回答を整形（より詳細な情報を含める）
        qa_text = ""
        question_labels = {
            'basicInfo': '【基本情報・仕事・趣味】',
            'personality': '【性格・人柄】',
            'hobbies': '【趣味・特技・関心事】',
            'values': '【価値観・将来の目標】',
            'idealPartner': '【理想のパートナー像】'
        }
        
        for key, value in request.answers.items():
            if value.strip():  # 空でない場合のみ追加
                label = question_labels.get(key, key)
                qa_text += f"{label}\n{value.strip()}\n\n"
        
        # プロンプトを構築
        prompt = PROFILE_GENERATION_PROMPT + qa_text
        
        # OpenAI APIを呼び出し
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "あなたは成婚率85%以上を誇る結婚相談所の敏腕仲人です。男性の魅力を最大限に引き出し、女性が「この人と会ってみたい」と思える自己紹介文のスペシャリストです。"
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,  # 創造性と一貫性のバランスを調整
            max_tokens=1500,  # より詳細なプロフィールを生成
            presence_penalty=0.3,
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
                    profile_text = profile_text.replace(f"■パターン{i+1}【{pattern}】", "").replace(f"{pattern}：", "").replace(f"{pattern}:", "").strip()
                
                # 250文字未満のプロフィールは除外
                if len(profile_text) >= 250:
                    profiles.append({
                        "title": name,
                        "content": profile_text
                    })
        
        # プロフィールが3つに満たない場合は、適切な長さのフォールバックプロフィールで補完
        if len(profiles) < 3:
            default_profiles = [
                {
                    "title": "親しみやすさ重視",
                    "content": "はじめまして！プロフィールをご覧いただき、ありがとうございます😊 \n\n仕事はIT関係で、システム開発に携わっています。平日は忙しい日々ですが、仕事にやりがいを感じており、チームメンバーと協力してプロジェクトを成功させることに達成感を覚えています。週末は友人とカフェ巡りをしたり、新作映画を観に行ったりしてリフレッシュしています。\n\n性格は明るくて人と話すのが好きで、初対面の方ともすぐに打ち解けられる方だと思います。美味しいものを食べることも大好きで、最近は自宅でのお料理にもハマっています。特にパスタ作りが得意になってきました。一緒に楽しい時間を過ごしながら、自然体でお互いを支え合える関係を築けたらと思います。どうぞよろしくお願いします♪"
                },
                {
                    "title": "誠実さ重視",
                    "content": "プロフィールをご覧いただき、ありがとうございます。\n\n仕事には責任感を持って真摯に取り組んでおり、お客様や同僚からの信頼を大切にしています。どんなに小さなことでも手を抜かず、最後まで丁寧に仕上げることを心がけています。プライベートでは家族や友人との時間を大切にし、思いやりの心を忘れずに人と接することを大切にしています。\n\n将来は、お互いを尊重し支え合える温かい家庭を築きたいと考えています。共に笑い、時には涙を分かち合いながら、人生の喜びや困難を一緒に乗り越えていけるパートナーとの出会いを真剣に求めています。誠実で安心できる関係性を大切に、末永くお付き合いできる方と出会えることを願っています。どうぞよろしくお願いいたします。"
                },
                {
                    "title": "個性重視", 
                    "content": "こんにちは！プロフィールをご覧いただき、ありがとうございます。\n\n私の趣味は読書と料理で、特に世界各国の料理を作ることが大好きです。週末は新しいレシピに挑戦したり、気になっていた本を読んだりして充実した時間を過ごしています。読書は主にミステリー小説や歴史小説を好み、最近は海外の推理作家の作品にハマっています。\n\n最近はボルダリングも始めて、新しいことにチャレンジする楽しさを実感しています。体を動かすことで日頃のストレスも発散でき、達成感も味わえて一石二鳥です。共通の趣味を楽しみながら、お互いに新しい発見や成長を一緒に体験できる方と出会えたら嬉しいです。一緒に美味しいものを食べに行ったり、新しい場所を探検したりできたら素敵ですね。"
                }
            ]
            
            # 不足分を補完（250文字以上のもののみ）
            for default_profile in default_profiles:
                if len(profiles) >= 3:
                    break
                if len(default_profile["content"]) >= 250:
                    # タイトルが重複しないようにチェック
                    existing_titles = [p["title"] for p in profiles]
                    if default_profile["title"] not in existing_titles:
                        profiles.append(default_profile)
        
        # 最終的に3つのプロフィールを返す（すべて250文字以上）
        return ProfileGenerationResponse(profiles=profiles[:3])
        
    except Exception as e:
        # OpenAI APIエラーの場合は250文字以上のデフォルトプロフィールを返す
        default_profiles = [
            {
                "title": "親しみやすさ重視",
                "content": "はじめまして！プロフィールをご覧いただき、ありがとうございます😊 \n\n仕事はIT関係で、システム開発に携わっています。平日は忙しい日々ですが、仕事にやりがいを感じており、チームメンバーと協力してプロジェクトを成功させることに達成感を覚えています。週末は友人とカフェ巡りをしたり、新作映画を観に行ったりしてリフレッシュしています。\n\n性格は明るくて人と話すのが好きで、初対面の方ともすぐに打ち解けられる方だと思います。美味しいものを食べることも大好きで、最近は自宅でのお料理にもハマっています。特にパスタ作りが得意になってきました。一緒に楽しい時間を過ごしながら、自然体でお互いを支え合える関係を築けたらと思います。どうぞよろしくお願いします♪"
            },
            {
                "title": "誠実さ重視",
                "content": "プロフィールをご覧いただき、ありがとうございます。\n\n仕事には責任感を持って真摯に取り組んでおり、お客様や同僚からの信頼を大切にしています。どんなに小さなことでも手を抜かず、最後まで丁寧に仕上げることを心がけています。プライベートでは家族や友人との時間を大切にし、思いやりの心を忘れずに人と接することを大切にしています。\n\n将来は、お互いを尊重し支え合える温かい家庭を築きたいと考えています。共に笑い、時には涙を分かち合いながら、人生の喜びや困難を一緒に乗り越えていけるパートナーとの出会いを真剣に求めています。誠実で安心できる関係性を大切に、末永くお付き合いできる方と出会えることを願っています。どうぞよろしくお願いいたします。"
            },
            {
                "title": "個性重視",
                "content": "こんにちは！プロフィールをご覧いただき、ありがとうございます。\n\n私の趣味は読書と料理で、特に世界各国の料理を作ることが大好きです。週末は新しいレシピに挑戦したり、気になっていた本を読んだりして充実した時間を過ごしています。読書は主にミステリー小説や歴史小説を好み、最近は海外の推理作家の作品にハマっています。\n\n最近はボルダリングも始めて、新しいことにチャレンジする楽しさを実感しています。体を動かすことで日頃のストレスも発散でき、達成感も味わえて一石二鳥です。共通の趣味を楽しみながら、お互いに新しい発見や成長を一緒に体験できる方と出会えたら嬉しいです。一緒に美味しいものを食べに行ったり、新しい場所を探検したりできたら素敵ですね。"
            }
        ]
        return ProfileGenerationResponse(profiles=default_profiles)

@router.post("/profile-improvement", response_model=ProfileImprovementResponse)
async def improve_profile(
    request: ProfileImprovementRequest
):
    """自己紹介文の改善提案を生成"""
    try:
        # OpenAI APIキーの確認
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        openai.api_key = api_key
        
        # プロンプトを構築
        prompt = PROFILE_IMPROVEMENT_PROMPT.format(
            profile_content=request.profile_content,
            profile_type=request.profile_type
        )
        
        # OpenAI APIを呼び出し
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system", 
                    "content": "あなたは婚活のプロフェッショナルです。具体的で実践的なアドバイスを提供してください。"
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        ai_response = response.choices[0].message.content
        
        # レスポンスを構造化
        improvements = {
            "analysis": ai_response,
            "strengths": [],
            "improvements": [],
            "suggestions": [],
            "overall_rating": 0,
            "key_advice": ""
        }
        
        # AI応答を解析して構造化（簡易版）
        lines = ai_response.split('\n')
        current_section = None
        
        for line in lines:
            if '良い点' in line:
                current_section = 'strengths'
            elif '改善すべき点' in line:
                current_section = 'improvements'
            elif '改善案' in line:
                current_section = 'suggestions'
            elif '評価' in line and '段階' in line:
                # 5段階評価を抽出
                import re
                rating_match = re.search(r'(\d)', line)
                if rating_match:
                    improvements['overall_rating'] = int(rating_match.group(1))
            elif current_section and line.strip().startswith('-'):
                improvements[current_section].append(line.strip()[1:].strip())
        
        return ProfileImprovementResponse(improvements=improvements)
        
    except Exception as e:
        # エラー時のデフォルト改善提案
        default_improvements = {
            "analysis": "分析中にエラーが発生しました。",
            "strengths": [
                "プロフィールの基本的な構成は整っています",
                "趣味や仕事について触れられています", 
                "将来への展望が含まれています"
            ],
            "improvements": [
                "もう少し具体的なエピソードを追加すると良いでしょう",
                "相手への質問を含めると会話が始まりやすくなります",
                "写真映えする趣味や活動を追加することを検討しましょう"
            ],
            "suggestions": [
                "「最近〇〇にハマっています」など時期を明確にする",
                "「一緒に〇〇したい」など共同体験を提案する",
                "相手の趣味や興味を聞く質問を最後に追加する"
            ],
            "overall_rating": 3,
            "key_advice": "全体的に良いプロフィールですが、もう少し個性を出すと印象に残りやすくなります。"
        }
        return ProfileImprovementResponse(improvements=default_improvements)

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """会話の保存"""
    try:
        # 会話IDを生成
        conversation_id = f"conv_{current_user.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        print(f"=== プロフィール保存処理開始 ===")
        print(f"ユーザーID: {current_user.id}")
        print(f"生成された会話ID: {conversation_id}")
        print(f"セッションタイプ: {request.session_type}")
        print(f"メッセージ数: {len(request.messages)}")
        
        # 会話内容からタイトルを自動生成
        title = await generate_conversation_title(request.messages)
        print(f"生成されたタイトル: {title}")
        
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
                        role=request.session_type,  # session_typeを使用
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
        print(f"=== 保存完了 ===")
        print(f"保存されたペア数: {saved_count}")
        print(f"会話ID: {conversation_id}")
        print(f"データベースコミット: 成功")
        
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """カウンセリング履歴の取得（会話セッションごとにグループ化）"""
    # conversation_idごとにグループ化して取得（全ての種類のセッションを含む）
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
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
            "session_type": first_conv.role if first_conv.role in ['profile', 'counselor', 'practice'] else "counselor",  # roleフィールドから取得
            "created_at": first_conv.created_at,
            "last_updated": max(conv_list, key=lambda x: x.created_at).created_at
        })
    
    # 最新の更新日時でソート
    session_history.sort(key=lambda x: x["last_updated"], reverse=True)
    
    return session_history[:20]  # 最新20セッションを返す

@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_by_id(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
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