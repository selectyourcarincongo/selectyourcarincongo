from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime
from enum import Enum
from typing import Optional, List
import re

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class VehicleStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class VehicleCondition(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"

class VehicleType(str, Enum):
    SALE = "sale"
    RENTAL = "rental"

class AccountType(str, Enum):
    SALE = "sale"
    RENTAL = "rental"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    MANUAL_REVIEW = "manual_review"

class PaymentMethod(str, Enum):
    MTN_MOBILE_MONEY = "mtn_mobile_money"
    MANUAL_PROOF = "manual_proof"

# User Models
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str
    account_type: AccountType = AccountType.SALE
    
    @field_validator('phone')
    def validate_phone(cls, v):
        # Remove spaces and dashes
        cleaned = v.replace(" ", "").replace("-", "")
        # Must start with +242 or 242
        if cleaned.startswith("+242"):
            cleaned = cleaned[1:]
        if not cleaned.startswith("242"):
            raise ValueError("Phone must start with +242 or 242")
        # Must be 11-12 digits (242 + 8-9 digits)
        if len(cleaned) not in (11, 12):
            raise ValueError("Invalid phone number length for Congo")
        if not cleaned[3:].isdigit():
            raise ValueError("Phone number must contain only digits after country code")
        return cleaned

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    phone: str
    password_hash: str
    role: UserRole = UserRole.USER
    account_type: AccountType = AccountType.SALE
    payment_status: PaymentStatus = PaymentStatus.PENDING
    registration_fee_paid: bool = False
    posted_vehicles_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    account_type: str
    payment_status: str
    registration_fee_paid: bool
    posted_vehicles_count: int
    created_at: datetime

# Vehicle Models
class VehicleCreate(BaseModel):
    brand: str = Field(..., min_length=2, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1980, le=2026)
    mileage: int = Field(..., ge=0)
    condition: VehicleCondition
    vehicle_type: VehicleType = VehicleType.SALE
    price: float
    registration_plate: Optional[str] = Field(None, max_length=20)
    location: str = Field(..., min_length=3, max_length=100)
    description: str
    phone: str
    images: List[str] = Field(default=[], max_length=8)
    
    @field_validator('price')
    def validate_price(cls, v, info):
        vehicle_type = info.data.get('vehicle_type', VehicleType.SALE)
        if vehicle_type == VehicleType.SALE:
            if v < 800000 or v > 1000000000:
                raise ValueError("Sale price must be between 800,000 and 1,000,000,000 FCFA")
        else:  # RENTAL
            if v < 10000 or v > 15000000:
                raise ValueError("Rental price must be between 10,000 and 15,000,000 FCFA")
        return v
    
    @field_validator('description')
    def validate_description(cls, v):
        if len(v) < 50:
            raise ValueError("Description must be at least 50 characters")
        if len(v) > 2000:
            raise ValueError("Description must not exceed 2000 characters")
        return v
    
    @field_validator('phone')
    def validate_phone(cls, v):
        cleaned = v.replace(" ", "").replace("-", "")
        if cleaned.startswith("+242"):
            cleaned = cleaned[1:]
        if not cleaned.startswith("242"):
            raise ValueError("Phone must start with +242 or 242")
        if len(cleaned) not in (11, 12):
            raise ValueError("Invalid phone number length for Congo")
        return cleaned
    
    @field_validator('images')
    def validate_images(cls, v):
        if len(v) > 8:
            raise ValueError("Maximum 8 images allowed")
        return v

class Vehicle(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    brand: str
    model: str
    year: int
    mileage: int
    condition: VehicleCondition
    vehicle_type: VehicleType = VehicleType.SALE
    price: float
    registration_plate: Optional[str]
    location: str
    description: str
    phone: str
    images: List[str]
    status: VehicleStatus = VehicleStatus.PENDING
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    mileage: Optional[int] = None
    condition: Optional[VehicleCondition] = None
    price: Optional[float] = None
    registration_plate: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    images: Optional[List[str]] = None

# Payment Models
class PaymentInitiate(BaseModel):
    user_id: str
    phone_number: str

class Payment(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    amount: float
    currency: str = "XAF"
    external_id: str
    x_reference_id: Optional[str] = None
    mtn_transaction_id: Optional[str] = None
    payment_method: PaymentMethod
    status: PaymentStatus = PaymentStatus.PENDING
    manual_proof_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class PaymentProofUpload(BaseModel):
    user_id: str
    proof_url: str

# Message Models
class MessageCreate(BaseModel):
    receiver_id: str
    vehicle_id: str
    content: str = Field(..., min_length=1, max_length=1000)

class Message(BaseModel):
    id: str = Field(alias="_id")
    sender_id: str
    receiver_id: str
    vehicle_id: str
    content: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None