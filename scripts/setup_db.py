import os
from dotenv import load_dotenv
from llama_index.vector_stores.postgres import PGVectorStore
from sentence_transformers import SentenceTransformer
import logging
import psycopg2

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

def setup_database():
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        conn_params = {
            "dbname": "recommendation_db",
            "host": "localhost",
            "password": os.getenv("POSTGRES_PASSWORD"),
            "port": 5432,
            "user": os.getenv("POSTGRES_USER")
        }

        products = [
            {"id": 1, "name": "Laptop X", "description": "High-performance laptop for professionals"},
            {"id": 2, "name": "Laptop Y", "description": "Budget-friendly laptop for students"},
            {"id": 3, "name": "Smartphone Z", "description": "Latest 5G smartphone with advanced camera"},
            {"id": 4, "name": "Tablet A", "description": "Portable tablet for entertainment and work"},
            {"id": 5, "name": "Headphones B", "description": "Noise-canceling wireless headphones"},
            {"id": 6, "name": "Smartwatch C", "description": "Fitness tracking smartwatch with heart rate monitor"},
        ]

        with psycopg2.connect(**conn_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM products")
                for product in products:
                    embedding = model.encode(product["description"]).tolist()
                    cursor.execute(
                        """
                        INSERT INTO products (id, name, description, embedding)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (product["id"], product["name"], product["description"], embedding)
                    )
                conn.commit()
        logger.info("Successfully populated products table")
    except Exception as e:
        logger.error(f"Error setting up database: {str(e)}")
        raise

if __name__ == "__main__":
    setup_database()
