from app.generator.datatypes.text import TextGenerator
from app.generator.datatypes.integer import IntegerGenerator
from app.generator.datatypes.real import RealGenerator
from app.generator.datatypes.email import EmailGenerator

class GeneratorManager:

    generators = {
        "TEXT": TextGenerator,

        "INTEGER": IntegerGenerator,
        "INT": IntegerGenerator,

        "REAL": RealGenerator,
        "FLOAT": RealGenerator,
        "DOUBLE": RealGenerator
    }

    @classmethod
    def generate(cls, data_type: str):

        data_type = data_type.upper()

        generator = cls.generators.get(data_type)

        if generator is None:
            raise ValueError(f"Unsupported datatype: {data_type}")

        return generator.generate()