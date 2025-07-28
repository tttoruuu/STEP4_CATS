from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class DeepQuestion(Base):
    __tablename__ = "deep_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False, index=True)
    level = Column(Integer, nullable=False, default=1)
    situation_text = Column(Text, nullable=False)
    partner_info = Column(JSON, nullable=False)  # {"name": "みゆきさん", "age": "26歳", "occupation": "看護師"}
    statement = Column(Text, nullable=False)  # 相手の発言
    options = Column(JSON, nullable=False)  # 4択の選択肢と解説
    correct_answer = Column(String(1), nullable=False)  # 'A', 'B', 'C', 'D'
    audio_url = Column(String(255), nullable=True)  # 音声ファイルのURL
    key_points = Column(JSON, nullable=True)  # ポイントの配列
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)  # 有効/無効フラグ

class DeepQuestionProgress(Base):
    __tablename__ = "deep_question_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("deep_questions.id"), nullable=False)
    selected_answer = Column(String(1), nullable=False)  # ユーザーが選択した答え
    is_correct = Column(Boolean, nullable=False)
    attempts = Column(Integer, default=1)  # 挑戦回数
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User", back_populates="deep_question_progress")
    question = relationship("DeepQuestion")

class ShadowingSession(Base):
    __tablename__ = "shadowing_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("deep_questions.id"), nullable=False)
    model_audio_url = Column(String(255), nullable=True)  # 模範音声URL
    user_audio_url = Column(String(255), nullable=True)   # ユーザー録音URL
    duration_seconds = Column(Integer, nullable=True)
    tone_score = Column(Integer, nullable=True)   # トーンスコア(1-100)
    speed_score = Column(Integer, nullable=True)  # スピードスコア(1-100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User")
    question = relationship("DeepQuestion")