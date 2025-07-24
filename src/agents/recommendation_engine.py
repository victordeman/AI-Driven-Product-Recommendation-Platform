from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PostgresVectorStore
from typing import List, Dict

class RecommendationEngineAgent:
    def __init__(self):
        self.vector_store = PostgresVectorStore.from_params(
            database="recommendation_db",
            host="localhost",
            password="pass",
            port=5432,
            user="user",
            table_name="products",
            embed_dim=384
        )
        self.index = VectorStoreIndex.from_vector_store(self.vector_store)

    async def get_recommendations(self, query: str, top_k: int = 2) -> List[Dict]:
        query_engine = self.index.as_query_engine(similarity_top_k=top_k)
        response = query_engine.query(query)
        return [{"name": node.metadata["name"]} for node in response.source_nodes]
