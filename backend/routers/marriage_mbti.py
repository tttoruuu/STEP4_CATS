from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from schemas.marriage_mbti import (
    MarriageMBTIAnswers,
    MarriageMBTIResult,
    QuestionsResponse,
    ErrorResponse,
    MBTIQuestion,
    MarriageQuestion,
    MBTIDimension,
    MarriageCategory
)
from services.marriage_mbti_logic import (
    MBTI_QUESTIONS,
    MARRIAGE_QUESTIONS,
    analyze_marriage_mbti
)

router = APIRouter(tags=["marriage-mbti"])


@router.get(
    "/questions",
    response_model=QuestionsResponse,
    summary="Marriage MBTI+ 質問一覧取得",
    description="MBTI診断と結婚観診断で使用する全質問を取得します"
)
async def get_marriage_mbti_questions() -> QuestionsResponse:
    """Marriage MBTI+ の質問一覧を取得"""
    try:
        # MBTI質問データを変換
        mbti_questions = []
        for q in MBTI_QUESTIONS:
            question = MBTIQuestion(
                id=q["id"],
                question=q["question"],
                optionA=q["optionA"],
                optionB=q["optionB"],
                dimension=q["dimension"],
                direction=q["direction"]
            )
            mbti_questions.append(question)
        
        # 結婚観質問データを変換
        marriage_questions = []
        for q in MARRIAGE_QUESTIONS:
            question = MarriageQuestion(
                id=q["id"],
                question=q["question"],
                options=q["options"],
                category=q["category"]
            )
            marriage_questions.append(question)
        
        return QuestionsResponse(
            mbtiQuestions=mbti_questions,
            marriageQuestions=marriage_questions,
            totalMBTIQuestions=len(mbti_questions),
            totalMarriageQuestions=len(marriage_questions)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"質問データの取得に失敗しました: {str(e)}"
        )


@router.post(
    "/analyze",
    response_model=MarriageMBTIResult,
    summary="Marriage MBTI+ 分析実行",
    description="MBTI回答と結婚観回答を基に統合分析を実行し、結果を返します",
    responses={
        400: {"model": ErrorResponse, "description": "回答データが不正"},
        500: {"model": ErrorResponse, "description": "サーバーエラー"}
    }
)
async def analyze_marriage_mbti_test(answers_data: MarriageMBTIAnswers) -> MarriageMBTIResult:
    """
    Marriage MBTI+ の分析を実行
    
    Args:
        answers_data: MBTI回答と結婚観回答データ
    
    Returns:
        MarriageMBTIResult: 統合診断結果
    """
    try:
        mbti_answers = answers_data.mbtiAnswers
        marriage_answers = answers_data.marriageAnswers
        
        # 回答データの検証
        if not mbti_answers or not marriage_answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MBTI回答と結婚観回答の両方が必要です"
            )
        
        # MBTI回答の検証（16問必須）
        if len(mbti_answers) != 16:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"MBTI回答は16問必須です。現在: {len(mbti_answers)}問"
            )
        
        # 結婚観回答の検証（10問必須）
        if len(marriage_answers) != 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"結婚観回答は10問必須です。現在: {len(marriage_answers)}問"
            )
        
        # MBTI回答の内容検証
        for i, answer in enumerate(mbti_answers):
            if answer.questionId != i:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"MBTI質問ID順序が不正です: 期待値{i}, 実際値{answer.questionId}"
                )
            
            if answer.answer not in ['A', 'B']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"MBTI回答は'A'または'B'である必要があります: {answer.answer}"
                )
        
        # 結婚観回答の内容検証
        for i, answer in enumerate(marriage_answers):
            if answer.questionId != i:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"結婚観質問ID順序が不正です: 期待値{i}, 実際値{answer.questionId}"
                )
            
            if not (1 <= answer.answer <= 5):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"結婚観回答は1-5の範囲である必要があります: {answer.answer}"
                )
        
        # 統合分析実行
        result = analyze_marriage_mbti(mbti_answers, marriage_answers)
        
        return result
    
    except HTTPException:
        # HTTPExceptionはそのまま再送出
        raise
    
    except Exception as e:
        # その他のエラー
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Marriage MBTI+ 分析処理でエラーが発生しました: {str(e)}"
        )


@router.get(
    "/mbti-types",
    summary="MBTI タイプ一覧取得",
    description="利用可能な MBTI 16タイプの一覧を取得します"
)
async def get_mbti_types() -> Dict[str, Any]:
    """MBTI 16タイプ一覧を取得"""
    try:
        from schemas.marriage_mbti import MBTIType
        from services.marriage_mbti_logic import get_mbti_description_and_compatibility
        
        types_info = {}
        for mbti_type in MBTIType:
            description = get_mbti_description_and_compatibility(mbti_type)
            
            types_info[mbti_type.value] = {
                "name": description["name"],
                "description": description["description"],
                "loveCharacteristics": description["loveCharacteristics"],
                "compatibleTypes": [ct["type"] for ct in description["compatibleTypes"]]
            }
        
        return {
            "mbtiTypes": types_info,
            "totalTypes": len(MBTIType)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MBTI タイプデータの取得に失敗しました: {str(e)}"
        )


@router.get(
    "/marriage-categories",
    summary="結婚観カテゴリ一覧取得",
    description="結婚観診断で使用するカテゴリ一覧を取得します"
)
async def get_marriage_categories() -> Dict[str, Any]:
    """結婚観カテゴリ一覧を取得"""
    try:
        categories = {
            MarriageCategory.COMMUNICATION: "コミュニケーション",
            MarriageCategory.LIFESTYLE: "ライフスタイル", 
            MarriageCategory.VALUES: "価値観",
            MarriageCategory.FUTURE: "将来設計",
            MarriageCategory.INTIMACY: "親密さ"
        }
        
        return {
            "categories": {k.value: v for k, v in categories.items()},
            "totalCategories": len(categories)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"結婚観カテゴリデータの取得に失敗しました: {str(e)}"
        )


@router.get(
    "/health",
    summary="ヘルスチェック",
    description="Marriage MBTI+ APIのヘルスチェック"
)
async def health_check() -> Dict[str, Any]:
    """APIヘルスチェック"""
    return {
        "status": "healthy",
        "service": "Marriage MBTI+ API",
        "version": "1.0.0",
        "features": [
            "MBTI 16タイプ診断",
            "結婚観5カテゴリ診断", 
            "相性分析",
            "パーソナライズアドバイス"
        ]
    }