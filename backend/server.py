from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import os

from models import (
    UserCreate, UserLogin, Token, UserResponse, User, UserRole,
    VehicleCreate, Vehicle, VehicleUpdate, VehicleStatus,
    PaymentInitiate, Payment, PaymentStatus, PaymentMethod, PaymentProofUpload,
    MessageCreate, Message
)
from database import connect_to_mongo, close_mongo_connection, get_database
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_active_user, get_current_admin_user
)
from config import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="Congo Auto API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router with /api prefix
api_router = APIRouter(prefix="/api")

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db["users"].find_one({"$or": [{"email": user.email}, {"phone": user.phone}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    # Create user
    user_dict = user.model_dump()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    user_dict["role"] = UserRole.USER
    user_dict["payment_status"] = PaymentStatus.PENDING
    user_dict["registration_fee_paid"] = False
    user_dict["posted_vehicles_count"] = 0
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db["users"].insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    created_user = User(**user_dict)
    user_response = UserResponse(
        id=created_user.id,
        name=created_user.name,
        email=created_user.email,
        phone=created_user.phone,
        role=created_user.role.value,
        account_type=created_user.account_type.value,
        payment_status=created_user.payment_status.value,
        registration_fee_paid=created_user.registration_fee_paid,
        posted_vehicles_count=created_user.posted_vehicles_count,
        created_at=created_user.created_at
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    """Login user"""
    db = get_database()
    
    user = await db["users"].find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user["_id"] = str(user["_id"])
    access_token = create_access_token(data={"sub": user_login.email})
    
    user_obj = User(**user)
    user_response = UserResponse(
        id=user_obj.id,
        name=user_obj.name,
        email=user_obj.email,
        phone=user_obj.phone,
        role=user_obj.role.value,
        account_type=user_obj.account_type.value,
        payment_status=user_obj.payment_status.value,
        registration_fee_paid=user_obj.registration_fee_paid,
        posted_vehicles_count=user_obj.posted_vehicles_count,
        created_at=user_obj.created_at
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        role=current_user.role.value,
        account_type=current_user.account_type.value,
        payment_status=current_user.payment_status.value,
        registration_fee_paid=current_user.registration_fee_paid,
        posted_vehicles_count=current_user.posted_vehicles_count,
        created_at=current_user.created_at
    )

# ============== VEHICLE ENDPOINTS ==============

@api_router.get("/vehicles/public")
async def get_public_vehicles(
    status: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    condition: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all approved vehicles (public - no auth required)"""
    db = get_database()
    
    # Build query - only approved vehicles for public
    query = {"status": VehicleStatus.APPROVED}
    
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if min_price is not None:
        query.setdefault("price", {})["$gte"] = min_price
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if condition:
        query["condition"] = condition
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    # Get total count
    total = await db["vehicles"].count_documents(query)
    
    # Get vehicles
    cursor = db["vehicles"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    vehicles = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for vehicle in vehicles:
        vehicle["_id"] = str(vehicle["_id"])
    
    return {
        "total": total,
        "vehicles": vehicles,
        "skip": skip,
        "limit": limit
    }

@api_router.get("/vehicles/{vehicle_id}")
async def get_vehicle_details(vehicle_id: str):
    """Get vehicle details (public - no auth required)"""
    db = get_database()
    
    vehicle = await db["vehicles"].find_one({"_id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Increment views
    await db["vehicles"].update_one({"_id": vehicle_id}, {"$inc": {"views": 1}})
    
    vehicle["_id"] = str(vehicle["_id"])
    return vehicle

@api_router.post("/vehicles", status_code=201)
async def create_vehicle(
    vehicle: VehicleCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new vehicle listing (requires payment for registration and per post after first)"""
    db = get_database()
    
    # Check if user has paid registration fee
    if not current_user.registration_fee_paid:
        raise HTTPException(
            status_code=403,
            detail="You must pay the registration fee before posting vehicles"
        )
    
    # Check if user needs to pay for this post (after first free post)
    if current_user.posted_vehicles_count >= 1:
        # Check if there's a completed payment for posting
        recent_posting_payment = await db["payments"].find_one({
            "user_id": current_user.id,
            "payment_purpose": "posting",
            "status": PaymentStatus.COMPLETED,
            "created_at": {"$gte": datetime.utcnow() - timedelta(hours=1)}  # Within last hour
        })
        
        if not recent_posting_payment:
            raise HTTPException(
                status_code=403,
                detail="You must pay the posting fee for additional vehicles. Please complete payment first."
            )
    
    # Validate vehicle type matches user account type
    if vehicle.vehicle_type.value != current_user.account_type.value:
        raise HTTPException(
            status_code=400,
            detail=f"Your account type is {current_user.account_type.value}. You can only post {current_user.account_type.value} vehicles."
        )
    
    # Create vehicle
    vehicle_dict = vehicle.model_dump()
    vehicle_dict["_id"] = str(uuid.uuid4())
    vehicle_dict["user_id"] = current_user.id
    vehicle_dict["status"] = VehicleStatus.PENDING
    vehicle_dict["views"] = 0
    vehicle_dict["created_at"] = datetime.utcnow()
    vehicle_dict["updated_at"] = datetime.utcnow()
    
    await db["vehicles"].insert_one(vehicle_dict)
    
    # Increment user's posted_vehicles_count
    await db["users"].update_one(
        {"_id": current_user.id},
        {"$inc": {"posted_vehicles_count": 1}}
    )
    
    return {"message": "Vehicle created successfully. Awaiting admin approval.", "vehicle_id": vehicle_dict["_id"]}

@api_router.get("/vehicles/user/me")
async def get_my_vehicles(current_user: User = Depends(get_current_active_user)):
    """Get current user's vehicles"""
    db = get_database()
    
    cursor = db["vehicles"].find({"user_id": current_user.id}).sort("created_at", -1)
    vehicles = await cursor.to_list(length=100)
    
    for vehicle in vehicles:
        vehicle["_id"] = str(vehicle["_id"])
    
    return vehicles

@api_router.put("/vehicles/{vehicle_id}")
async def update_vehicle(
    vehicle_id: str,
    vehicle_update: VehicleUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update vehicle"""
    db = get_database()
    
    # Check if vehicle exists and belongs to user
    vehicle = await db["vehicles"].find_one({"_id": vehicle_id, "user_id": current_user.id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found or unauthorized")
    
    # Update only provided fields
    update_data = {k: v for k, v in vehicle_update.model_dump().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        update_data["status"] = VehicleStatus.PENDING  # Reset to pending after update
        
        await db["vehicles"].update_one({"_id": vehicle_id}, {"$set": update_data})
    
    return {"message": "Vehicle updated successfully"}

@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, current_user: User = Depends(get_current_active_user)):
    """Delete vehicle"""
    db = get_database()
    
    # Check if vehicle exists and belongs to user
    vehicle = await db["vehicles"].find_one({"_id": vehicle_id, "user_id": current_user.id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found or unauthorized")
    
    await db["vehicles"].delete_one({"_id": vehicle_id})
    
    return {"message": "Vehicle deleted successfully"}

# ============== PAYMENT ENDPOINTS ==============

@api_router.post("/payment/initiate")
async def initiate_payment(
    payment_data: PaymentInitiate,
    current_user: User = Depends(get_current_active_user)
):
    """Initiate payment (MTN Mobile Money - Sandbox)"""
    db = get_database()
    
    # Determine payment amount based on purpose and account type
    if payment_data.payment_purpose == "registration":
        if current_user.account_type == AccountType.SALE:
            amount = settings.registration_fee_sale_xaf
        else:  # RENTAL
            amount = settings.registration_fee_rental_xaf
            
        # Check if user already has a completed registration payment
        existing_payment = await db["payments"].find_one({
            "user_id": current_user.id,
            "payment_purpose": "registration",
            "status": PaymentStatus.COMPLETED
        })
        
        if existing_payment:
            raise HTTPException(status_code=400, detail="Registration fee already paid")
    else:  # posting
        if current_user.account_type == AccountType.SALE:
            amount = settings.posting_fee_sale_xaf
        else:  # RENTAL
            amount = settings.posting_fee_rental_xaf
    
    # Create payment record
    external_id = f"scic_{payment_data.payment_purpose}_{current_user.id}_{int(datetime.utcnow().timestamp())}"
    x_reference_id = str(uuid.uuid4())
    
    payment_dict = {
        "_id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "amount": amount,
        "currency": "XAF",
        "payment_purpose": payment_data.payment_purpose,
        "external_id": external_id,
        "x_reference_id": x_reference_id,
        "payment_method": PaymentMethod.MTN_MOBILE_MONEY,
        "status": PaymentStatus.PENDING,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db["payments"].insert_one(payment_dict)
    
    # In sandbox mode, return instructions
    return {
        "message": "Payment initiated",
        "payment_id": payment_dict["_id"],
        "external_id": external_id,
        "x_reference_id": x_reference_id,
        "amount": amount,
        "currency": "XAF",
        "purpose": payment_data.payment_purpose,
        "account_type": current_user.account_type.value,
        "merchant_phone": settings.merchant_phone,
        "merchant_code": settings.merchant_code,
        "instructions": f"Please transfer {amount} FCFA via MTN Mobile Money to +{settings.merchant_phone} or use Merchant Code: {settings.merchant_code}. Then upload proof of payment.",
        "status": "pending"
    }

@api_router.post("/payment/manual-proof")
async def upload_payment_proof(
    proof_data: PaymentProofUpload,
    current_user: User = Depends(get_current_active_user)
):
    """Upload manual proof of payment"""
    db = get_database()
    
    # Find pending payment
    payment = await db["payments"].find_one({
        "user_id": current_user.id,
        "status": PaymentStatus.PENDING
    })
    
    payment_purpose = payment.get("payment_purpose", "registration") if payment else "registration"
    
    if not payment:
        # Create new payment record for manual proof
        # Determine amount based on account type
        if payment_purpose == "registration":
            amount = settings.registration_fee_sale_xaf if current_user.account_type == AccountType.SALE else settings.registration_fee_rental_xaf
        else:
            amount = settings.posting_fee_sale_xaf if current_user.account_type == AccountType.SALE else settings.posting_fee_rental_xaf
            
        payment_dict = {
            "_id": str(uuid.uuid4()),
            "user_id": current_user.id,
            "amount": amount,
            "currency": "XAF",
            "payment_purpose": payment_purpose,
            "external_id": f"manual_{payment_purpose}_{current_user.id}_{int(datetime.utcnow().timestamp())}",
            "payment_method": PaymentMethod.MANUAL_PROOF,
            "status": PaymentStatus.MANUAL_REVIEW,
            "manual_proof_url": proof_data.proof_url,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db["payments"].insert_one(payment_dict)
    else:
        # Update existing payment
        await db["payments"].update_one(
            {"_id": payment["_id"]},
            {
                "$set": {
                    "manual_proof_url": proof_data.proof_url,
                    "status": PaymentStatus.MANUAL_REVIEW,
                    "payment_method": PaymentMethod.MANUAL_PROOF,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    return {"message": "Payment proof uploaded successfully. Awaiting admin verification."}

@api_router.get("/payment/status")
async def get_payment_status(current_user: User = Depends(get_current_active_user)):
    """Get payment status for current user"""
    db = get_database()
    
    payment = await db["payments"].find_one({"user_id": current_user.id})
    
    if not payment:
        return {"status": "no_payment", "message": "No payment record found"}
    
    payment["_id"] = str(payment["_id"])
    return payment

# ============== ADMIN ENDPOINTS ==============

@api_router.get("/admin/vehicles")
async def admin_get_all_vehicles(
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get all vehicles"""
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    
    total = await db["vehicles"].count_documents(query)
    
    cursor = db["vehicles"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    vehicles = await cursor.to_list(length=limit)
    
    for vehicle in vehicles:
        vehicle["_id"] = str(vehicle["_id"])
    
    return {"total": total, "vehicles": vehicles}

@api_router.put("/admin/vehicles/{vehicle_id}/approve")
async def admin_approve_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Approve vehicle"""
    db = get_database()
    
    result = await db["vehicles"].update_one(
        {"_id": vehicle_id},
        {"$set": {"status": VehicleStatus.APPROVED, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return {"message": "Vehicle approved"}

@api_router.put("/admin/vehicles/{vehicle_id}/reject")
async def admin_reject_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Reject vehicle"""
    db = get_database()
    
    result = await db["vehicles"].update_one(
        {"_id": vehicle_id},
        {"$set": {"status": VehicleStatus.REJECTED, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return {"message": "Vehicle rejected"}

@api_router.get("/admin/users")
async def admin_get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get all users"""
    db = get_database()
    
    total = await db["users"].count_documents({})
    
    cursor = db["users"].find({}).sort("created_at", -1).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
    
    return {"total": total, "users": users}

@api_router.get("/admin/payments")
async def admin_get_all_payments(
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get all payments"""
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    
    total = await db["payments"].count_documents(query)
    
    cursor = db["payments"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    payments = await cursor.to_list(length=limit)
    
    for payment in payments:
        payment["_id"] = str(payment["_id"])
    
    return {"total": total, "payments": payments}

@api_router.put("/admin/payments/{payment_id}/approve")
async def admin_approve_payment(
    payment_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Approve payment"""
    db = get_database()
    
    payment = await db["payments"].find_one({"_id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Update payment status
    await db["payments"].update_one(
        {"_id": payment_id},
        {"$set": {"status": PaymentStatus.COMPLETED, "updated_at": datetime.utcnow()}}
    )
    
    # Update user status based on payment purpose
    if payment.get("payment_purpose") == "registration":
        await db["users"].update_one(
            {"_id": payment["user_id"]},
            {"$set": {
                "payment_status": PaymentStatus.COMPLETED,
                "registration_fee_paid": True
            }}
        )
    
    return {"message": "Payment approved"}

@api_router.put("/admin/payments/{payment_id}/reject")
async def admin_reject_payment(
    payment_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Reject payment"""
    db = get_database()
    
    payment = await db["payments"].find_one({"_id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    await db["payments"].update_one(
        {"_id": payment_id},
        {"$set": {"status": PaymentStatus.FAILED, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Payment rejected"}

@api_router.get("/admin/stats")
async def admin_get_stats(current_user: User = Depends(get_current_admin_user)):
    """Admin: Get dashboard statistics"""
    db = get_database()
    
    total_users = await db["users"].count_documents({})
    total_vehicles = await db["vehicles"].count_documents({})
    pending_vehicles = await db["vehicles"].count_documents({"status": VehicleStatus.PENDING})
    approved_vehicles = await db["vehicles"].count_documents({"status": VehicleStatus.APPROVED})
    
    total_payments = await db["payments"].count_documents({})
    completed_payments = await db["payments"].count_documents({"status": PaymentStatus.COMPLETED})
    pending_payments = await db["payments"].count_documents({"status": PaymentStatus.MANUAL_REVIEW})
    
    # Calculate total revenue
    revenue_pipeline = [
        {"$match": {"status": PaymentStatus.COMPLETED}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_result = await db["payments"].aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "users": {
            "total": total_users
        },
        "vehicles": {
            "total": total_vehicles,
            "pending": pending_vehicles,
            "approved": approved_vehicles
        },
        "payments": {
            "total": total_payments,
            "completed": completed_payments,
            "pending": pending_payments
        },
        "revenue": {
            "total": total_revenue,
            "currency": "XAF"
        }
    }

# ============== MESSAGE ENDPOINTS ==============

@api_router.post("/messages")
async def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Send a message"""
    db = get_database()
    
    message_dict = message.model_dump()
    message_dict["_id"] = str(uuid.uuid4())
    message_dict["sender_id"] = current_user.id
    message_dict["read"] = False
    message_dict["created_at"] = datetime.utcnow()
    
    await db["messages"].insert_one(message_dict)
    
    return {"message": "Message sent successfully"}

@api_router.get("/messages/inbox")
async def get_inbox(current_user: User = Depends(get_current_active_user)):
    """Get received messages"""
    db = get_database()
    
    cursor = db["messages"].find({"receiver_id": current_user.id}).sort("created_at", -1)
    messages = await cursor.to_list(length=100)
    
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    
    return messages

@api_router.get("/messages/sent")
async def get_sent_messages(current_user: User = Depends(get_current_active_user)):
    """Get sent messages"""
    db = get_database()
    
    cursor = db["messages"].find({"sender_id": current_user.id}).sort("created_at", -1)
    messages = await cursor.to_list(length=100)
    
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    
    return messages

@api_router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Mark message as read"""
    db = get_database()
    
    result = await db["messages"].update_one(
        {"_id": message_id, "receiver_id": current_user.id},
        {"$set": {"read": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Message marked as read"}

# Include router
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Congo Auto API - Vehicle Marketplace for Congo"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "congo-auto-api"}
