from src.agents.embedding_generator import EmbeddingGeneratorAgent
from typing import List, Dict
import os
from dotenv import load_dotenv
import logging
import psycopg2

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

class RecommendationEngineAgent:
    def __init__(self):
        try:
            self.embedding_generator = EmbeddingGeneratorAgent()
            self.conn_params = {
                "dbname": "recommendation_db",
                "host": "localhost",
                "password": os.getenv("POSTGRES_PASSWORD"),
                "port": 5432,
                "user": os.getenv("POSTGRES_USER")
            }
        except Exception as e:
            logger.error(f"Failed to initialize RecommendationEngineAgent: {str(e)}")
            raise RuntimeError(f"Failed to initialize RecommendationEngineAgent: {str(e)}")

    def recommend(self, query: str, vendor_id: str) -> Dict:
        try:
            query_embedding = self.embedding_generator.generate_embedding(query)
            logger.debug(f"Generated query embedding: {query_embedding[:5]}...")
            
            with psycopg2.connect(**self.conn_params) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT id, name, description
                        FROM products
                        ORDER BY embedding <-> CAST(%s AS vector)
                        LIMIT 3
                        """,
                        (query_embedding,)
                    )
                    results = cursor.fetchall()
            
            recommendations = [{"id": row[0], "name": row[1]} for row in results]
            narrative = (
                f"Based on your selection of '{query}', we recommend the following products: "
                f"{', '.join([r['name'] for r in recommendations])}. "
                f"These items are closely related to your choice, offering similar features and functionality."
            )
            logger.debug(f"Recommendations: {recommendations}, Narrative: {narrative}")
            return {"recommendations": recommendations, "narrative": narrative}
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise RuntimeError(f"Error generating recommendations: {str(e)}")