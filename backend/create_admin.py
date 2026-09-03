import asyncio
import os
from datetime import datetime

from database import connect_to_mongo, close_mongo_connection, get_database
from auth import get_password_hash
from models import UserRole, AccountType, PaymentStatus


async def main():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@scic.com").strip().lower()
    admin_password = os.getenv("ADMIN_PASSWORD", "").strip()

    if not admin_password:
        print("ADMIN_PASSWORD is not set; skipping admin bootstrap.")
        return

    admin_name = os.getenv("ADMIN_NAME", "SCIC Admin").strip()
    admin_phone = os.getenv("ADMIN_PHONE", "242000000000").strip()

    await connect_to_mongo()
    try:
        db = get_database()
        password_hash = get_password_hash(admin_password)

        existing = await db["users"].find_one({"email": admin_email})

        if existing:
            await db["users"].update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "name": admin_name,
                        "password_hash": password_hash,
                        "role": UserRole.ADMIN.value,
                        "account_type": AccountType.SALE.value,
                        "payment_status": PaymentStatus.COMPLETED.value,
                        "registration_fee_paid": True,
                    }
                },
            )
            print(f"Admin account updated: {admin_email}")
        else:
            await db["users"].insert_one(
                {
                    "_id": __import__("uuid").uuid4().hex,
                    "name": admin_name,
                    "email": admin_email,
                    "phone": admin_phone,
                    "password_hash": password_hash,
                    "role": UserRole.ADMIN.value,
                    "account_type": AccountType.SALE.value,
                    "payment_status": PaymentStatus.COMPLETED.value,
                    "registration_fee_paid": True,
                    "posted_vehicles_count": 0,
                    "created_at": datetime.utcnow(),
                }
            )
            print(f"Admin account created: {admin_email}")
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())
