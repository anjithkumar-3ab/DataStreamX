from pydantic import BaseModel
from typing import List


class ColumnSchema(BaseModel):
    column_name: str
    data_type: str


class TableSchema(BaseModel):
    database_name: str
    table_name: str
    columns: List[ColumnSchema]