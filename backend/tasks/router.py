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

        user_id = int(current_user_id)

        incomplete_report = service.get_incomplete_previous_report(user_id)
        
        if incomplete_report:
            conn.commit()
            cursor = conn.execute("SELECT COUNT(*) FROM Task WHERE USER_ID = ?", (user_id,))
            total_tasks = cursor.fetchone()[0]
            return {
                "total_tasks": total_tasks, 
                "show_report": True, 
                "report_id": incomplete_report['ID'],
                "is_previous_week": True
            }
        
        # Get current week's report
        week_start = service.get_monday_of_week()
        report = conn.execute(
            "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (user_id, week_start)
        ).fetchone()
        
        if report:
            report_id = report['ID']
            today = datetime.now().date()
            
            cursor = conn.execute(
                "SELECT COUNT(*) as count FROM Task WHERE Report_ID = ?",
                (report_id,)
            )
            tasks_completed = cursor.fetchone()['count']
            estimated_hours = round(tasks_completed * 0.6, 1)
            conn.execute(
                "UPDATE Report SET Total_Tasks_Completed = ?, Total_Practice_Hours = ? WHERE ID = ?",
                (tasks_completed, estimated_hours, report_id)
            )
            
            is_end_of_week = today.weekday() == 6
            
            cursor = conn.execute("SELECT COUNT(*) FROM Task WHERE USER_ID = ?", (user_id,))
            total_tasks = cursor.fetchone()[0]
            conn.commit()
            
            should_show_report = (is_end_of_week and tasks_completed > 0) or tasks_completed == 7
            return {"total_tasks": total_tasks, "show_report": should_show_report, "tasks_this_week": tasks_completed, "is_previous_week": False}
        
        cursor = conn.execute("SELECT COUNT(*) FROM Task WHERE USER_ID = ?", (user_id,))
        total_tasks = cursor.fetchone()[0]
        conn.commit()
        return {"total_tasks": total_tasks, "show_report": False, "tasks_this_week": 0, "is_previous_week": False}

@router.get("/mini-report-data")
def get_report_data(current_user_id: int = Depends(get_current_user), report_id: int = None):
    """Get report data. If report_id is provided, get that specific report. 
    Otherwise, get current week's report."""
    with get_db() as conn:
        user_id = int(current_user_id)
        
        if report_id:
            # Get specific report (for previous weeks)
            report = conn.execute(
                "SELECT * FROM Report WHERE ID = ? AND User_ID = ?",
                (report_id, user_id)
            ).fetchone()
        else:
            # Get current week's report
            week_start = service.get_monday_of_week()
            report = conn.execute(
                "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
                (user_id, week_start)
            ).fetchone()
        
        if not report:
            return {
                "chart_data": [0, 0, 0, 0, 0, 0, 0], 
                "day_labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "total_practice_hours": 0, 
                "tasks_completed": 0,
                "daily_tasks": {}
            }
        
        cursor = conn.execute(
            """
            SELECT Date, task_content FROM Task 
            WHERE Report_ID = ?
            ORDER BY Date ASC
            """, 
            (report['ID'],)
        )
        tasks = cursor.fetchall()
        
        # Get the week start for this report to calculate days
        # Handle both string and date formats
        week_start_str = report['Week_Start']
        if isinstance(week_start_str, str):
            week_start_date = datetime.strptime(week_start_str, '%Y-%m-%d').date()
        else:
            week_start_date = week_start_str
        
        # Extract dates and task content from tasks
        task_dict = {}  # Maps date to task content
        task_dates = set()
        
        for task_row in tasks:
            task_date_str = task_row[0]
            task_content = task_row[1]
            
            task_date = None
            if isinstance(task_date_str, str):
                # Parse various possible formats
                try:
                    # Try "YYYY-MM-DD HH:MM:SS" format first
                    if ' ' in task_date_str:
                        date_part = task_date_str.split()[0]
                        task_date = datetime.strptime(date_part, '%Y-%m-%d').date()
                    else:
                        # Try "YYYY-MM-DD" format
                        task_date = datetime.strptime(task_date_str, '%Y-%m-%d').date()
                except ValueError:
                    # If parsing fails, skip this task
                    continue
            else:
                # If it's already a date object
                if isinstance(task_date_str, datetime):
                    task_date = task_date_str.date()
                else:
                    task_date = task_date_str
            
            if task_date:
                task_dates.add(task_date)
                task_dict[str(task_date)] = task_content
        
        days_data = []
        day_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        daily_tasks = {}
        
        # Generate data for the 7 days of this report's week
        for i in range(7):
            day = week_start_date + timedelta(days=i)
            day_str = str(day)
            is_completed = 1 if day in task_dates else 0
            days_data.append(is_completed)
            daily_tasks[day_labels[i]] = {
                "completed": is_completed,
                "task": task_dict.get(day_str, "No task")
            }

        return {
            "chart_data": days_data, 
            "day_labels": day_labels,
            "total_practice_hours": report['Total_Practice_Hours'],
            "tasks_completed": report['Total_Tasks_Completed'],
            "tasks_by_day": dict(zip(day_labels, days_data)),
            "daily_tasks": daily_tasks,
            "week_start": str(week_start_date),
            "week_end": str(week_start_date + timedelta(days=6))
        }

@router.get("/check-report")
def check_report(current_user_id: int = Depends(get_current_user)):
    with get_db() as conn:
        user_id = int(current_user_id)
        week_start = service.get_monday_of_week()
        
        cursor = conn.execute(
            "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ? LIMIT 1", 
            (user_id, week_start)
        )
        report = cursor.fetchone()
        
        if not report:
            return {"exists": False, "show_report": False}
        
        # Check if we should show report (end of week or 7 tasks completed)
        today = datetime.now().date()
        is_end_of_week = today.weekday() == 6  # Sunday
        tasks_completed = report['Total_Tasks_Completed']
        
        show_report = (is_end_of_week and tasks_completed > 0) or tasks_completed == 7
        
        return {"exists": True, "show_report": show_report}

@router.post("/complete-weekly-report")
def complete_weekly_report(current_user_id: int = Depends(get_current_user), report_id: int = None):
    """Mark a report as completed. If report_id is provided, complete that report. 
    Otherwise, complete current week's report."""
    with get_db() as conn:
        user_id = int(current_user_id)
        
        if report_id:
            # Complete specific report
            conn.execute(
                """UPDATE Report 
                   SET Completed_At = CURRENT_TIMESTAMP 
                   WHERE ID = ? AND User_ID = ?""",
                (report_id, user_id)
            )
        else:
            # Complete current week's report
            week_start = service.get_monday_of_week()
            conn.execute(
                """UPDATE Report 
                   SET Completed_At = CURRENT_TIMESTAMP 
                   WHERE User_ID = ? AND Week_Start = ?""",
                (user_id, week_start)
            )
        conn.commit()
        
    return {"status": "completed"}

@router.post("/test-create-week-data")
def test_create_week_data(current_user_id: int = Depends(get_current_user)):
    """TEST ENDPOINT: Create hardcoded test data for a full week of tasks"""
    user_id = int(current_user_id)
    result = service.create_test_week_data(user_id)
    return result