from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    birth_date: Optional[date] = None
    konkatsu_status: Optional[str] = None
    occupation: Optional[str] = None
    birth_place: Optional[str] = None
    location: Optional[str] = None
    hobbies: Optional[str] = None
    weekend_activity: Optional[str] = None

# プロフィール関連のスキーマを追加
class ProfileBase(BaseModel):
    hometown: Optional[str] = None
    hobbies: Optional[List[str]] = None
    
class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass
    
class ProfileRead(ProfileBase):
    id: int
    user_id: int
    age: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    def get_age(self, birth_date: Optional[date]) -> Optional[int]:
        if birth_date:
            today = date.today()
            return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return None

class UserCreate(UserBase):
    password: str

class UserRegister(BaseModel):
    """登録専用スキーマ（birth_date不要）"""
    username: str
    email: EmailStr
    password: str
    full_name: str
    birth_date: Optional[date] = None
    konkatsu_status: Optional[str] = None
    occupation: Optional[str] = None
    birth_place: Optional[str] = None
    location: Optional[str] = None
    hobbies: Optional[str] = None
    weekend_activity: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 