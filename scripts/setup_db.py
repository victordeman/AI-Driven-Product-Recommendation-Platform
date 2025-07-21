import asyncpg
from pgvector.asyncpg import register_vector

async def init_db():
    conn = await asyncpg.connect("postgresql://user:pass@localhost/db")
    await conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
    await register_vector(conn)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT,
            description TEXT,
            embedding VECTOR(384)
        )
    """)
    await conn.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
