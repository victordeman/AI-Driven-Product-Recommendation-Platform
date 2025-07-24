import asyncpg
from pgvector.asyncpg import register_vector

async def insert_sample_data():
    conn = await asyncpg.connect("postgresql://user:pass@localhost:5432/recommendation_db")
    await conn.execute("""
        INSERT INTO products (name, description, embedding)
        VALUES ('Laptop X', 'High-performance laptop', '[0.1,0.2,0.3,0.0,0.0,0.0,...,0.0]'),
               ('Laptop Y', 'Budget-friendly laptop', '[0.3,0.4,0.5,0.0,0.0,0.0,...,0.0]')
    """)
    await conn.close()

async def init_db():
    conn = await asyncpg.connect("postgresql://user:pass@localhost:5432/recommendation_db")
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
    await insert_sample_data()
    await conn.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
