import pytest
import asyncio
from scripts.seed_database import seed_initial_records
from app.core.database import db_manager

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(seed_initial_records())
    yield
    loop.close()
