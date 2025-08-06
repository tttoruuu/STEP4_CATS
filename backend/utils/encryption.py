"""
個人情報暗号化ユーティリティ
婚活アプリで扱う機密情報（個人プロフィール、年収、結婚歴など）を暗号化
"""
from cryptography.fernet import Fernet
import os
import base64
import hashlib
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class DataEncryption:
    """個人情報の暗号化・復号化を管理するクラス"""
    
    def __init__(self):
        """暗号化キーの初期化"""
        # 環境変数から暗号化キーを取得
        encryption_key = os.getenv("ENCRYPTION_KEY")
        
        if not encryption_key:
            # 開発環境用のデフォルトキー生成（本番環境では必ず環境変数を設定）
            if os.getenv("ENV") == "production":
                raise ValueError("本番環境でENCRYPTION_KEYが設定されていません。")
            
            logger.warning("ENCRYPTION_KEY環境変数が未設定。開発用キーを生成します。")
            # 開発用の固定シードから暗号化キーを生成
            seed = "miraim-development-key-2024"
            hashed = hashlib.sha256(seed.encode()).digest()
            encryption_key = base64.urlsafe_b64encode(hashed)
        else:
            # 環境変数のキーが正しい形式か確認
            try:
                encryption_key = encryption_key.encode()
                # Fernetキーの形式チェック
                if len(encryption_key) != 44:  # Base64エンコードされた32バイトキー
                    raise ValueError("ENCRYPTION_KEYの形式が不正です。")
            except Exception as e:
                logger.error(f"暗号化キーの形式エラー: {e}")
                raise
        
        self.cipher = Fernet(encryption_key)
    
    def encrypt_data(self, data: str) -> str:
        """
        文字列データを暗号化
        
        Args:
            data: 暗号化する文字列
        
        Returns:
            暗号化された文字列（Base64エンコード）
        """
        if not data:
            return data
        
        try:
            # 文字列をバイト列に変換して暗号化
            encrypted = self.cipher.encrypt(data.encode())
            # Base64エンコードして文字列として返す
            return encrypted.decode()
        except Exception as e:
            logger.error(f"データ暗号化エラー: {e}")
            raise
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """
        暗号化されたデータを復号化
        
        Args:
            encrypted_data: 暗号化された文字列（Base64エンコード）
        
        Returns:
            復号化された文字列
        """
        if not encrypted_data:
            return encrypted_data
        
        try:
            # Base64文字列をバイト列に変換して復号化
            decrypted = self.cipher.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            logger.error(f"データ復号化エラー: {e}")
            raise
    
    def encrypt_dict(self, data: dict, fields: list) -> dict:
        """
        辞書内の指定フィールドを暗号化
        
        Args:
            data: 暗号化対象の辞書
            fields: 暗号化するフィールドのリスト
        
        Returns:
            暗号化された辞書
        """
        encrypted_data = data.copy()
        for field in fields:
            if field in encrypted_data and encrypted_data[field]:
                encrypted_data[field] = self.encrypt_data(str(encrypted_data[field]))
        return encrypted_data
    
    def decrypt_dict(self, data: dict, fields: list) -> dict:
        """
        辞書内の指定フィールドを復号化
        
        Args:
            data: 復号化対象の辞書
            fields: 復号化するフィールドのリスト
        
        Returns:
            復号化された辞書
        """
        decrypted_data = data.copy()
        for field in fields:
            if field in decrypted_data and decrypted_data[field]:
                decrypted_data[field] = self.decrypt_data(decrypted_data[field])
        return decrypted_data

# グローバルインスタンス
encryption = DataEncryption()

# 暗号化対象のフィールド定義
SENSITIVE_USER_FIELDS = [
    'annual_income',      # 年収
    'marriage_history',    # 結婚歴
    'phone_number',        # 電話番号
    'address',             # 住所
    'occupation_detail',   # 職業詳細
    'family_structure',    # 家族構成
    'health_condition',    # 健康状態
    'financial_status',    # 財務状況
]

SENSITIVE_PROFILE_FIELDS = [
    'ideal_partner_income',     # 理想の相手の年収
    'personal_values',          # 個人的な価値観
    'past_relationship_details', # 過去の恋愛詳細
    'medical_history',          # 医療歴
]