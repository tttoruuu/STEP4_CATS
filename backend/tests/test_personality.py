import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_personality_questions():
    """性格診断質問一覧取得のテスト"""
    response = client.get("/api/personality/questions")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "questions" in data
    assert "total_questions" in data
    assert len(data["questions"]) > 0
    assert data["total_questions"] == len(data["questions"])
    
    # 質問の構造をチェック
    question = data["questions"][0]
    assert "id" in question
    assert "question" in question
    assert "dimension" in question
    assert "options" in question
    assert len(question["options"]) == 4
    
    # 選択肢の構造をチェック
    option = question["options"][0]
    assert "text" in option
    assert "score" in option


def test_analyze_personality_valid_answers():
    """有効な回答データでの性格分析テスト"""
    # まず質問を取得
    questions_response = client.get("/api/personality/questions")
    questions_data = questions_response.json()
    
    # 全質問に対する回答を作成
    answers = {}
    for question in questions_data["questions"]:
        answers[question["id"]] = 0  # 最初の選択肢を選択
    
    response = client.post("/api/personality/analyze", json={"answers": answers})
    
    assert response.status_code == 200
    data = response.json()
    
    # レスポンス構造をチェック
    assert "personality_type" in data
    assert "scores" in data
    assert "description" in data
    assert "compatible_types" in data
    
    # スコアの構造をチェック
    scores = data["scores"]
    expected_dimensions = ["外向性", "コミュニケーション", "感情安定性", "意思決定", "共感性", "コミット力"]
    for dimension in expected_dimensions:
        assert dimension in scores
        assert isinstance(scores[dimension], (int, float))
        assert 0 <= scores[dimension] <= 100
    
    # 説明の構造をチェック
    description = data["description"]
    assert "title" in description
    assert "summary" in description
    assert "strengths" in description
    assert "marriage_advice" in description
    assert "growth_points" in description


def test_analyze_personality_missing_answers():
    """回答が不足している場合のテスト"""
    incomplete_answers = {1: 0, 2: 1}  # 一部の質問のみ回答
    
    response = client.post("/api/personality/analyze", json={"answers": incomplete_answers})
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "未回答" in data["detail"]


def test_analyze_personality_invalid_question_id():
    """存在しない質問IDの場合のテスト"""
    invalid_answers = {999: 0}  # 存在しない質問ID
    
    response = client.post("/api/personality/analyze", json={"answers": invalid_answers})
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "存在しない質問ID" in data["detail"]


def test_analyze_personality_invalid_option_index():
    """無効な選択肢インデックスの場合のテスト"""
    # まず質問を取得
    questions_response = client.get("/api/personality/questions")
    questions_data = questions_response.json()
    
    # 最初の質問に無効な選択肢インデックスを設定
    first_question_id = questions_data["questions"][0]["id"]
    invalid_answers = {first_question_id: 999}  # 存在しない選択肢インデックス
    
    response = client.post("/api/personality/analyze", json={"answers": invalid_answers})
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "無効な選択肢" in data["detail"]


def test_analyze_personality_empty_answers():
    """空の回答データの場合のテスト"""
    response = client.post("/api/personality/analyze", json={"answers": {}})
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "回答データが空" in data["detail"]


def test_get_personality_types():
    """性格タイプ一覧取得のテスト"""
    response = client.get("/api/personality/types")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "personality_types" in data
    assert "total_types" in data
    assert len(data["personality_types"]) > 0
    assert data["total_types"] == len(data["personality_types"])
    
    # 各性格タイプの構造をチェック
    for type_name, type_info in data["personality_types"].items():
        assert "title" in type_info
        assert "summary" in type_info
        assert "compatible_types" in type_info
        assert isinstance(type_info["compatible_types"], list)


def test_personality_consistency():
    """同じ回答に対して一貫した結果が得られることをテスト"""
    # まず質問を取得
    questions_response = client.get("/api/personality/questions")
    questions_data = questions_response.json()
    
    # 全質問に同じ回答パターンを作成
    answers = {}
    for question in questions_data["questions"]:
        answers[question["id"]] = 2  # 中間の選択肢を選択
    
    # 同じ回答で複数回分析実行
    response1 = client.post("/api/personality/analyze", json={"answers": answers})
    response2 = client.post("/api/personality/analyze", json={"answers": answers})
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    data1 = response1.json()
    data2 = response2.json()
    
    # 結果が一致することを確認
    assert data1["personality_type"] == data2["personality_type"]
    assert data1["scores"] == data2["scores"]
    assert data1["description"] == data2["description"]
    assert data1["compatible_types"] == data2["compatible_types"]


def test_personality_extreme_answers():
    """極端な回答（全て最高スコア/最低スコア）でのテスト"""
    # まず質問を取得
    questions_response = client.get("/api/personality/questions")
    questions_data = questions_response.json()
    
    # 全て最高スコアの回答
    high_answers = {}
    for question in questions_data["questions"]:
        high_answers[question["id"]] = 0  # 最初の選択肢（通常最高スコア）
    
    response_high = client.post("/api/personality/analyze", json={"answers": high_answers})
    assert response_high.status_code == 200
    
    # 全て最低スコアの回答
    low_answers = {}
    for question in questions_data["questions"]:
        low_answers[question["id"]] = 3  # 最後の選択肢（通常最低スコア）
    
    response_low = client.post("/api/personality/analyze", json={"answers": low_answers})
    assert response_low.status_code == 200
    
    # 両方とも有効な結果が得られることを確認
    high_data = response_high.json()
    low_data = response_low.json()
    
    assert "personality_type" in high_data
    assert "personality_type" in low_data
    
    # スコアが適切な範囲内にあることを確認
    for dimension, score in high_data["scores"].items():
        assert 0 <= score <= 100
    
    for dimension, score in low_data["scores"].items():
        assert 0 <= score <= 100


if __name__ == "__main__":
    pytest.main([__file__])