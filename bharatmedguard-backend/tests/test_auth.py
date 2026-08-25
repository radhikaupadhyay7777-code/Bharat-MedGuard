import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["api"] == "operational"

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={
            "email": "investigator@bharatmedguard.demo",
            "password": "demo_password_2026"
        })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "INVESTIGATOR"
    assert data["name"] == "Radhika Upadhyay"

@pytest.mark.asyncio
async def test_login_invalid_password():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={
            "email": "investigator@bharatmedguard.demo",
            "password": "wrong_password"
        })
    assert response.status_code == 401
    data = response.json()
    assert "error" in data or "detail" in data
