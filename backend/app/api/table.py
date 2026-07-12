from fastapi import APIRouter
from app.schemas.table_schema import TableSchema
from app.database.table_manager import TableManager
from pydantic import BaseModel


class TableRenameSchema(BaseModel):
    database_name: str
    table_name: str
    new_table_name: str


class TableDeleteSchema(BaseModel):
    database_name: str
    table_name: str

router = APIRouter()


@router.post("/table/create")
def create_table(request: TableSchema):

    manager = TableManager(request.database_name)

    result = manager.create_table(
        table_name=request.table_name,
        columns=request.columns
    )

    return result


@router.post("/table/rename")
def rename_table(request: TableRenameSchema):
    manager = TableManager(request.database_name)

    return manager.rename_table(
        table_name=request.table_name,
        new_table_name=request.new_table_name,
    )


@router.delete("/table/delete")
def delete_table(request: TableDeleteSchema):
    manager = TableManager(request.database_name)

    return manager.delete_table(
        table_name=request.table_name,
    )


@router.get("/table/{database_name}/{table_name}/data")
def get_table_data(database_name: str, table_name: str, limit: int = 100, offset: int = 0):
    """Fetch data from a table with pagination."""
    manager = TableManager(database_name)
    return manager.get_table_data(table_name, limit, offset)