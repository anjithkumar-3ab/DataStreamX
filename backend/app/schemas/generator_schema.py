from pydantic import BaseModel
from typing import List

from app.schemas.table_schema import ColumnSchema


class GeneratorStartRequest(BaseModel):
    database_name: str
    table_name: str
    delay: float = 1.0
    columns: List[ColumnSchema]