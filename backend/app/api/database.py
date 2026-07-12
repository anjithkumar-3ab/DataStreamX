import glob
import os
import sqlite3

from fastapi import APIRouter, Query

from app.database.sqlite import SQLiteManager
from app.schemas.database_schema import DatabaseSchema

router = APIRouter()


def _database_path(database_name: str) -> str:
    os.makedirs("databases", exist_ok=True)
    return os.path.join("databases", f"{database_name}.db")


@router.post("/database/create")
def create_database(request: DatabaseSchema):
    db = SQLiteManager(request.database_name)

    result = db.create_database()

    return result

@router.post("/database/connect")
def connect_database(request: DatabaseSchema):
    db = SQLiteManager(request.database_name)

    connection = db.connect()

    connection.close()

    return {
        "status": "success",
        "message": f"Connected to '{request.database_name}' successfully."
    }


@router.delete("/database/{database_name}")
def delete_database(database_name: str):
    db_path = _database_path(database_name)

    if not os.path.exists(db_path):
        return {
            "status": "success",
            "message": f"Database '{database_name}' does not exist.",
        }

    os.remove(db_path)

    return {
        "status": "success",
        "message": f"Database '{database_name}' deleted successfully.",
    }


@router.get("/database/list")
def list_databases():
    os.makedirs("databases", exist_ok=True)

    databases = []

    for db_path in sorted(glob.glob(os.path.join("databases", "*.db"))):
        database_name = os.path.splitext(os.path.basename(db_path))[0]

        with sqlite3.connect(db_path) as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT name
                FROM sqlite_master
                WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
                ORDER BY name
                """
            )

            tables = [row[0] for row in cursor.fetchall()]

        databases.append(
            {
                "database_name": database_name,
                "table_count": len(tables),
                "tables": tables,
                "database_path": db_path,
            }
        )

    return {
        "status": "success",
        "databases": databases,
    }


@router.get("/database/{database_name}/tables")
def list_tables(database_name: str, include_columns: bool = Query(default=False)):
    db_path = _database_path(database_name)

    if not os.path.exists(db_path):
        return {
            "status": "success",
            "database_name": database_name,
            "tables": [],
        }

    with sqlite3.connect(db_path) as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT name
            FROM sqlite_master
            WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
            """
        )

        table_names = [row[0] for row in cursor.fetchall()]

        tables = []

        for table_name in table_names:
            table_info = {"table_name": table_name}

            if include_columns:
                cursor.execute(f"PRAGMA table_info({table_name})")
                table_info["columns"] = [
                    {
                        "name": column[1],
                        "type": column[2],
                    }
                    for column in cursor.fetchall()
                ]

            tables.append(table_info)

    return {
        "status": "success",
        "database_name": database_name,
        "tables": tables,
    }