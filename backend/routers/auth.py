from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import Optional
import logging

from database import get_db
from models.user import User
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# セキュリティスキーム
security = HTTPBearer()

# ロガー設定
logger = logging.getLogger(__name__)

@router.post("/register")
async def register_user(
    user_data: dict,
    db: Session = Depends(get_db)
):
    """ユーザー登録"""
    try:
        # ユーザーの重複チェック
        existing_user = db.query(User).filter(
            User.email == user_data.get("email")
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このメールアドレスは既に登録されています"
            )
        
        # パスワードハッシュ化
        hashed_password = get_password_hash(user_data.get("password"))
        
        # 新規ユーザー作成
        new_user = User(
            username=user_data.get("email"),  # emailをusernameとして使用
            email=user_data.get("email"),
            password_hash=hashed_password,
            full_name=user_data.get("name", user_data.get("full_name", "")),
            birth_date=datetime.strptime(user_data.get("birth_date"), "%Y-%m-%d").date() if user_data.get("birth_date") else None,
            hometown=user_data.get("birth_place", ""),
            hobbies=user_data.get("hobbies", ""),
            konkatsu_status=user_data.get("konkatsu_status", ""),
            occupation=user_data.get("occupation", ""),
            birth_place=user_data.get("birth_place", ""),
            location=user_data.get("location", ""),
            weekend_activity=user_data.get("weekend_activity", "")
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # アクセストークン生成
        access_token = create_access_token(data={"sub": new_user.email})
        
        return {
            "success": True,
            "message": "ユーザー登録が完了しました",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "full_name": new_user.full_name,
                "username": new_user.username
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ユーザー登録エラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ユーザー登録に失敗しました"
        )

@router.post("/login")
async def login_user(
    login_data: dict,
    db: Session = Depends(get_db)
):
    """ユーザーログイン"""
    try:
        email = login_data.get("email")
        password = login_data.get("password")
        
        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="メールアドレスとパスワードが必要です"
            )
        
        # ユーザー検索
        user = db.query(User).filter(User.email == email).first()
        
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="メールアドレスまたはパスワードが正しくありません"
            )
        
        # アクセストークン生成
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "success": True,
            "message": "ログインに成功しました",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "username": user.username
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ログインエラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ログインに失敗しました"
        )

@router.post("/test-db")
async def test_database_connection(db: Session = Depends(get_db)):
    """データベース接続とSSL状態をテスト"""
    try:
        # SSL状態を確認
        ssl_result = db.execute(text("SHOW SESSION STATUS LIKE 'Ssl_cipher'")).fetchone()
        ssl_version = db.execute(text("SHOW SESSION STATUS LIKE 'Ssl_version'")).fetchone()
        
        # テストデータベースクエリ
        test_result = db.execute(text("SELECT 1 as test")).fetchone()
        
        return {
            "success": True,
            "database_connected": True,
            "ssl_enabled": bool(ssl_result and ssl_result[1]),
            "ssl_cipher": ssl_result[1] if ssl_result else None,
            "ssl_version": ssl_version[1] if ssl_version else None,
            "test_query_result": test_result[0] if test_result else None
        }
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return {
            "success": False,
            "error": str(e),
            "database_connected": False
        }

@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """現在のユーザー情報を取得"""
    try:
        return {
            "success": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "birth_date": current_user.birth_date.isoformat() if current_user.birth_date else None,
                "hometown": current_user.hometown,
                "hobbies": current_user.hobbies,
                "profile_image_url": current_user.profile_image_url,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
                "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
            }
        }
        
    except Exception as e:
        print(f"ユーザー情報取得エラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ユーザー情報の取得に失敗しました"
        )

@router.post("/refresh")
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    """トークンリフレッシュ"""
    try:
        # 新しいアクセストークン生成
        access_token = create_access_token(data={"sub": str(current_user.id)})
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        print(f"トークンリフレッシュエラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="トークンの更新に失敗しました"
        )

@router.post("/logout")
async def logout_user():
    """ユーザーログアウト"""
    return {
        "success": True,
        "message": "ログアウトしました"
    }