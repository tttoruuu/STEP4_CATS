import pytest
from fastapi.testclient import TestClient
import sys
import os

# プロジェクトルートを sys.path に追加
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_get_marriage_mbti_questions():
    """Marriage MBTI+ 質問一覧取得のテスト"""
    response = client.get("/api/marriage-mbti/questions")
    
    assert response.status_code == 200
    data = response.json()
    
    # レスポンス構造をチェック
    assert "mbtiQuestions" in data
    assert "marriageQuestions" in data
    assert "totalMBTIQuestions" in data
    assert "totalMarriageQuestions" in data
    
    # 質問数をチェック
    assert data["totalMBTIQuestions"] == 16
    assert data["totalMarriageQuestions"] == 10
    assert len(data["mbtiQuestions"]) == 16
    assert len(data["marriageQuestions"]) == 10
    
    # MBTI質問の構造をチェック
    mbti_question = data["mbtiQuestions"][0]
    assert "id" in mbti_question
    assert "question" in mbti_question
    assert "optionA" in mbti_question
    assert "optionB" in mbti_question
    assert "dimension" in mbti_question
    assert "direction" in mbti_question
    
    # 結婚観質問の構造をチェック
    marriage_question = data["marriageQuestions"][0]
    assert "id" in marriage_question
    assert "question" in marriage_question
    assert "options" in marriage_question
    assert "category" in marriage_question
    assert len(marriage_question["options"]) == 5


def test_analyze_marriage_mbti_valid_answers():
    """有効な回答データでの Marriage MBTI+ 分析テスト"""
    # サンプル回答データ
    sample_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "A" if i % 2 == 0 else "B"}
            for i in range(16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": (i % 5) + 1}
            for i in range(10)
        ]
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=sample_answers)
    
    assert response.status_code == 200
    data = response.json()
    
    # レスポンス構造をチェック
    assert "mbtiType" in data
    assert "typeName" in data
    assert "description" in data
    assert "loveCharacteristics" in data
    assert "compatibleTypes" in data
    assert "advice" in data
    assert "mbtiScores" in data
    assert "marriageScores" in data
    
    # MBTI タイプが有効な16タイプの1つかチェック
    valid_types = [
        "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"
    ]
    assert data["mbtiType"] in valid_types
    
    # MBTI スコアの構造をチェック
    mbti_scores = data["mbtiScores"]
    expected_keys = ["E", "I", "S", "N", "T", "F", "J", "P"]
    for key in expected_keys:
        assert key in mbti_scores
        assert isinstance(mbti_scores[key], int)
        assert 0 <= mbti_scores[key] <= 16
    
    # 結婚観スコアの構造をチェック
    marriage_scores = data["marriageScores"]
    expected_categories = ["communication", "lifestyle", "values", "future", "intimacy"]
    for category in expected_categories:
        assert category in marriage_scores
        assert isinstance(marriage_scores[category], (int, float))
        assert 1.0 <= marriage_scores[category] <= 5.0
    
    # 愛の特徴をチェック
    assert isinstance(data["loveCharacteristics"], list)
    assert len(data["loveCharacteristics"]) > 0
    
    # 相性タイプをチェック
    assert isinstance(data["compatibleTypes"], list)
    assert len(data["compatibleTypes"]) > 0
    for compatible_type in data["compatibleTypes"]:
        assert "type" in compatible_type
        assert "reason" in compatible_type
    
    # アドバイスをチェック
    assert isinstance(data["advice"], list)
    assert len(data["advice"]) > 0
    for advice in data["advice"]:
        assert "category" in advice
        assert "content" in advice


def test_analyze_marriage_mbti_missing_mbti_answers():
    """MBTI回答が不足している場合のテスト"""
    incomplete_answers = {
        "mbtiAnswers": [{"questionId": 0, "answer": "A"}],  # 1問のみ
        "marriageAnswers": [
            {"questionId": i, "answer": 3} for i in range(10)
        ]
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=incomplete_answers)
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "16問必須" in data["detail"]


def test_analyze_marriage_mbti_missing_marriage_answers():
    """結婚観回答が不足している場合のテスト"""
    incomplete_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "A"} for i in range(16)
        ],
        "marriageAnswers": [{"questionId": 0, "answer": 3}]  # 1問のみ
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=incomplete_answers)
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "10問必須" in data["detail"]


def test_analyze_marriage_mbti_invalid_mbti_answer():
    """無効なMBTI回答の場合のテスト"""
    invalid_answers = {
        "mbtiAnswers": [
            {"questionId": 0, "answer": "C"}  # 無効な回答
        ] + [
            {"questionId": i, "answer": "A"} for i in range(1, 16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": 3} for i in range(10)
        ]
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=invalid_answers)
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "'A'または'B'" in data["detail"]


def test_analyze_marriage_mbti_invalid_marriage_answer():
    """無効な結婚観回答の場合のテスト"""
    invalid_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "A"} for i in range(16)
        ],
        "marriageAnswers": [
            {"questionId": 0, "answer": 6}  # 無効な回答（範囲外）
        ] + [
            {"questionId": i, "answer": 3} for i in range(1, 10)
        ]
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=invalid_answers)
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "1-5の範囲" in data["detail"]


def test_analyze_marriage_mbti_wrong_question_order():
    """質問ID順序が不正な場合のテスト"""
    wrong_order_answers = {
        "mbtiAnswers": [
            {"questionId": 1, "answer": "A"},  # 0から始まるべき
            {"questionId": 0, "answer": "B"}
        ] + [
            {"questionId": i, "answer": "A"} for i in range(2, 16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": 3} for i in range(10)
        ]
    }
    
    response = client.post("/api/marriage-mbti/analyze", json=wrong_order_answers)
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "順序が不正" in data["detail"]


def test_get_mbti_types():
    """MBTI タイプ一覧取得のテスト"""
    response = client.get("/api/marriage-mbti/mbti-types")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "mbtiTypes" in data
    assert "totalTypes" in data
    assert data["totalTypes"] == 16
    
    # 全16タイプが含まれているかチェック
    expected_types = [
        "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"
    ]
    
    for mbti_type in expected_types:
        assert mbti_type in data["mbtiTypes"]
        type_info = data["mbtiTypes"][mbti_type]
        assert "name" in type_info
        assert "description" in type_info
        assert "loveCharacteristics" in type_info
        assert "compatibleTypes" in type_info


def test_get_marriage_categories():
    """結婚観カテゴリ一覧取得のテスト"""
    response = client.get("/api/marriage-mbti/marriage-categories")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "categories" in data
    assert "totalCategories" in data
    assert data["totalCategories"] == 5
    
    expected_categories = ["communication", "lifestyle", "values", "future", "intimacy"]
    for category in expected_categories:
        assert category in data["categories"]
        assert isinstance(data["categories"][category], str)


def test_health_check():
    """ヘルスチェックのテスト"""
    response = client.get("/api/marriage-mbti/health")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "status" in data
    assert "service" in data
    assert "version" in data
    assert "features" in data
    
    assert data["status"] == "healthy"
    assert data["service"] == "Marriage MBTI+ API"
    assert data["version"] == "1.0.0"
    assert len(data["features"]) == 4


def test_mbti_consistency():
    """同じ回答に対して一貫した結果が得られることをテスト"""
    sample_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "A"} for i in range(16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": 3} for i in range(10)
        ]
    }
    
    # 同じ回答で2回分析実行
    response1 = client.post("/api/marriage-mbti/analyze", json=sample_answers)
    response2 = client.post("/api/marriage-mbti/analyze", json=sample_answers)
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    data1 = response1.json()
    data2 = response2.json()
    
    # 結果が一致することを確認
    assert data1["mbtiType"] == data2["mbtiType"]
    assert data1["typeName"] == data2["typeName"]
    assert data1["description"] == data2["description"]
    assert data1["mbtiScores"] == data2["mbtiScores"]
    assert data1["marriageScores"] == data2["marriageScores"]


def test_extreme_answers():
    """極端な回答パターンでのテスト"""
    # 全てA選択のMBTI回答
    extreme_a_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "A"} for i in range(16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": 1} for i in range(10)  # 全て最低値
        ]
    }
    
    response_a = client.post("/api/marriage-mbti/analyze", json=extreme_a_answers)
    assert response_a.status_code == 200
    data_a = response_a.json()
    assert data_a["mbtiType"] == "ESTJ"  # 全てA選択の場合
    
    # 全てB選択のMBTI回答
    extreme_b_answers = {
        "mbtiAnswers": [
            {"questionId": i, "answer": "B"} for i in range(16)
        ],
        "marriageAnswers": [
            {"questionId": i, "answer": 5} for i in range(10)  # 全て最高値
        ]
    }
    
    response_b = client.post("/api/marriage-mbti/analyze", json=extreme_b_answers)
    assert response_b.status_code == 200
    data_b = response_b.json()
    assert data_b["mbtiType"] == "INFP"  # 全てB選択の場合
    
    # 両方とも有効な結果が得られることを確認
    assert "typeName" in data_a
    assert "typeName" in data_b
    assert data_a["mbtiType"] != data_b["mbtiType"]  # 異なる結果


if __name__ == "__main__":
    pytest.main([__file__, "-v"])