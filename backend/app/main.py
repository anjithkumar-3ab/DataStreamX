from fastapi import FastAPI

from app.api.database import router as database_router
from app.api.table import router as table_router
from app.api.generator import router as generator_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DataStreamX API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router)
app.include_router(table_router)
app.include_router(generator_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to DataStreamX"
    }