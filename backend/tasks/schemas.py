from pydantic import BaseModel

class TaskResponse(BaseModel):
    task: str