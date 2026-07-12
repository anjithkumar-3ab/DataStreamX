from pydantic import BaseModel


class DatabaseSchema(BaseModel):
    database_name: str