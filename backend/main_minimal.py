from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import personality
import logging

# 最小限のFastAPIアプリケーション（性格診断専用）
app = FastAPI(title="Personality Test API", version="1.0.0")

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

# 性格診断ルーターを追加
app.include_router(personality.router, prefix="/api/personality", tags=["personality"])

# ヘルスチェックエンドポイント
@app.get("/")
async def root():
    return {"message": "Personality Test API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)