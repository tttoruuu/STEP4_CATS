from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    birth_date: date
    konkatsu_status: Optional[str] = None
    occupation: Optional[str] = None
    birth_place: Optional[str] = None
    location: Optional[str] = None
    hobbies: Optional[str] = None
    weekend_activity: Optional[str] = None

class UserCreate(UserBase):
    password: str

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