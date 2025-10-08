import asyncio
import asyncpg

async def connect():
    try:
        print("⏳ Connecting to database...")
        conn = await asyncpg.connect(
            user="jeff547@resumenow-db",
            password="H78t9gi9!0",
            database="postgres",
            host="resumenow-db.postgres.database.azure.com",
            port=5432,
            ssl="require"
        )
        print("✅ Connected successfully!")
        
        # Optional test query
        result = await conn.fetch("SELECT current_database(), current_user;")
        print("📊 Query result:", result)
        
        await conn.close()
        print("🔒 Connection closed.")
    except Exception as e:
        print("❌ Connection failed:", e)

asyncio.run(connect())