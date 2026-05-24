from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_root_route():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "AI-Driven Product Recommendation Platform API is running"
    assert data["docs"] == "/docs"
    assert data["health"] == "/health"

def test_health_route():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
