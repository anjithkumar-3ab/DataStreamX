import os
import sqlite3

class TableManager:

    def __init__(self, database_name: str):
        os.makedirs("databases", exist_ok=True)
        self.db_path = os.path.join("databases", f"{database_name}.db")

    def create_table(self, table_name: str, columns: list):

        connection = sqlite3.connect(self.db_path)

        cursor = connection.cursor()

        column_definitions = []

        for column in columns:

            column_name = column.column_name.strip()
            data_type = column.data_type.strip().upper()

            type_map = {
                "INTEGER": "INTEGER",
                "REAL": "REAL",
                "BOOLEAN": "INTEGER",
                "DATE": "TEXT",
                "DATETIME": "TEXT",
                "EMAIL": "TEXT",
                "PHONE": "TEXT",
                "TEXT": "TEXT",
            }

            normalized_type = type_map.get(data_type, "TEXT")

            column_definitions.append(
                f"{column_name} {normalized_type}"
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

    def rename_table(self, table_name: str, new_table_name: str):

        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()

        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            (table_name,)
        )

        if cursor.fetchone() is None:
            connection.close()
            return {
                "status": "error",
                "message": f"Table '{table_name}' does not exist."
            }

        cursor.execute(f"ALTER TABLE {table_name} RENAME TO {new_table_name}")

        connection.commit()
        connection.close()

        return {
            "status": "success",
            "message": f"Table '{table_name}' renamed to '{new_table_name}'."
        }

    def delete_table(self, table_name: str):

        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()

        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")

        connection.commit()
        connection.close()

        return {
            "status": "success",
            "message": f"Table '{table_name}' deleted successfully."
        }

    def get_table_data(self, table_name: str, limit: int = 100, offset: int = 0):
        """Fetch data from a table with pagination."""
        try:
            connection = sqlite3.connect(self.db_path)
            connection.row_factory = sqlite3.Row
            cursor = connection.cursor()

            # Get row count
            cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
            total_rows = cursor.fetchone()["count"]

            # Get columns
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [row[1] for row in cursor.fetchall()]

            # Get data
            cursor.execute(
                f"SELECT * FROM {table_name} ORDER BY id DESC LIMIT ? OFFSET ?",
                (limit, offset)
            )
            rows = [dict(row) for row in cursor.fetchall()]

            connection.close()

            return {
                "status": "success",
                "columns": columns,
                "rows": rows,
                "total_rows": total_rows,
                "limit": limit,
                "offset": offset
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }