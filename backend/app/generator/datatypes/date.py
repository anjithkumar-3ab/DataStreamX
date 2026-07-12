from datetime import date

from faker import Faker

fake = Faker()


class DateGenerator:

	@staticmethod
	def generate():
		return fake.date_between(start_date='-2y', end_date='today').isoformat()
