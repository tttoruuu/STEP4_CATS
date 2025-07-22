from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List, Dict, Any

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    birth_date: date
    hometown: Optional[str] = None
    hobbies: Optional[str] = None
    matchmaking_agency: Optional[str] = None

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

# Deep Questions Schemas
class QuestionOption(BaseModel):
    id: str  # 'A', 'B', 'C', 'D'
    text: str
    isCorrect: bool
    explanation: str

class PartnerInfo(BaseModel):
    name: str
    age: str
    occupation: str

class DeepQuestionBase(BaseModel):
    category: str
    level: int
    situation: str
    partnerInfo: PartnerInfo
    statement: str
    options: List[QuestionOption]
    audioUrl: Optional[str] = None
    keyPoints: Optional[List[str]] = None

class DeepQuestionCreate(DeepQuestionBase):
    correct_answer: str

class DeepQuestionResponse(BaseModel):
    id: int
    category: str
    level: int
    situation: str
    partnerInfo: Dict[str, Any]
    statement: str
    options: List[Dict[str, Any]]
    audioUrl: Optional[str] = None
    keyPoints: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class DeepQuestionProgressCreate(BaseModel):
    question_id: int
    selected_answer: str

class DeepQuestionProgressResponse(BaseModel):
    id: int
    question_id: int
    selected_answer: str
    is_correct: bool
    attempts: int
    completed_at: datetime
    
    class Config:
        from_attributes = True

class ShadowingSessionCreate(BaseModel):
    question_id: int
    duration_seconds: Optional[int] = None
    tone_score: Optional[int] = None
    speed_score: Optional[int] = None

class ShadowingSessionResponse(BaseModel):
    id: int
    question_id: int
    duration_seconds: Optional[int] = None
    tone_score: Optional[int] = None
    speed_score: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True