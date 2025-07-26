from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)  # 'counselor', 'practice', etc.
    user_message = Column(Text, nullable=False)
    ai_message = Column(Text, nullable=False)
    conversation_id = Column(String(100), nullable=True, index=True)  # 会話セッションID
    conversation_title = Column(String(200), nullable=True)  # 会話タイトル
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User", back_populates="conversations")