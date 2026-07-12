from threading import Thread
import time
import uuid

from app.generator.job import GeneratorJob
from app.generator.registry import JobRegistry
from app.generator.row_generator import RowGenerator
from app.database.insert_manager import InsertManager


class GeneratorService:

    @classmethod
    def start(cls, job: GeneratorJob):

        # Generate a unique Job ID
        job_id = str(uuid.uuid4())[:8]

        job.running = True

        # Register the job
        JobRegistry.add_job(job_id, job)

        # Start background thread
        thread = Thread(
            target=cls._run_generator,
            args=(job_id,),
            daemon=True
        )

        thread.start()

        return {
            "status": "success",
            "job_id": job_id,
            "message": "Generator started successfully."
        }

    @classmethod
    def _run_generator(cls, job_id):

        job = JobRegistry.get_job(job_id)

        insert_manager = InsertManager(job.database_name)

        while not job.stop_event.is_set():

            row = RowGenerator.generate(job.columns)

            insert_manager.insert_row(
                job.table_name,
                row
            )

            job.rows_generated += 1

            time.sleep(job.delay)

        job.running = False

    @classmethod
    def stop(cls, job_id: str):

        job = JobRegistry.get_job(job_id)

        if job is None:
            return {
                "status": "error",
                "message": "Job not found."
            }

        job.stop_event.set()

        return {
            "status": "success",
            "message": "Generator stopped successfully."
        }


    @classmethod
    def status(cls, job_id: str):

        job = JobRegistry.get_job(job_id)

        if job is None:
            return {
                "status": "error",
                "message": "Job not found."
            }

        return {
            "job_id": job_id,
            "running": job.running,
            "rows_generated": job.rows_generated,
            "database": job.database_name,
            "table": job.table_name,
            "delay": job.delay
        }


    @classmethod
    def list_jobs(cls):

        jobs = []

        for job_id, job in JobRegistry.list_jobs().items():

            jobs.append({
                "job_id": job_id,
                "database": job.database_name,
                "table": job.table_name,
                "running": job.running,
                "rows_generated": job.rows_generated,
                "delay": job.delay
            })

        return jobs