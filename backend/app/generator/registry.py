from app.generator.job import GeneratorJob


class JobRegistry:

    jobs = {}

    @classmethod
    def add_job(cls, job_id: str, job: GeneratorJob):
        cls.jobs[job_id] = job

    @classmethod
    def get_job(cls, job_id: str):
        return cls.jobs.get(job_id)

    @classmethod
    def remove_job(cls, job_id: str):
        if job_id in cls.jobs:
            del cls.jobs[job_id]

    @classmethod
    def list_jobs(cls):
        return cls.jobs