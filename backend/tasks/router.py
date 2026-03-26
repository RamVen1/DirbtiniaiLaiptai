from fastapi import APIRouter, Depends
from sqlite3 import Connection
from core.database import get_db
from core.security import get_current_user
from . import service
from datetime import datetime, timedelta

router = APIRouter(prefix="", tags=["tasks"])

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

@router.post("/update-difficulty")
def update_difficulty(adjustment: int, current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        conn.execute(
            """
            UPDATE User 
            SET difficulty = MAX(0, MIN(5, difficulty + ?)) 
            WHERE ID = ?
            """, 
            (adjustment, current_user_id)
        )

        cursor = conn.execute("SELECT COUNT(*) FROM Task WHERE USER_ID = ?", (current_user_id,))
        total_tasks = cursor.fetchone()[0]

        conn.commit()
    return {"total_tasks": total_tasks}

@router.get("/mini-report-data")
def get_report_data(current_user_id: int = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.execute(
            """
            SELECT Date FROM Task 
            WHERE User_ID = ? AND Date >= date('now', '-7 days')
            ORDER BY Date ASC
            """, 
            (current_user_id,)
        )
        tasks = cursor.fetchall()   
        today = datetime.now().date()
        days_data = []
        
        task_dates = {datetime.strptime(t[0].split()[0], '%Y-%m-%d').date() for t in tasks}
        
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            days_data.append(1 if day in task_dates else 0)

    return {"chart_data": days_data, "total_practice_hours": round(len(tasks) * 0.6, 1)}