import asyncpg
from pgvector.asyncpg import register_vector
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def insert_sample_data(conn):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    laptop_x_embedding = model.encode("High-performance laptop").tolist()
    laptop_y_embedding = model.encode("Budget-friendly laptop").tolist()
    
    await conn.execute("""
        INSERT INTO products (name, description, embedding)
        VALUES ($1, $2, $3), ($4, $5, $6)
    """, "Laptop X", "High-performance laptop", laptop_x_embedding,
         "Laptop Y", "Budget-friendly laptop", laptop_y_embedding)

async def init_db():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    await register_vector(conn)
    await conn.execute("DROP TABLE IF EXISTS products")
    await conn.execute("""
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            embedding VECTOR(384)
        )
    """)
    await insert_sample_data(conn)
    await conn.close()

if __name__ == "__main__":
    asyncio.run(init_db())