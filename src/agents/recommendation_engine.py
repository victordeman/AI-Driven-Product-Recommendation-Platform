from llama_index.vector_stores.postgres import PGVectorStore
from src.agents.embedding_generator import EmbeddingGeneratorAgent
from typing import List, Dict
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

class RecommendationEngineAgent:
    def __init__(self):
        try:
            self.embedding_generator = EmbeddingGeneratorAgent()
            self.vector_store = PGVectorStore.from_params(
                database="recommendation_db",
                host="localhost",
                password=os.getenv("POSTGRES_PASSWORD"),
                port=5432,
                user=os.getenv("POSTGRES_USER"),
                table_name="products",
                embed_dim=384  # Matches all-MiniLM-L6-v2 embedding size
            )
        except Exception as e:
            logger.error(f"Failed to initialize RecommendationEngineAgent: {str(e)}")
            raise RuntimeError(f"Failed to initialize RecommendationEngineAgent: {str(e)}")

    def recommend(self, query: str, user_id: str) -> List[Dict]:
        try:
            query_embedding = self.embedding_generator.generate_embedding(query)
            logger.debug(f"Generated query embedding: {query_embedding[:5]}...")  # Log first 5 elements
            # Placeholder for vector search logic
            recommendations = [
                {"id": 1, "name": "Laptop X"},
                {"id": 2, "name": "Laptop Y"}
            ]
            logger.debug(f"Recommendations: {recommendations}")
            return recommendations
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise RuntimeError(f"Error generating recommendations: {str(e)}")