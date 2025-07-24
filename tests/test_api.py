import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_recommendation_endpoint():
    response = client.post("/recommend", json={"user_id": "123", "query": "laptop"})
    assert response.status_code == 200
    assert "recommendations" in response.json()
    assert len(response.json()["recommendations"]) > 0

def test_feedback_endpoint():
    response = client.post("/feedback", json={"user_id": "123", "product_name": "Laptop X", "rating": 4})
    assert response.status_code == 200
    assert response.json() == {"status": "Feedback recorded"}
