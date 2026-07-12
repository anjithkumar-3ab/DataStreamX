import random


class RealGenerator:

    @staticmethod
    def generate():
        return round(random.uniform(1000.0, 100000.0), 2)