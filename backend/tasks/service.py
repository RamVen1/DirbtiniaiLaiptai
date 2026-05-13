import google.generativeai as genai
from sqlite3 import Connection
from core.config import settings
from core.database import get_db
from datetime import datetime, timedelta

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

PETS_CATALOG = [
    "Bunny",
    "Fox",
    "Red Panda",
]

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
            
            user = conn.execute("SELECT Skill FROM User WHERE ID = ?", (user_id,)).fetchone()
            skill = user['Skill'] if user else None
            
            conn.execute(
                """INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours, Skill)
                   VALUES (?, ?, ?, 0, 0, ?)""",
                (user_id, week_start, week_end, skill)
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
        
        
        user = conn.execute("SELECT Skill FROM User WHERE ID = ?", (user_id,)).fetchone()
        skill = user['Skill'] if user else None

        existing_report = conn.execute(
            "SELECT * FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (user_id, week_start)
        ).fetchone()
        
        if existing_report:
            report_id = existing_report['ID']

            conn.execute("DELETE FROM Task WHERE Report_ID = ?", (report_id,))
        else:
 
            conn.execute(
                """INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours, Skill)
                   VALUES (?, ?, ?, 0, 0, ?)""",
                (user_id, week_start, week_end, skill)
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


def get_quarter_number(completed_reports_count: int) -> int:
    if completed_reports_count <= 0 or completed_reports_count % 13 != 0:
        return 0
    return completed_reports_count // 13


def select_pet_for_skill_and_quarter(skill: str, quarter_number: int) -> str:
    key = f"{skill.lower()}:{quarter_number}"
    index = sum(ord(ch) for ch in key) % len(PETS_CATALOG)
    return PETS_CATALOG[index]


def get_quarterly_report_data(user_id: int, quarter_number: int = None):
    conn = get_db()
    try:
        reports = conn.execute(
            """SELECT ID, Skill, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours, Completed_At
               FROM Report 
               WHERE User_ID = ? AND Completed_At IS NOT NULL
               ORDER BY Week_Start ASC""",
            (user_id,)
        ).fetchall()
        
        if not reports:
            return None
        
        # Determine which quarter to analyze
        if quarter_number is None :
            completed_count = len(reports)
            quarter_number = (completed_count - 1) // 13 + 1
        
        start_idx = (quarter_number - 1) * 13
        end_idx = quarter_number * 13
        
        quarter_reports = reports[start_idx:end_idx]
        
        if not quarter_reports:
            return None
        
        total_tasks = sum(r['Total_Tasks_Completed'] for r in quarter_reports)
        total_hours = sum(r['Total_Practice_Hours'] for r in quarter_reports)
        
        skills = {}
        for report in quarter_reports:
            skill = report['Skill'] or "Unknown"
            if skill not in skills:
                skills[skill] = {'weeks': 0, 'tasks': 0, 'hours': 0}
            skills[skill]['weeks'] += 1
            skills[skill]['tasks'] += report['Total_Tasks_Completed']
            skills[skill]['hours'] += report['Total_Practice_Hours']
        
        avg_tasks_per_week = total_tasks / len(quarter_reports) if quarter_reports else 0
        weeks_active = len(quarter_reports)
        consistency_score = (weeks_active / 13) * 100 
        
        weekly_data = []
        for i, report in enumerate(quarter_reports):
            week_num = i + 1
            weekly_data.append({
                'week': week_num,
                'tasks': report['Total_Tasks_Completed'],
                'hours': report['Total_Practice_Hours'],
                'skill': report['Skill'],
                'week_start': str(report['Week_Start']),
                'report_id': report['ID'],
            })
        
        if len(quarter_reports) > 1:
            first_week_avg = sum(r['Total_Tasks_Completed'] for r in quarter_reports[:3]) / 3
            last_week_avg = sum(r['Total_Tasks_Completed'] for r in quarter_reports[-3:]) / 3
            progression_trend = "improving" if last_week_avg > first_week_avg else "maintaining" if last_week_avg == first_week_avg else "declining"
            improvement_percent = ((last_week_avg - first_week_avg) / first_week_avg * 100) if first_week_avg > 0 else 0
        else:
            progression_trend = "new"
            improvement_percent = 0
        
        return {
            'quarter_number': quarter_number,
            'total_weeks': weeks_active,
            'total_tasks': total_tasks,
            'total_hours': round(total_hours, 1),
            'avg_tasks_per_week': round(avg_tasks_per_week, 1),
            'consistency_score': round(consistency_score, 1),
            'skills': skills,
            'weekly_data': weekly_data,
            'progression_trend': progression_trend,
            'improvement_percent': round(improvement_percent, 1),
            'quarter_start': str(quarter_reports[0]['Week_Start']),
            'quarter_end': str(quarter_reports[-1]['Week_End']),
        }
    finally:
        conn.close()


def get_all_quarters_summary(user_id: int):
    conn = get_db()
    try:
        reports = conn.execute(
            """SELECT ID, Skill, Week_Start, Total_Tasks_Completed, Total_Practice_Hours, Completed_At
               FROM Report 
               WHERE User_ID = ? AND Completed_At IS NOT NULL
               ORDER BY Week_Start ASC""",
            (user_id,)
        ).fetchall()
        
        if not reports:
            return []
        
        quarters = []
        total_completed = len(reports)
        total_quarters = (total_completed - 1) // 13 + 1 if total_completed % 13 != 0 or total_completed > 0 else total_completed // 13
        
        for q_num in range(1, total_quarters + 1):
            q_data = get_quarterly_report_data(user_id, q_num)
            if q_data:
                quarters.append({
                    'quarter_number': q_num,
                    'total_tasks': q_data['total_tasks'],
                    'total_hours': q_data['total_hours'],
                    'skills': list(q_data['skills'].keys()),
                    'consistency_score': q_data['consistency_score'],
                })
        
        return quarters
    finally:
        conn.close()