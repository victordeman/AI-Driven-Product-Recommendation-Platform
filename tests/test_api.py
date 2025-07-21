import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_recommendation_endpoint():
    response = client.post("/recommend", json={"user_id": "123", "query": "laptop"})
    assert response.status_code == 200
    assert "recommendations" in response.json()
