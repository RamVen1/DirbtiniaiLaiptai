from fastapi import APIRouter, Depends
from sqlite3 import Connection
from core.database import get_db
from core.security import get_current_user
from . import service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/task")
def get_task(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        task = conn.execute("SELECT * FROM task WHERE User_ID = ? ORDER BY id DESC LIMIT 1", (current_user_id,)).fetchone()
    
    if not task:
        new_task = service.generate_daily_task(int(current_user_id))
        return {"task": new_task}
        
    return {"task": task["task_content"]}


@router.post("/refresh-task")
def refresh_task(current_user_id: str = Depends(get_current_user)):
    refreshed_task = service.generate_daily_task(int(current_user_id))
    return {"task": refreshed_task}