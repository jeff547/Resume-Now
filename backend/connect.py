import asyncio
import asyncpg
from azure.identity import DefaultAzureCredential

async def connect():
    PGHOST="resumenow-db.postgres.database.azure.com"
    PGUSER="jl3925@sas.rutgers.edu"
    PGPORT=5432
    PGDATABASE="postgres"
    try:
        print("Retrieving access token from azure...")
        credential = DefaultAzureCredential()
        token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default").token
        print(f"Token: {token}")
        print("⏳ Connecting to database...")
        conn = await asyncpg.connect(
            host=PGHOST,
            port=PGPORT,
            user=PGUSER,
            password=token,  
            database=PGDATABASE,
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