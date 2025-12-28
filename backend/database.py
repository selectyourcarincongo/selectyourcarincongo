from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import get_settings

settings = get_settings()

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.mongo_url)
    db_instance.db = db_instance.client[settings.db_name]
    
    # Create indexes
    await db_instance.db["users"].create_index("email", unique=True)
    await db_instance.db["users"].create_index("phone", unique=True)
    await db_instance.db["vehicles"].create_index("user_id")
    await db_instance.db["vehicles"].create_index("status")
    await db_instance.db["vehicles"].create_index("created_at")
    await db_instance.db["payments"].create_index("user_id")
    await db_instance.db["payments"].create_index("external_id", unique=True)
    await db_instance.db["messages"].create_index("sender_id")
    await db_instance.db["messages"].create_index("receiver_id")
    
    print("Connected to MongoDB")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection")

def get_database() -> AsyncIOMotorDatabase:
    return db_instance.db