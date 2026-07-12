import sqlite3
import os


class InsertManager:

    def __init__(self, database_name: str):

        self.db_path = os.path.join(
            "databases",
            f"{database_name}.db"
        )

    def insert_row(self, table_name: str, row: dict):

        connection = sqlite3.connect(self.db_path)

        cursor = connection.cursor()

        columns = ", ".join(row.keys())

        placeholders = ", ".join(["?"] * len(row))

        values = list(row.values())

        query = f"""
        INSERT INTO {table_name}
        ({columns})
        VALUES
        ({placeholders})
        """

        cursor.execute(query, values)

        connection.commit()

        connection.close()

        return {
            "status": "success",
            "message": "Row inserted successfully."
        }