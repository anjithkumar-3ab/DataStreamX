import sqlite3
import os

class TableManager:

    def __init__(self, database_name: str):

        self.db_path = os.path.join(
            "databases",
            f"{database_name}.db"
        )

    def create_table(self, table_name: str, columns: list):

        connection = sqlite3.connect(self.db_path)

        cursor = connection.cursor()

        column_definitions = []

        for column in columns:

            column_name = column.column_name
            data_type = column.data_type

            column_definitions.append(
                f"{column_name} {data_type}"
            )

        query = f"""
        CREATE TABLE IF NOT EXISTS {table_name}
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            {", ".join(column_definitions)}
        )
        """

        cursor.execute(query)

        connection.commit()

        connection.close()

        return {
            "status": "success",
            "message": f"Table '{table_name}' created successfully."
        }