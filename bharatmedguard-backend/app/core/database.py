import asyncio
import copy
import re
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.logging_config import app_logger

class MockAsyncCursor:
    def __init__(self, data: List[Dict[str, Any]], sort_key=None, sort_dir=1, limit_val=None, skip_val=0):
        self.data = copy.deepcopy(data)
        if sort_key:
            self.data.sort(key=lambda x: x.get(sort_key, ""), reverse=(sort_dir == -1))
        if skip_val:
            self.data = self.data[skip_val:]
        if limit_val is not None:
            self.data = self.data[:limit_val]
        self._index = 0

    def sort(self, key_or_list, direction=1):
        if isinstance(key_or_list, list) and len(key_or_list) > 0:
            k, d = key_or_list[0]
            self.data.sort(key=lambda x: x.get(k, ""), reverse=(d == -1))
        elif isinstance(key_or_list, str):
            self.data.sort(key=lambda x: x.get(key_or_list, ""), reverse=(direction == -1))
        return self

    def limit(self, n: int):
        self.data = self.data[:n]
        return self

    def skip(self, n: int):
        self.data = self.data[n:]
        return self

    def __aiter__(self):
        self._index = 0
        return self

    async def __anext__(self):
        if self._index < len(self.data):
            val = self.data[self._index]
            self._index += 1
            return val
        else:
            raise StopAsyncIteration

    async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
        if length is not None:
            return self.data[:length]
        return self.data


class MockAsyncCollection:
    def __init__(self, name: str):
        self.name = name
        self._docs: List[Dict[str, Any]] = []

    def _matches_filter(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True
        for k, v in query.items():
            if k == "$or":
                if not any(self._matches_filter(doc, sub_q) for sub_q in v):
                    return False
            elif isinstance(v, dict):
                doc_val = doc.get(k)
                if "$regex" in v:
                    pattern = v["$regex"]
                    flags = re.IGNORECASE if v.get("$options") == "i" else 0
                    if not (isinstance(doc_val, str) and re.search(pattern, doc_val, flags)):
                        return False
                if "$gte" in v and not (doc_val is not None and doc_val >= v["$gte"]):
                    return False
                if "$lte" in v and not (doc_val is not None and doc_val <= v["$lte"]):
                    return False
                if "$in" in v and doc_val not in v["$in"]:
                    return False
                if "$ne" in v and doc_val == v["$ne"]:
                    return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    async def find_one(self, query: Optional[Dict[str, Any]] = None, sort=None) -> Optional[Dict[str, Any]]:
        query = query or {}
        matches = [d for d in self._docs if self._matches_filter(d, query)]
        if not matches:
            return None
        if sort:
            k, d = sort if isinstance(sort, tuple) else (sort[0][0], sort[0][1])
            matches.sort(key=lambda x: x.get(k, ""), reverse=(d == -1))
        return copy.deepcopy(matches[0])

    def find(self, query: Optional[Dict[str, Any]] = None) -> MockAsyncCursor:
        query = query or {}
        matches = [d for d in self._docs if self._matches_filter(d, query)]
        return MockAsyncCursor(matches)

    async def insert_one(self, doc: Dict[str, Any]):
        new_doc = copy.deepcopy(doc)
        if "_id" not in new_doc:
            new_doc["_id"] = str(len(self._docs) + 1)
        self._docs.append(new_doc)
        class InsertResult:
            inserted_id = new_doc["_id"]
        return InsertResult()

    async def insert_many(self, docs: List[Dict[str, Any]]):
        inserted_ids = []
        for d in docs:
            res = await self.insert_one(d)
            inserted_ids.append(res.inserted_id)
        class InsertManyResult:
            def __init__(self, ids):
                self.inserted_ids = ids
        return InsertManyResult(inserted_ids)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        matched = 0
        modified = 0
        for i, d in enumerate(self._docs):
            if self._matches_filter(d, query):
                matched = 1
                if "$set" in update:
                    self._docs[i].update(update["$set"])
                    modified = 1
                if "$push" in update:
                    for pk, pv in update["$push"].items():
                        if pk not in self._docs[i]:
                            self._docs[i][pk] = []
                        self._docs[i][pk].append(pv)
                        modified = 1
                break
        if matched == 0 and upsert:
            doc_to_insert = copy.deepcopy(query)
            if "$set" in update:
                doc_to_insert.update(update["$set"])
            await self.insert_one(doc_to_insert)
            matched = 1
            modified = 1

        class UpdateResult:
            matched_count = matched
            modified_count = modified
        return UpdateResult()

    async def delete_one(self, query: Dict[str, Any]):
        for i, d in enumerate(self._docs):
            if self._matches_filter(d, query):
                del self._docs[i]
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResult:
            deleted_count = 0
        return DeleteResult()

    async def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        query = query or {}
        return sum(1 for d in self._docs if self._matches_filter(d, query))

    async def create_index(self, keys, **kwargs):
        return "mock_index"


class DatabaseManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.is_real_mongo: bool = False
        self._collections: Dict[str, Any] = {}

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=settings.DB_CONNECT_TIMEOUT_MS
            )
            # Verify server is listening
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_real_mongo = True
            app_logger.info(f"Connected to live MongoDB at {settings.MONGODB_URI} [Database: {settings.DATABASE_NAME}]")
            await self.init_indexes()
        except Exception as e:
            app_logger.warning(f"MongoDB connection failed ({str(e)}). Running in high-performance Async InMemory Database Mode.")
            self.is_real_mongo = False
            self.db = self

    async def init_indexes(self):
        try:
            if self.is_real_mongo:
                await self.db.users.create_index("email", unique=True)
                await self.db.claims.create_index([("claim_id", 1), ("patient_id", 1), ("hospital_id", 1), ("risk_score", -1)])
                await self.db.patients.create_index([("patient_id", 1), ("abha_id", 1), ("aadhaar_hash", 1)])
                await self.db.documents.create_index([("document_id", 1), ("claim_id", 1)])
                await self.db.clinical_records.create_index([("record_id", 1), ("patient_id", 1)])
                await self.db.anomalies.create_index([("anomaly_id", 1), ("source_type", 1), ("severity", 1), ("risk_score", -1)])
                await self.db.investigations.create_index([("case_id", 1), ("status", 1), ("risk_score", -1)])
                await self.db.audit_logs.create_index([("timestamp", -1), ("user", 1), ("action", 1)])
                app_logger.info("MongoDB database indexes initialized successfully.")
        except Exception as e:
            app_logger.warning(f"Index initialization note: {str(e)}")

    def get_collection(self, name: str):
        if self.is_real_mongo and self.db is not self:
            return self.db[name]
        if name not in self._collections:
            self._collections[name] = MockAsyncCollection(name)
        return self._collections[name]

    def __getitem__(self, name: str):
        return self.get_collection(name)

    async def close(self):
        if self.client and self.is_real_mongo:
            self.client.close()
            app_logger.info("MongoDB connection closed.")

db_manager = DatabaseManager()

# Direct collection accessors
def get_db():
    return db_manager

def get_users_col():
    return db_manager.get_collection("users")

def get_patients_col():
    return db_manager.get_collection("patients")

def get_claims_col():
    return db_manager.get_collection("claims")

def get_documents_col():
    return db_manager.get_collection("documents")

def get_clinical_col():
    return db_manager.get_collection("clinical_records")

def get_anomalies_col():
    return db_manager.get_collection("anomalies")

def get_investigations_col():
    return db_manager.get_collection("investigations")

def get_security_events_col():
    return db_manager.get_collection("security_events")

def get_audit_logs_col():
    return db_manager.get_collection("audit_logs")
