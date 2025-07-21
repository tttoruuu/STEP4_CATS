from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from schemas.personality import (
    PersonalityTestAnswers,
    PersonalityTestResult,
    QuestionsResponse,
    ErrorResponse,
    Question,
    QuestionOption
)
from services.personality_logic import (
    PERSONALITY_QUESTIONS,
    calculate_personality_scores,
    determine_personality_type,
    get_personality_description,
    get_compatible_types,
    PersonalityDimension
)

router = APIRouter(tags=["personality"])


@router.get(
    "/questions",
    response_model=QuestionsResponse,
    summary="性格診断質問一覧取得",
    description="性格診断で使用する全質問を取得します"
)
async def get_personality_questions() -> QuestionsResponse:
    """性格診断の質問一覧を取得"""
    try:
        # personality_logic.pyの質問データをAPIスキーマに変換
        questions = []
        for q in PERSONALITY_QUESTIONS:
            question = Question(
                id=q["id"],
                question=q["question"],
                dimension=q["dimension"],
                options=[
                    QuestionOption(text=opt["text"], score=opt["score"])
                    for opt in q["options"]
                ]
            )
            questions.append(question)
        
        return QuestionsResponse(
            questions=questions,
            total_questions=len(questions)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"質問データの取得に失敗しました: {str(e)}"
        )


@router.post(
    "/analyze",
    response_model=PersonalityTestResult,
    summary="性格診断分析実行",
    description="回答データを基に性格分析を実行し、結果を返します",
    responses={
        400: {"model": ErrorResponse, "description": "回答データが不正"},
        500: {"model": ErrorResponse, "description": "サーバーエラー"}
    }
)
async def analyze_personality(answers_data: PersonalityTestAnswers) -> PersonalityTestResult:
    """
    性格診断の分析を実行
    
    Args:
        answers_data: 回答データ {question_id: selected_option_index}
    
    Returns:
        PersonalityTestResult: 診断結果
    """
    try:
        answers = answers_data.answers
        
        # 回答データの検証
        if not answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="回答データが空です"
            )
        
        # 全質問に回答しているかチェック
        expected_question_ids = {q["id"] for q in PERSONALITY_QUESTIONS}
        answered_question_ids = set(answers.keys())
        
        if not expected_question_ids.issubset(answered_question_ids):
            missing_questions = expected_question_ids - answered_question_ids
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"未回答の質問があります: {missing_questions}"
            )
        
        # 回答の範囲をチェック
        for question_id, option_index in answers.items():
            question = next((q for q in PERSONALITY_QUESTIONS if q["id"] == question_id), None)
            if question is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"存在しない質問ID: {question_id}"
                )
            
            if not (0 <= option_index < len(question["options"])):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"無効な選択肢インデックス: 質問{question_id}, 選択肢{option_index}"
                )
        
        # 性格分析実行
        scores = calculate_personality_scores(answers)
        personality_type = determine_personality_type(scores)
        description = get_personality_description(personality_type)
        compatible_types = get_compatible_types(personality_type)
        
        # レスポンス用にスコアを変換
        from schemas.personality import PersonalityScore
        personality_scores = PersonalityScore(
            外向性=scores.get(PersonalityDimension.EXTROVERSION, 0.0),
            コミュニケーション=scores.get(PersonalityDimension.COMMUNICATION, 0.0),
            感情安定性=scores.get(PersonalityDimension.EMOTIONAL_STABILITY, 0.0),
            意思決定=scores.get(PersonalityDimension.DECISION_MAKING, 0.0),
            共感性=scores.get(PersonalityDimension.EMPATHY, 0.0),
            コミット力=scores.get(PersonalityDimension.COMMITMENT, 0.0)
        )
        
        # レスポンス用に説明を変換
        from schemas.personality import PersonalityDescription
        personality_description = PersonalityDescription(
            title=description["title"],
            summary=description["summary"],
            strengths=description["strengths"],
            marriage_advice=description["marriage_advice"],
            growth_points=description["growth_points"]
        )
        
        return PersonalityTestResult(
            personality_type=personality_type,
            scores=personality_scores,
            description=personality_description,
            compatible_types=compatible_types
        )
    
    except HTTPException:
        # HTTPExceptionはそのまま再送出
        raise
    
    except Exception as e:
        # その他のエラー
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"性格分析処理でエラーが発生しました: {str(e)}"
        )


@router.get(
    "/types",
    summary="性格タイプ一覧取得",
    description="利用可能な性格タイプの一覧を取得します"
)
async def get_personality_types() -> Dict[str, Any]:
    """性格タイプ一覧を取得"""
    try:
        from services.personality_logic import PersonalityType
        
        types_info = {}
        for personality_type in PersonalityType:
            description = get_personality_description(personality_type)
            compatible_types = get_compatible_types(personality_type)
            
            types_info[personality_type.value] = {
                "title": description["title"],
                "summary": description["summary"],
                "compatible_types": [t.value for t in compatible_types]
            }
        
        return {
            "personality_types": types_info,
            "total_types": len(PersonalityType)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"性格タイプデータの取得に失敗しました: {str(e)}"
        )