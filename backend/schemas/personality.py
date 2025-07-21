from pydantic import BaseModel
from typing import Dict, List, Optional
from enum import Enum


class PersonalityDimensionEnum(str, Enum):
    """性格診断の軸"""
    EXTROVERSION = "外向性"
    COMMUNICATION = "コミュニケーション"
    EMOTIONAL_STABILITY = "感情安定性"
    DECISION_MAKING = "意思決定"
    EMPATHY = "共感性"
    COMMITMENT = "コミット力"


class PersonalityTypeEnum(str, Enum):
    """性格タイプ分類（婚活特化版）"""
    COMMUNICATOR = "コミュニケーター"
    SUPPORTER = "サポーター"
    LEADER = "リーダー"
    ANALYST = "アナリスト"
    CREATIVE = "クリエイター"
    RELIABLE = "信頼できるパートナー"


class QuestionOption(BaseModel):
    """質問の選択肢"""
    text: str
    score: int


class Question(BaseModel):
    """診断質問"""
    id: int
    question: str
    dimension: PersonalityDimensionEnum
    options: List[QuestionOption]


class PersonalityTestAnswers(BaseModel):
    """性格診断の回答データ"""
    answers: Dict[int, int]  # {question_id: selected_option_index}
    
    class Config:
        json_schema_extra = {
            "example": {
                "answers": {
                    1: 2,
                    2: 1,
                    3: 3,
                    4: 0,
                    5: 2
                }
            }
        }


class PersonalityScore(BaseModel):
    """性格軸別スコア"""
    外向性: float
    コミュニケーション: float
    感情安定性: float
    意思決定: float
    共感性: float
    コミット力: float


class PersonalityDescription(BaseModel):
    """性格タイプの詳細説明"""
    title: str
    summary: str
    strengths: str
    marriage_advice: str
    growth_points: str


class PersonalityTestResult(BaseModel):
    """性格診断結果"""
    personality_type: PersonalityTypeEnum
    scores: PersonalityScore
    description: PersonalityDescription
    compatible_types: List[PersonalityTypeEnum]
    
    class Config:
        json_schema_extra = {
            "example": {
                "personality_type": "コミュニケーター",
                "scores": {
                    "外向性": 75.5,
                    "コミュニケーション": 82.1,
                    "感情安定性": 68.3,
                    "意思決定": 71.2,
                    "共感性": 78.9,
                    "コミット力": 73.4
                },
                "description": {
                    "title": "コミュニケーター",
                    "summary": "あなたは自然な会話力と協調性を持つ、魅力的なパートナーです。",
                    "strengths": "・相手の話をよく聞き、共感する能力が高い\n・明るく前向きな性格で、周囲を楽しませる",
                    "marriage_advice": "パートナーとの対話を大切にし、お互いの気持ちを理解し合うことで、深い絆を築けるでしょう。",
                    "growth_points": "時には自分の意見もしっかりと伝え、相手との健全な議論も大切にしましょう。"
                },
                "compatible_types": ["サポーター", "アナリスト", "信頼できるパートナー"]
            }
        }


class QuestionsResponse(BaseModel):
    """質問一覧レスポンス"""
    questions: List[Question]
    total_questions: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "questions": [
                    {
                        "id": 1,
                        "question": "初対面の人との会話で、あなたはどう感じますか？",
                        "dimension": "外向性",
                        "options": [
                            {"text": "楽しくて自然に話せる", "score": 4},
                            {"text": "少し緊張するが、話すのは好き", "score": 3},
                            {"text": "緊張するが、相手に合わせて話す", "score": 2},
                            {"text": "とても緊張して話すのが難しい", "score": 1}
                        ]
                    }
                ],
                "total_questions": 10
            }
        }


class ErrorResponse(BaseModel):
    """エラーレスポンス"""
    error: str
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "INVALID_ANSWERS",
                "message": "回答データが不正です。全ての質問に回答してください。"
            }
        }