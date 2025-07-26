from sentence_transformers import SentenceTransformer
from typing import List, Dict

class EmbeddingGeneratorAgent:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def generate_embedding(self, text: str) -> List[float]:
        return self.model.encode(text).tolist()

    def fine_tune(self, feedback_data: List[Dict]):
        # Placeholder for fine-tuning logic
        pass