from fastapi import APIRouter, Depends
from sqlite3 import Connection
from core.database import get_db
from . import service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
def get_daily_task(db: Connection = Depends(get_db)):
    task = service.get_latest_task(db)
    if not task:
        task_content = service.generate_new_task(db)
        return {"task": task_content}
    return {"task": task["task_content"]}

@router.post("/refresh")
def refresh_daily_task(db: Connection = Depends(get_db)):
    task_content = service.generate_new_task(db)
    return {"task": task_content}