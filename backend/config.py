from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # MongoDB
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name: str = os.getenv("DB_NAME", "congo_auto_db")
    
    # MTN Mobile Money
    mtn_api_user_id: str = os.getenv("MTN_API_USER_ID", "sandbox_user_id")
    mtn_api_key: str = os.getenv("MTN_API_KEY", "sandbox_api_key")
    mtn_subscription_key: str = os.getenv("MTN_SUBSCRIPTION_KEY", "sandbox_subscription_key")
    mtn_callback_host: str = os.getenv("MTN_CALLBACK_HOST", "http://localhost:8001")
    mtn_target_environment: str = os.getenv("MTN_TARGET_ENVIRONMENT", "sandbox")
    mtn_base_url: str = os.getenv("MTN_BASE_URL", "https://sandbox.momodeveloper.mtn.com")
    
    # Application
    registration_fee_sale_xaf: float = float(os.getenv("REGISTRATION_FEE_SALE_XAF", "3000"))
    registration_fee_rental_xaf: float = float(os.getenv("REGISTRATION_FEE_RENTAL_XAF", "1500"))
    posting_fee_sale_xaf: float = float(os.getenv("POSTING_FEE_SALE_XAF", "3000"))
    posting_fee_rental_xaf: float = float(os.getenv("POSTING_FEE_RENTAL_XAF", "1500"))
    merchant_phone: str = os.getenv("MERCHANT_PHONE", "242068913333")
    merchant_code: str = os.getenv("MERCHANT_CODE", "374575")
    secret_key: str = os.getenv("SECRET_KEY", "congo-auto-secret-key-change-in-production-2025")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    
    # CORS
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")
    
    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()