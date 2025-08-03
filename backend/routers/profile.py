from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List
import json

from database import get_db
from models.user import User
from models.conversation import Conversation
from auth.jwt import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

def calculate_age(birth_date):
    """生年月日から現在の年齢を計算"""
    today = datetime.now().date()
    age = today.year - birth_date.year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    return age

def get_mbti_result(db: Session, user_id: int):
    """最新のMBTI診断結果を取得"""
    try:
        # Marriage MBTI結果を取得（最新のもの）
        mbti_conversation = db.query(Conversation).filter(
            Conversation.user_id == user_id,
            Conversation.session_type == 'marriage_mbti'
        ).order_by(Conversation.created_at.desc()).first()
        
        if mbti_conversation and mbti_conversation.response:
            try:
                # AI応答からMBTI情報を解析
                response_data = json.loads(mbti_conversation.response)
                return {
                    "mbti_type": response_data.get("mbti_type"),
                    "type_name": response_data.get("type_name"),
                    "description": response_data.get("description")
                }
            except (json.JSONDecodeError, KeyError):
                # JSONパース失敗時は応答テキストから推定
                response_text = mbti_conversation.response
                return {
                    "mbti_type": extract_mbti_from_text(response_text),
                    "type_name": "診断済み",
                    "description": response_text[:100] + "..." if len(response_text) > 100 else response_text
                }
        
        return None
    except Exception as e:
        print(f"MBTI結果取得エラー: {e}")
        return None

def extract_mbti_from_text(text: str) -> Optional[str]:
    """テキストからMBTIタイプを抽出"""
    import re
    # MBTI形式のパターンを検索（例：INFP-T, ENFJ, etc.）
    mbti_pattern = r'\b([IE][NS][FT][JP])(-[AT])?\b'
    match = re.search(mbti_pattern, text, re.IGNORECASE)
    if match:
        return match.group(0).upper()
    return None

def parse_hobbies(hobbies_text: str) -> List[str]:
    """趣味テキストを配列に変換"""
    if not hobbies_text:
        return []
    
    # カンマ、句読点、スペースで分割
    import re
    hobbies = re.split(r'[,、\s]+', hobbies_text.strip())
    return [hobby.strip() for hobby in hobbies if hobby.strip()]

@router.get("/test")
async def test_profile_endpoint():
    """テスト用エンドポイント（認証なし）"""
    return {
        "success": True,
        "message": "Profile router is working!",
        "timestamp": "2025-08-02T00:00:00"
    }

@router.get("/comprehensive")
async def get_comprehensive_profile(
    db: Session = Depends(get_db)
):
    """統合プロフィール情報を取得（開発・テスト用：認証なし）"""
    try:
        # 常にダミーデータを返す（テスト用）
        return {
            "success": True,
            "profile": {
                "user_id": 1,
                "name": "田中 太郎",
                "age": 32,
                "birth_date": "1991年8月15日",
                "konkatsu_experience": "初心者",
                "occupation": "ITエンジニア",
                "birthplace": "大阪府",
                "residence": "東京都渋谷区",
                "hobbies": ["読書", "ジョギング", "カフェ巡り", "映画鑑賞"],
                "weekend_activities": "友人と食事をしたり、新しいカフェを探索したりしています。たまに一人旅も楽しんでいます。",
                "mbti": {
                    "mbti_type": "INFP-T",
                    "type_name": "仲介者",
                    "description": "内向的で創造性豊かな性格タイプです。"
                },
                "profile_image_url": None,
                "email": "tanaka@example.com",
                "created_at": "2025-08-02T00:00:00",
                "updated_at": "2025-08-02T00:00:00"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"プロフィール取得エラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="プロフィール情報の取得に失敗しました"
        )

@router.get("/mbti-history")
async def get_mbti_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """MBTI診断履歴を取得"""
    try:
        mbti_conversations = db.query(Conversation).filter(
            Conversation.user_id == current_user.id,
            Conversation.session_type == 'marriage_mbti'
        ).order_by(Conversation.created_at.desc()).limit(10).all()
        
        history = []
        for conv in mbti_conversations:
            try:
                response_data = json.loads(conv.response) if conv.response else {}
                history.append({
                    "id": conv.id,
                    "mbti_type": response_data.get("mbti_type"),
                    "type_name": response_data.get("type_name"),
                    "created_at": conv.created_at,
                    "conversation_title": conv.conversation_title
                })
            except json.JSONDecodeError:
                # JSON以外の場合はテキストから抽出
                history.append({
                    "id": conv.id,
                    "mbti_type": extract_mbti_from_text(conv.response or ""),
                    "type_name": "診断済み",
                    "created_at": conv.created_at,
                    "conversation_title": conv.conversation_title
                })
        
        return {
            "success": True,
            "history": history
        }
        
    except Exception as e:
        print(f"MBTI履歴取得エラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="MBTI診断履歴の取得に失敗しました"
        )