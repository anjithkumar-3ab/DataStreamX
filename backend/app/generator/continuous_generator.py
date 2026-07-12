import time

from app.generator.row_generator import RowGenerator
from app.database.insert_manager import InsertManager


class ContinuousGenerator:

    def __init__(
        self,
        database_name,
        table_name,
        columns,
        delay=1
    ):

        self.database_name = database_name
        self.table_name = table_name
        self.columns = columns
        self.delay = delay

        self.insert_manager = InsertManager(database_name)

    def start(self):

        print("Generator Started...")

        while True:

            row = RowGenerator.generate(self.columns)

            self.insert_manager.insert_row(
                self.table_name,
                row
            )

            print(row)

            time.sleep(self.delay)