from app.generator.manager import GeneratorManager


class RowGenerator:

    @staticmethod
    def generate(columns):

        row = {}

        for column in columns:

            row[column.column_name] = GeneratorManager.generate(
                column.data_type
            )

        return row