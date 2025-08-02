from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import personality, marriage_mbti
import logging

# 最小限のFastAPIアプリケーション（Marriage MBTI+専用）
app = FastAPI(
    title="Marriage MBTI+ API", 
    version="2.0.0",
    description="MBTI診断と結婚観分析の統合診断API"
)

# CORS設定
origins = [
    "http://localhost:3000",
    "http://frontend:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター追加
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])
app.include_router(marriage_mbti.router, prefix="/api/marriage-mbti", tags=["marriage-mbti"])

# ヘルスチェックエンドポイント
@app.get("/")
async def root():
    return {
        "message": "Marriage MBTI+ API is running",
        "version": "2.0.0",
        "features": [
            "personality-test",
            "marriage-mbti-plus"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "api_version": "2.0.0",
        "features_status": {
            "personality": "active", 
            "marriage_mbti": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)