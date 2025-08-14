import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base, get_db
from models.user import User
from auth.jwt import create_access_token

# テスト用のSQLiteデータベース
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# テスト用データベース依存関数
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as client:
        yield client
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user_token():
    """テスト用ユーザーとトークンを作成"""
    db = TestingSessionLocal()
    
    # テストユーザー作成
    user = User(
        username="testuser@example.com",
        email="testuser@example.com", 
        password_hash="$2b$12$test_hash",
        full_name="テストユーザー",
        birth_date="1990-01-01"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # JWTトークン生成
    token = create_access_token(data={"sub": str(user.id)})
    
    db.close()
    return {"token": token, "user_id": user.id}

class TestProfileAPI:
    """プロフィールAPIのテストクラス"""
    
    def test_get_profile_me_success(self, client, test_user_token):
        """プロフィール取得成功テスト"""
        response = client.get(
            "/api/profile/me",
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "profile" in data
        assert data["profile"]["name"] == "テストユーザー"
    
    def test_get_comprehensive_profile_success(self, client, test_user_token):
        """統合プロフィール取得成功テスト"""
        response = client.get(
            "/api/profile/comprehensive",
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "profile" in data
        
        profile = data["profile"]
        assert "user_id" in profile
        assert "name" in profile
        assert "age" in profile
        assert "hobbies" in profile
    
    def test_create_or_update_profile_success(self, client, test_user_token):
        """プロフィール作成/更新成功テスト"""
        profile_data = {
            "full_name": "更新されたユーザー",
            "konkatsu_status": "beginner", 
            "occupation": "エンジニア",
            "birth_place": "東京都",
            "location": "神奈川県",
            "hobbies": ["読書", "映画鑑賞", "プログラミング"],
            "weekend_activity": "カフェでコーディング"
        }
        
        response = client.post(
            "/api/profile/",
            json=profile_data,
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "プロフィールが更新されました"
        assert data["profile"]["name"] == "更新されたユーザー"
    
    def test_update_profile_success(self, client, test_user_token):
        """プロフィール更新成功テスト"""
        update_data = {
            "full_name": "再更新されたユーザー",
            "occupation": "シニアエンジニア",
            "hobbies": ["AI開発", "機械学習", "読書"]
        }
        
        response = client.put(
            "/api/profile/update",
            json=update_data,
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "プロフィールが更新されました"
    
    def test_profile_unauthorized(self, client):
        """認証なしでプロフィールアクセスのテスト"""
        response = client.get("/api/profile/me")
        assert response.status_code == 401
        
        response = client.get("/api/profile/comprehensive")
        assert response.status_code == 401
        
        response = client.post("/api/profile/", json={})
        assert response.status_code == 401
    
    def test_profile_with_invalid_token(self, client):
        """無効なトークンでプロフィールアクセスのテスト"""
        invalid_token = "invalid.token.here"
        
        response = client.get(
            "/api/profile/me",
            headers={"Authorization": f"Bearer {invalid_token}"}
        )
        assert response.status_code == 401
    
    def test_hobbies_array_conversion(self, client, test_user_token):
        """趣味配列の変換テスト"""
        profile_data = {
            "hobbies": ["趣味1", "趣味2", "趣味3"]
        }
        
        # プロフィール更新
        response = client.post(
            "/api/profile/",
            json=profile_data,
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        assert response.status_code == 200
        
        # プロフィール取得して確認
        response = client.get(
            "/api/profile/comprehensive", 
            headers={"Authorization": f"Bearer {test_user_token['token']}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        hobbies = data["profile"]["hobbies"]
        assert isinstance(hobbies, list)
        assert len(hobbies) == 3
        assert "趣味1" in hobbies
        assert "趣味2" in hobbies
        assert "趣味3" in hobbies

# 実行用
if __name__ == "__main__":
    pytest.main([__file__])