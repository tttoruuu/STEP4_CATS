from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, Text, Boolean
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
    birth_place = Column(String(255))     # 出身地
    location = Column(String(255))        # 現在の居住地
    weekend_activity = Column(Text)       # 休日の過ごし方
    
    # サービス説明動画表示フラグ
    show_service_video = Column(Boolean, default=True)  # True: 表示する, False: 表示しない
    first_login_at = Column(TIMESTAMP)  # 初回ログイン日時
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    conversation_partners = relationship("ConversationPartner", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    deep_question_progress = relationship("DeepQuestionProgress", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
