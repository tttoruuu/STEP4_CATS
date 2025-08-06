"""
統一的なエラーハンドリングミドルウェア
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
import logging
import traceback
from typing import Union

logger = logging.getLogger(__name__)

class AppException(Exception):
    """アプリケーション固有の例外基底クラス"""
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(AppException):
    """バリデーションエラー"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, details)

class AuthenticationError(AppException):
    """認証エラー"""
    def __init__(self, message: str = "認証に失敗しました"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class AuthorizationError(AppException):
    """認可エラー"""
    def __init__(self, message: str = "このリソースへのアクセス権限がありません"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)

class NotFoundError(AppException):
    """リソース不在エラー"""
    def __init__(self, resource: str = "リソース"):
        super().__init__(f"{resource}が見つかりません", status.HTTP_404_NOT_FOUND)

class ConflictError(AppException):
    """競合エラー"""
    def __init__(self, message: str = "データの競合が発生しました"):
        super().__init__(message, status.HTTP_409_CONFLICT)

class ExternalServiceError(AppException):
    """外部サービスエラー（OpenAI APIなど）"""
    def __init__(self, service: str, message: str):
        super().__init__(f"{service}でエラーが発生しました: {message}", status.HTTP_503_SERVICE_UNAVAILABLE)

async def error_handler_middleware(request: Request, call_next):
    """グローバルエラーハンドリングミドルウェア"""
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        return await handle_exception(request, exc)

async def handle_exception(request: Request, exc: Exception) -> JSONResponse:
    """例外を処理して統一的なJSONレスポンスを返す"""
    
    # アプリケーション固有の例外
    if isinstance(exc, AppException):
        logger.warning(f"App exception: {exc.message} - Details: {exc.details}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.message,
                    "type": exc.__class__.__name__,
                    "details": exc.details
                }
            }
        )
    
    # FastAPI/Starletteの例外
    elif isinstance(exc, StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.detail,
                    "type": "HTTPException"
                }
            }
        )
    
    # バリデーションエラー
    elif isinstance(exc, RequestValidationError):
        errors = []
        for error in exc.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in error["loc"][1:]),
                "message": error["msg"],
                "type": error["type"]
            })
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "message": "入力データの検証に失敗しました",
                    "type": "ValidationError",
                    "details": {"validation_errors": errors}
                }
            }
        )
    
    # データベースエラー
    elif isinstance(exc, SQLAlchemyError):
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "データベースエラーが発生しました",
                    "type": "DatabaseError"
                }
            }
        )
    
    # その他の予期しないエラー
    else:
        logger.error(f"Unexpected error: {str(exc)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "内部サーバーエラーが発生しました",
                    "type": "InternalServerError"
                }
            }
        )

def register_exception_handlers(app):
    """FastAPIアプリにエラーハンドラーを登録"""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return await handle_exception(request, exc)
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return await handle_exception(request, exc)
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return await handle_exception(request, exc)
    
    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(request: Request, exc: SQLAlchemyError):
        return await handle_exception(request, exc)
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        return await handle_exception(request, exc)