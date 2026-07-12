from faker import Faker

fake = Faker()


class EmailGenerator:

    @staticmethod
    def generate():
        return fake.email()