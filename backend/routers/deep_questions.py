from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.deep_question import DeepQuestion, DeepQuestionProgress, ShadowingSession
from models.user import User
from models import schemas
from auth.jwt import get_current_user

router = APIRouter(prefix="/api/deep-questions", tags=["deep-questions"])

@router.get("/", response_model=List[schemas.DeepQuestionResponse])
async def get_deep_questions(
    category: Optional[str] = None,
    level: Optional[int] = None,
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """深堀り質問の一覧を取得"""
    query = db.query(DeepQuestion).filter(DeepQuestion.is_active == True)
    
    if category and category != 'all':
        query = query.filter(DeepQuestion.category == category)
    
    if level:
        query = query.filter(DeepQuestion.level == level)
    
    if limit:
        query = query.limit(limit)
    
    questions = query.all()
    return questions

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """利用可能なカテゴリー一覧を取得"""
    categories = db.query(DeepQuestion.category).filter(DeepQuestion.is_active == True).distinct().all()
    category_list = [{"value": cat[0], "label": cat[0]} for cat in categories]
    return [{"value": "all", "label": "すべて"}] + category_list

@router.get("/{question_id}", response_model=schemas.DeepQuestionResponse)
async def get_deep_question(question_id: int, db: Session = Depends(get_db)):
    """特定の質問を取得"""
    question = db.query(DeepQuestion).filter(
        DeepQuestion.id == question_id,
        DeepQuestion.is_active == True
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return question

@router.post("/progress", response_model=schemas.DeepQuestionProgressResponse)
async def submit_answer(
    progress_data: schemas.DeepQuestionProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """回答を送信して進捗を記録"""
    
    # 質問が存在するか確認
    question = db.query(DeepQuestion).filter(
        DeepQuestion.id == progress_data.question_id,
        DeepQuestion.is_active == True
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # 正解判定
    is_correct = question.correct_answer == progress_data.selected_answer
    
    # 既存の進捗を確認（同じ問題に再挑戦の場合）
    existing_progress = db.query(DeepQuestionProgress).filter(
        DeepQuestionProgress.user_id == current_user.id,
        DeepQuestionProgress.question_id == progress_data.question_id
    ).first()
    
    if existing_progress:
        # 再挑戦の場合は挑戦回数を増やす
        existing_progress.selected_answer = progress_data.selected_answer
        existing_progress.is_correct = is_correct
        existing_progress.attempts += 1
        db.commit()
        db.refresh(existing_progress)
        return existing_progress
    else:
        # 新規挑戦の場合
        progress = DeepQuestionProgress(
            user_id=current_user.id,
            question_id=progress_data.question_id,
            selected_answer=progress_data.selected_answer,
            is_correct=is_correct
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
        return progress

@router.get("/progress/user", response_model=List[schemas.DeepQuestionProgressResponse])
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ユーザーの進捗を取得"""
    progress = db.query(DeepQuestionProgress).filter(
        DeepQuestionProgress.user_id == current_user.id
    ).all()
    
    return progress

@router.post("/shadowing", response_model=schemas.ShadowingSessionResponse)
async def create_shadowing_session(
    session_data: schemas.ShadowingSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """シャドウィング練習セッションを記録"""
    
    # 質問が存在するか確認
    question = db.query(DeepQuestion).filter(
        DeepQuestion.id == session_data.question_id,
        DeepQuestion.is_active == True
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    session = ShadowingSession(
        user_id=current_user.id,
        question_id=session_data.question_id,
        duration_seconds=session_data.duration_seconds,
        tone_score=session_data.tone_score,
        speed_score=session_data.speed_score
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/stats/user")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ユーザーの統計情報を取得"""
    
    # 総問題数
    total_questions = db.query(DeepQuestion).filter(DeepQuestion.is_active == True).count()
    
    # 挑戦済み問題数
    attempted_questions = db.query(DeepQuestionProgress).filter(
        DeepQuestionProgress.user_id == current_user.id
    ).count()
    
    # 正解数
    correct_answers = db.query(DeepQuestionProgress).filter(
        DeepQuestionProgress.user_id == current_user.id,
        DeepQuestionProgress.is_correct == True
    ).count()
    
    # 正答率
    accuracy_rate = (correct_answers / attempted_questions * 100) if attempted_questions > 0 else 0
    
    # カテゴリー別統計
    category_stats = db.execute("""
        SELECT 
            dq.category,
            COUNT(dqp.id) as attempted,
            SUM(CASE WHEN dqp.is_correct THEN 1 ELSE 0 END) as correct
        FROM deep_questions dq
        LEFT JOIN deep_question_progress dqp ON dq.id = dqp.question_id AND dqp.user_id = :user_id
        WHERE dq.is_active = true
        GROUP BY dq.category
    """, {"user_id": current_user.id}).fetchall()
    
    category_progress = {}
    for cat in category_stats:
        category_progress[cat.category] = {
            "attempted": cat.attempted or 0,
            "correct": cat.correct or 0,
            "accuracy": (cat.correct / cat.attempted * 100) if cat.attempted > 0 else 0
        }
    
    # シャドウィング練習統計
    shadowing_stats = db.execute("""
        SELECT 
            COUNT(*) as total_sessions,
            AVG(duration_seconds) as avg_duration,
            AVG(tone_score) as avg_tone_score,
            AVG(speed_score) as avg_speed_score
        FROM shadowing_sessions
        WHERE user_id = :user_id
    """, {"user_id": current_user.id}).fetchone()
    
    return {
        "total_questions": total_questions,
        "attempted_questions": attempted_questions,
        "correct_answers": correct_answers,
        "accuracy_rate": round(accuracy_rate, 2),
        "category_progress": category_progress,
        "shadowing_stats": {
            "total_sessions": shadowing_stats.total_sessions or 0,
            "avg_duration": round(shadowing_stats.avg_duration or 0, 2),
            "avg_tone_score": round(shadowing_stats.avg_tone_score or 0, 2),
            "avg_speed_score": round(shadowing_stats.avg_speed_score or 0, 2)
        }
    }