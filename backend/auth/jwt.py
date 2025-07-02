from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
import os
import logging
from datetime import datetime, timedelta
from typing import Optional

# JWTの設定
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24時間

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
logger = logging.getLogger(__name__)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="トークンの有効期限が切れています",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_not_found_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ユーザーが見つかりませんでした",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # トークンのデコードを試みる
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # ユーザー名（sub）の確認
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        # トークンの有効期限を確認
        exp = payload.get("exp")
        if exp is None:
            raise credentials_exception
            
        # 現在の時刻と有効期限を比較
        current_time = datetime.utcnow().timestamp()
        
        # 有効期限が切れている場合
        if current_time > exp:
            raise token_expired_exception
            
    except JWTError as e:
        logger.error(f"JWTデコードエラー: {str(e)}")
        raise credentials_exception
    
    # ユーザーの検索
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        logger.error(f"ユーザー {username} がデータベースに見つかりません")
        raise user_not_found_exception
    
    return user 