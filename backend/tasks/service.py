import google.generativeai as genai
from sqlite3 import Connection
from core.config import settings
from core.database import get_db
from datetime import datetime, timedelta

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

def get_monday_of_week(date=None):
    """Get the Monday of the week for a given date (or today)"""
    if date is None:
        date = datetime.now().date()
    return date - timedelta(days=date.weekday())

def get_sunday_of_week(date=None):
    """Get the Sunday of the week for a given date (or today)"""
    if date is None:
        date = datetime.now().date()
    return date + timedelta(days=6 - date.weekday())

def get_incomplete_previous_report(user_id: int):
    conn = get_db()
    try:
        week_start = get_monday_of_week()
 
        report = conn.execute(
            """SELECT * FROM Report 
               WHERE User_ID = ? 
               AND Week_Start < ? 
               AND Completed_At IS NULL 
               ORDER BY Week_Start DESC 
               LIMIT 1""",
            (user_id, week_start)
        ).fetchone()
        
        return report
    finally:
        conn.close()

def get_or_create_weekly_report(user_id: int):
    """Get the current week's report or create a new one"""
    conn = get_db()
    try:
        week_start = get_monday_of_week()
        week_end = get_sunday_of_week()
        
        report = conn.execute(
            "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (user_id, week_start)
        ).fetchone()
        
        if not report:
            conn.execute(
                """INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours)
                   VALUES (?, ?, ?, 0, 0)""",
                (user_id, week_start, week_end)
            )
            conn.commit()
            report = conn.execute(
                "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
                (user_id, week_start)
            ).fetchone()
        
        return report['ID']
    finally:
        conn.close()

def get_latest_task(db: Connection):
    return db.execute("SELECT * FROM task ORDER BY id DESC LIMIT 1").fetchone()

def generate_daily_task(user_id: int):

    conn = get_db()
    try:
        skill = conn.execute("SELECT Skill FROM User WHERE ID = ?", (user_id,)).fetchone()
        difficulty = conn.execute("SELECT difficulty FROM User WHERE ID = ?", (user_id,)).fetchone()
        prompt = "Generate a short productive daily task for someone who is trying to learn {skill} at a {difficulty} difficulty level. Imagine difficulty is a a slider from 0 to 5. 0 being a beginner and 5 expert. Keep the answer to just the task and under 20 words.".format(skill=skill["Skill"], difficulty=difficulty["difficulty"])
        response = model.generate_content(prompt)
        task_text = response.text.strip()
        
     
        report_id = get_or_create_weekly_report(user_id)
        
        conn.execute(
            "INSERT INTO task (task_content, User_ID, Report_ID) VALUES (?, ?, ?)", 
            (task_text, user_id, report_id)
        )
        conn.commit()
    finally:
        conn.close()
    return task_text

def create_test_week_data(user_id: int):
    """Create hardcoded test data for a full week of tasks for testing MiniReport"""
    conn = get_db()
    try:
        week_start = get_monday_of_week()
        week_end = get_sunday_of_week()
        

        existing_report = conn.execute(
            "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (user_id, week_start)
        ).fetchone()
        
        if existing_report:
            report_id = existing_report['ID']

            conn.execute("DELETE FROM Task WHERE Report_ID = ?", (report_id,))
        else:
 
            conn.execute(
                """INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours)
                   VALUES (?, ?, ?, 0, 0)""",
                (user_id, week_start, week_end)
            )
            conn.commit()
            report_id = conn.execute(
                "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ?",
                (user_id, week_start)
            ).fetchone()['ID']

        test_tasks = [
            "Monday: Review Python concepts for 30 minutes",
            "Tuesday: Complete 3 LeetCode problems on arrays",
            "Wednesday: Build a simple REST API endpoint",
            "Thursday: Debug and refactor previous code",
            "Friday: Write unit tests for your module",
            "Saturday: Study advanced database queries",
            "Sunday: Review the week's learnings and plan ahead"
        ]
    

        for i, task_text in enumerate(test_tasks):
            # Properly calculate each day of the week with a timestamp
            task_date = week_start + timedelta(days=i)
            # Store with time to ensure proper format
            task_datetime = datetime.combine(task_date, datetime.min.time())
            conn.execute(
                """INSERT INTO Task (task_content, User_ID, Report_ID, Date) 
                   VALUES (?, ?, ?, ?)""",
                (task_text, user_id, report_id, task_datetime)
            )

        total_tasks = 7
        total_hours = round(total_tasks * 0.6, 1)
        conn.execute(
            "UPDATE Report SET Total_Tasks_Completed = ?, Total_Practice_Hours = ? WHERE ID = ?",
            (total_tasks, total_hours, report_id)
        )
        
        conn.commit()
        return {
            "status": "success",
            "report_id": report_id,
            "tasks_created": total_tasks,
            "week_start": str(week_start),
            "week_end": str(week_end)
        }
    finally:
        conn.close()