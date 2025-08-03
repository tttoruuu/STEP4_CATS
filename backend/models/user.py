from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    birth_date = Column(Date, nullable=True)
    hometown = Column(String(255))
    hobbies = Column(Text)
    matchmaking_agency = Column(String(255))
    profile_image_url = Column(String(255))
    
    # 追加フィールド（login-chatで収集）
    konkatsu_status = Column(String(50))  # 婚活経験 (beginner, experienced, returning)
    occupation = Column(String(255))      # 職業
    birthplace = Column(String(255))      # 出身地
    current_location = Column(String(255)) # 現在の居住地
    holiday_style = Column(Text)          # 休日の過ごし方
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    conversation_partners = relationship("ConversationPartner", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    deep_question_progress = relationship("DeepQuestionProgress", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
