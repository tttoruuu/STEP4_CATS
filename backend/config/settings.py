"""
環境変数管理と設定の中央集約
Pydanticを使用した型安全な設定管理
"""
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import Optional, List
import os
from pathlib import Path
from dotenv import load_dotenv

# .envファイルの読み込み
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    """アプリケーション設定"""
    
    # 環境設定
    env: str = Field(default="development", env="ENV")
    debug: bool = Field(default=True)
    
    # セキュリティ設定
    secret_key: str = Field(..., env="SECRET_KEY")
    encryption_key: str = Field(..., env="ENCRYPTION_KEY")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=1440)
    
    # データベース設定
    database_url: str = Field(..., env="DATABASE_URL")
    mysql_ssl_cert: Optional[str] = Field(None, env="MYSQL_SSL_CERT")
    
    # CORS設定
    frontend_origin: str = Field(default="http://localhost:3000", env="FRONTEND_ORIGIN")
    allowed_origins: List[str] = []
    
    # OpenAI API設定
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini")
    openai_max_tokens: int = Field(default=1000)
    openai_temperature: float = Field(default=0.7)
    
    # アップロード設定
    max_upload_size: int = Field(default=10 * 1024 * 1024)  # 10MB
    allowed_image_types: List[str] = Field(default=["image/jpeg", "image/png", "image/webp"])
    
    # Redis設定（将来的な拡張用）
    redis_url: Optional[str] = Field(None, env="REDIS_URL")
    
    @validator("secret_key", pre=True)
    def validate_secret_key(cls, v, values):
        """シークレットキーの検証"""
        if not v or v == "your-secret-key" or v == "development-only-key-please-change-in-production":
            env = values.get("env", "development")
            if env == "production":
                raise ValueError("本番環境で安全でないSECRET_KEYが使用されています")
        return v
    
    @validator("encryption_key", pre=True)
    def validate_encryption_key(cls, v, values):
        """暗号化キーの検証"""
        if not v:
            env = values.get("env", "development")
            if env == "production":
                raise ValueError("本番環境でENCRYPTION_KEYが設定されていません")
        return v
    
    @validator("allowed_origins", pre=True, always=True)
    def build_allowed_origins(cls, v, values):
        """許可するオリジンのリストを構築"""
        env = values.get("env", "development")
        frontend_origin = values.get("frontend_origin", "http://localhost:3000")
        
        # 基本的なオリジン
        origins = [
            "http://localhost:3000",
            "http://frontend:3000",
            frontend_origin,
        ]
        
        # 本番環境の場合、追加のオリジンを含める
        if env == "production":
            origins.extend([
                "https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io",
                "https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io",
                # HTTPSバージョンも追加
                frontend_origin.replace("http://", "https://") if frontend_origin.startswith("http://") else frontend_origin
            ])
        
        # 重複を削除
        return list(set(origins))
    
    @validator("openai_api_key", pre=True)
    def validate_openai_key(cls, v):
        """OpenAI APIキーの検証"""
        if not v or not v.startswith("sk-"):
            raise ValueError("有効なOpenAI APIキーが設定されていません")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
    @property
    def is_production(self) -> bool:
        """本番環境かどうか"""
        return self.env == "production"
    
    @property
    def is_development(self) -> bool:
        """開発環境かどうか"""
        return self.env == "development"

# シングルトンインスタンス
settings = Settings()