from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class EmbeddingGeneratorAgent:
    def __init__(self):
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.error(f"Error initializing embedding model: {str(e)}")
            raise

    def generate_embedding(self, text: str):
        try:
            embedding = self.model.encode(text)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
