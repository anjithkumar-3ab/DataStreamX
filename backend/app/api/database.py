from fastapi import APIRouter
from app.database.sqlite import SQLiteManager

router = APIRouter()


@router.post("/database/create")
def create_database(database_name: str):

    db = SQLiteManager(database_name)

    result = db.create_database()

    return result

@router.post("/database/connect")
def connect_database(database_name: str):

    db = SQLiteManager(database_name)

    connection = db.connect()

    connection.close()

    return {
        "status": "success",
        "message": f"Connected to '{database_name}' successfully."
    }