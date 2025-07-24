import asyncpg
from pgvector.asyncpg import register_vector
from sentence_transformers import SentenceTransformer

async def insert_sample_data():
    model = SentenceTransformer('all-MiniLM-L6-v2')
    laptop_x_embedding = model.encode("High-performance laptop").tolist()
    laptop_y_embedding = model.encode("Budget-friendly laptop").tolist()
    
    conn = await asyncpg.connect("postgresql://user:pass@localhost:5432/recommendation_db")
    await conn.execute("""
        INSERT INTO products (name, description, embedding)
        VALUES ($1, $2, $3), ($4, $5, $6)
    """, "Laptop X", "High-performance laptop", laptop_x_embedding,
         "Laptop Y", "Budget-friendly laptop", laptop_y_embedding)
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
