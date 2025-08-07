"""
モック認証ルーター（開発環境専用）
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import jwt
import os

router = APIRouter()

# モックユーザーデータ
MOCK_USERS = {
    "test@example.com": {
        "id": 1,
        "username": "test@example.com",
        "password": "test",
        "full_name": "テストユーザー",
        "email": "test@example.com"
    },
    "toru09may@gmail.com": {
        "id": 2,
        "username": "toru09may@gmail.com",
        "password": "tttt",
        "full_name": "Toru Test",
        "email": "toru09may@gmail.com"
    }
}

@router.post("/login")
async def mock_login(credentials: dict):
    """モックログイン（開発環境用）"""
    username = credentials.get("username") or credentials.get("email")
    password = credentials.get("password")
    
    # モックユーザー確認
    user = MOCK_USERS.get(username)
    if not user or user["password"] != password:
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが間違っています"
        )
    
    # JWTトークン生成
    secret_key = os.getenv("SECRET_KEY", "dev_secret_key_for_testing_only")
    payload = {
        "sub": str(user["id"]),
        "username": user["username"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"]
        }
    }

@router.post("/register")
async def mock_register(user_data: dict):
    """モック登録（開発環境用）"""
    email = user_data.get("email")
    
    # 既存ユーザーチェック
    if email in MOCK_USERS:
        raise HTTPException(
            status_code=400,
            detail="このメールアドレスは既に登録されています"
        )
    
    # 新規ユーザー追加（メモリ内のみ）
    new_id = len(MOCK_USERS) + 1
    MOCK_USERS[email] = {
        "id": new_id,
        "username": email,
        "password": user_data.get("password", "test"),
        "full_name": user_data.get("full_name", "New User"),
        "email": email
    }
    
    # ログインと同じレスポンスを返す
    return await mock_login({
        "username": email,
        "password": user_data.get("password", "test")
    })