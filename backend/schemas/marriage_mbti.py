from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from enum import Enum


class MBTIDimension(str, Enum):
    """MBTI 4軸"""
    EI = "EI"  # Extroversion vs Introversion
    SN = "SN"  # Sensing vs iNtuition
    TF = "TF"  # Thinking vs Feeling
    JP = "JP"  # Judging vs Perceiving


class MBTIType(str, Enum):
    """MBTI 16タイプ"""
    INTJ = "INTJ"
    INTP = "INTP"
    ENTJ = "ENTJ"
    ENTP = "ENTP"
    INFJ = "INFJ"
    INFP = "INFP"
    ENFJ = "ENFJ"
    ENFP = "ENFP"
    ISTJ = "ISTJ"
    ISFJ = "ISFJ"
    ESTJ = "ESTJ"
    ESFJ = "ESFJ"
    ISTP = "ISTP"
    ISFP = "ISFP"
    ESTP = "ESTP"
    ESFP = "ESFP"


class MarriageCategory(str, Enum):
    """結婚観カテゴリ"""
    COMMUNICATION = "communication"
    LIFESTYLE = "lifestyle"
    VALUES = "values"
    FUTURE = "future"
    INTIMACY = "intimacy"


class MBTIQuestionOption(BaseModel):
    """MBTI質問の選択肢"""
    text: str
    direction: str  # 'A' or 'B'


class MBTIQuestion(BaseModel):
    """MBTI質問"""
    id: int
    question: str
    optionA: str
    optionB: str
    dimension: MBTIDimension
    direction: str  # Which option corresponds to the first letter ('A' or 'B')


class MarriageQuestion(BaseModel):
    """結婚観質問"""
    id: int
    question: str
    options: List[str]  # 5段階評価の選択肢
    category: MarriageCategory


class MBTIAnswer(BaseModel):
    """MBTI回答"""
    questionId: int
    answer: str  # 'A' or 'B'


class MarriageAnswer(BaseModel):
    """結婚観回答"""
    questionId: int
    answer: int  # 1-5 scale


class MarriageMBTIAnswers(BaseModel):
    """統合診断の回答データ"""
    mbtiAnswers: List[MBTIAnswer]
    marriageAnswers: List[MarriageAnswer]
    
    class Config:
        json_schema_extra = {
            "example": {
                "mbtiAnswers": [
                    {"questionId": 0, "answer": "A"},
                    {"questionId": 1, "answer": "B"}
                ],
                "marriageAnswers": [
                    {"questionId": 0, "answer": 3},
                    {"questionId": 1, "answer": 4}
                ]
            }
        }


class MBTIScore(BaseModel):
    """MBTI軸別スコア"""
    E: int  # Extroversion
    I: int  # Introversion  
    S: int  # Sensing
    N: int  # iNtuition
    T: int  # Thinking
    F: int  # Feeling
    J: int  # Judging
    P: int  # Perceiving


class MarriageScore(BaseModel):
    """結婚観カテゴリ別スコア"""
    communication: float
    lifestyle: float
    values: float
    future: float
    intimacy: float


class CompatibleType(BaseModel):
    """相性の良いタイプ"""
    type: str
    reason: str


class PersonalizedAdvice(BaseModel):
    """パーソナライズアドバイス"""
    category: str
    content: str


class MarriageMBTIResult(BaseModel):
    """Marriage MBTI+ 診断結果"""
    mbtiType: MBTIType
    typeName: str
    description: str
    loveCharacteristics: List[str]
    compatibleTypes: List[CompatibleType]
    advice: List[PersonalizedAdvice]
    mbtiScores: MBTIScore
    marriageScores: MarriageScore
    
    class Config:
        json_schema_extra = {
            "example": {
                "mbtiType": "ENFJ",
                "typeName": "主人公タイプ",
                "description": "人の成長を支援し、調和の取れた関係を築くカリスマ的リーダー",
                "loveCharacteristics": [
                    "パートナーの成長をサポート",
                    "調和とコミュニケーションを重視",
                    "感情的な絆を大切にする",
                    "関係に情熱と献身を注ぐ"
                ],
                "compatibleTypes": [
                    {
                        "type": "INFP (仲裁者)",
                        "reason": "価値観と感情面での深いつながり"
                    }
                ],
                "advice": [
                    {
                        "category": "コミュニケーション",
                        "content": "感情的な理解を重視するあなたは、時には論理的な話し合いも取り入れることで、より建設的な関係を築けます。"
                    }
                ],
                "mbtiScores": {
                    "E": 7, "I": 3, "S": 4, "N": 6, 
                    "T": 3, "F": 7, "J": 6, "P": 4
                },
                "marriageScores": {
                    "communication": 4.2,
                    "lifestyle": 3.8,
                    "values": 4.5,
                    "future": 3.9,
                    "intimacy": 4.1
                }
            }
        }


class QuestionsResponse(BaseModel):
    """質問一覧レスポンス"""
    mbtiQuestions: List[MBTIQuestion]
    marriageQuestions: List[MarriageQuestion]
    totalMBTIQuestions: int
    totalMarriageQuestions: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "mbtiQuestions": [
                    {
                        "id": 1,
                        "question": "新しい環境で人と出会う時、あなたはどのような傾向がありますか？",
                        "optionA": "積極的に話しかけて、多くの人とのつながりを作る",
                        "optionB": "まず様子を見て、少数の人と深く話すことを好む",
                        "dimension": "EI",
                        "direction": "A"
                    }
                ],
                "marriageQuestions": [
                    {
                        "id": 1,
                        "question": "パートナーとのコミュニケーションで最も重視することは？",
                        "options": [
                            "論理的で明確な話し合い",
                            "どちらかといえば論理的",
                            "バランスの取れた対話",
                            "どちらかといえば感情的",
                            "感情的な理解と共感"
                        ],
                        "category": "communication"
                    }
                ],
                "totalMBTIQuestions": 16,
                "totalMarriageQuestions": 10
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