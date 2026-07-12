from faker import Faker

fake = Faker()


class PhoneGenerator:

	@staticmethod
	def generate():
		return fake.phone_number()
