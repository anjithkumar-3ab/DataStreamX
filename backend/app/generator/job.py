from dataclasses import dataclass
from threading import Event


@dataclass
class GeneratorJob:
    database_name: str
    table_name: str
    columns: list
    delay: float = 1.0

    rows_generated: int = 0
    running: bool = False

    stop_event: Event = None

    def __post_init__(self):
        self.stop_event = Event()