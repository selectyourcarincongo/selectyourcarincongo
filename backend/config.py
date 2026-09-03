from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # Application Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # MongoDB
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name: str = os.getenv("DB_NAME", "congo_auto_db")
    
    # MTN Mobile Money
    mtn_api_user_id: str = os.getenv("MTN_API_USER_ID", "")
    mtn_api_key: str = os.getenv("MTN_API_KEY", "")
    mtn_subscription_key: str = os.getenv("MTN_SUBSCRIPTION_KEY", "")
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
    
    # Security - REQUIRED in production
    secret_key: str = os.getenv("SECRET_KEY", "")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    
    # CORS - Restrict to specific origins in production
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    
    class Config:
        env_file = ".env"
    
    def validate_settings(self):
        """Validate critical settings on startup"""
        if self.environment == "production":
            if not self.secret_key or self.secret_key == "":
                raise ValueError("SECRET_KEY is required in production")
            if self.cors_origins == "*":
                raise ValueError("CORS_ORIGINS cannot be '*' in production. Specify exact domains.")
            if not self.mtn_api_key or self.mtn_api_key == "":
                raise ValueError("MTN_API_KEY is required for production payment processing")

@lru_cache
def get_settings():
    settings = Settings()
    settings.validate_settings()
    return settings
