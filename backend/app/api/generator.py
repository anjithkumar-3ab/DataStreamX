from fastapi import APIRouter

from app.generator.job import GeneratorJob
from app.generator.service import GeneratorService
from app.schemas.generator_schema import GeneratorStartRequest

router = APIRouter()


@router.post("/generator/start")
def start_generator(request: GeneratorStartRequest):

    job = GeneratorJob(
        database_name=request.database_name,
        table_name=request.table_name,
        columns=request.columns,
        delay=request.delay
    )

    result = GeneratorService.start(job)

    return result

@router.post("/generator/stop/{job_id}")
def stop_generator(job_id: str):

    return GeneratorService.stop(job_id)

@router.get("/generator/status/{job_id}")
def generator_status(job_id: str):

    return GeneratorService.status(job_id)

@router.get("/generator/jobs")
def list_jobs():

    return GeneratorService.list_jobs()