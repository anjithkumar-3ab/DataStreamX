from faker import Faker

fake = Faker()


class DateTimeGenerator:

	@staticmethod
	def generate():
		return fake.date_time_between(start_date='-2y', end_date='now').isoformat(sep=' ')
