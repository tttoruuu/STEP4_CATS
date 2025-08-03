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

@router.get("/comprehensive-debug")
async def get_comprehensive_profile_debug(db: Session = Depends(get_db)):
    """デバッグ用統合プロフィール（認証なし、サンプルデータ）"""
    return {
        "success": True,
        "profile": {
            "user_id": 1,
            "name": "テストユーザー",
            "age": 30,
            "birth_date": "1994年1月1日",
            "konkatsu_experience": "初心者",
            "occupation": "エンジニア",
            "birthplace": "東京都",
            "residence": "神奈川県",
            "hobbies": ["読書", "映画鑑賞", "ゲーム"],
            "weekend_activities": "カフェでコーヒーを飲みながら読書をするのが好きです",
            "mbti": {
                "mbti_type": "INFP-T",
                "type_name": "仲介者",
                "description": "理想主義的で、常に善を行う方法を探している"
            },
            "profile_image_url": None,
            "email": "test@example.com",
            "created_at": "2025-01-01T00:00:00",
            "updated_at": "2025-01-02T00:00:00"
        }
    }

@router.get("/comprehensive")
async def get_comprehensive_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """統合プロフィール情報を取得"""
    try:
        # ユーザー情報を取得
        user = current_user
        
        # 年齢計算
        age = None
        birth_date_formatted = None
        if user.birth_date:
            age = calculate_age(user.birth_date)
            birth_date_formatted = user.birth_date.strftime("%Y年%m月%d日")
        
        # 趣味を配列に変換
        hobbies_array = parse_hobbies(user.hobbies or "")
        
        # 婚活経験の日本語変換
        konkatsu_experience_map = {
            "beginner": "初心者",
            "experienced": "経験あり", 
            "returning": "再チャレンジ"
        }
        konkatsu_experience = konkatsu_experience_map.get(user.konkatsu_status, user.konkatsu_status or "未設定")
        
        # MBTI情報を取得
        mbti_result = get_mbti_result(db, user.id)
        
        return {
            "success": True,
            "profile": {
                "user_id": user.id,
                "name": user.full_name or "未設定",
                "age": age,
                "birth_date": birth_date_formatted or "未設定",
                "konkatsu_experience": konkatsu_experience,
                "occupation": user.occupation or "未設定",
                "birthplace": user.birthplace or "未設定",
                "residence": user.current_location or "未設定",
                "hobbies": hobbies_array if hobbies_array else ["未設定"],
                "weekend_activities": user.holiday_style or "未設定",
                "mbti": mbti_result,  # None if not taken
                "profile_image_url": user.profile_image_url,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
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

@router.put("/update")
async def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """プロフィール情報を更新"""
    try:
        user = current_user
        
        # 更新可能なフィールドのみ処理
        if "full_name" in profile_data:
            user.full_name = profile_data["full_name"]
        if "birth_date" in profile_data and profile_data["birth_date"]:
            try:
                user.birth_date = datetime.strptime(profile_data["birth_date"], "%Y-%m-%d").date()
            except ValueError:
                pass  # 無効な日付は無視
        if "konkatsu_status" in profile_data:
            user.konkatsu_status = profile_data["konkatsu_status"]
        if "occupation" in profile_data:
            user.occupation = profile_data["occupation"]
        if "birthplace" in profile_data:
            user.birthplace = profile_data["birthplace"]
        if "current_location" in profile_data:
            user.current_location = profile_data["current_location"]
        if "hobbies" in profile_data:
            # 配列の場合は文字列に変換
            if isinstance(profile_data["hobbies"], list):
                user.hobbies = ", ".join(profile_data["hobbies"])
            else:
                user.hobbies = profile_data["hobbies"]
        if "holiday_style" in profile_data:
            user.holiday_style = profile_data["holiday_style"]
        
        # 更新日時を現在時刻に設定
        user.updated_at = datetime.now()
        
        db.commit()
        
        return {
            "success": True,
            "message": "プロフィールが更新されました"
        }
        
    except Exception as e:
        print(f"プロフィール更新エラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="プロフィールの更新に失敗しました"
        )