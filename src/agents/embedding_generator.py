import os
from openai import OpenAI
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class EmbeddingGeneratorAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "text-embedding-3-small"

    def generate_embedding(self, text: str) -> List[float]:
        text = text.replace("\n", " ")
        try:
            return self.client.embeddings.create(input=[text], model=self.model).data[0].embedding
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {str(e)}")

    def fine_tune(self, feedback_data: List[Dict]):
        # Placeholder for fine-tuning logic
        pass
