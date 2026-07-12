import sqlite3
import os


class SQLiteManager:

    def __init__(self, database_name: str):
        self.database_name = database_name

        # Create a folder to store databases
        os.makedirs("databases", exist_ok=True)

        self.db_path = os.path.join("databases", f"{database_name}.db")

    def create_database(self):
        """
        Creates the SQLite database if it doesn't exist.
        """

        connection = sqlite3.connect(self.db_path)
        connection.close()

        return {
            "status": "success",
            "message": f"Database '{self.database_name}' created successfully.",
            "database_path": self.db_path
        }

    def connect(self):
        """
        Connects to the SQLite database.
        """

        connection = sqlite3.connect(self.db_path)

        return connection