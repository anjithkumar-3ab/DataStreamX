from fastapi import APIRouter
from app.schemas.table_schema import TableSchema
from app.database.table_manager import TableManager

router = APIRouter()


@router.post("/table/create")
def create_table(request: TableSchema):

    manager = TableManager(request.database_name)

    result = manager.create_table(
        table_name=request.table_name,
        columns=request.columns
    )

    return result