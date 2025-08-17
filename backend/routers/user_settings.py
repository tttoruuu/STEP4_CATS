from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import logging

from database import get_db
from models.user import User
from auth.jwt import get_current_user

router = APIRouter(prefix="/api/user", tags=["user_settings"])

logger = logging.getLogger(__name__)

@router.put("/video-preferences")
async def update_video_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """サービス説明動画の表示設定を更新"""
    try:
        show_video = preferences.get("show_service_video", True)
        
        # ユーザーの設定を更新
        current_user.show_service_video = show_video
        db.commit()
        
        return {
            "success": True,
            "message": "動画表示設定を更新しました",
            "show_service_video": current_user.show_service_video
        }
        
    except Exception as e:
        logger.error(f"動画表示設定の更新エラー: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="設定の更新に失敗しました"
        )

@router.get("/video-preferences")
async def get_video_preferences(
    current_user: User = Depends(get_current_user)
):
    """現在の動画表示設定を取得"""
    return {
        "show_service_video": current_user.show_service_video,
        "first_login_at": current_user.first_login_at.isoformat() if current_user.first_login_at else None
    }