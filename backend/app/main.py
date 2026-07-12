from fastapi import FastAPI

from app.api.database import router as database_router
from app.api.table import router as table_router
from app.api.generator import router as generator_router

app = FastAPI(
    title="DataStreamX API",
    version="1.0.0"
)

app.include_router(database_router)
app.include_router(table_router)
app.include_router(generator_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to DataStreamX"
    }