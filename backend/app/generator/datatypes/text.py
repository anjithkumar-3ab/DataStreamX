from faker import Faker

fake = Faker()


class TextGenerator:

    @staticmethod
    def generate():

        return fake.name()