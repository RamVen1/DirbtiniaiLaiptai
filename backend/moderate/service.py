import uuid
from sqlite3 import Connection

def get_moderator_teams(db: Connection, moderator_id: int):
    cursor = db.execute("SELECT * FROM Team WHERE ModeratorID = ?", (moderator_id,))
    return cursor.fetchall()

def create_new_team(db: Connection, moderator_id: int, name: str):
    new_code = str(uuid.uuid4()).replace("-", "").upper()[:8]
    
    cursor = db.execute(
        "INSERT INTO Team (Name, Code, ModeratorID) VALUES (?, ?, ?)",
        (name, new_code, moderator_id)
    )
    db.commit()
    
    return {
        "ID": cursor.lastrowid, 
        "Name": name, 
        "Code": new_code, 
        "ModeratorID": moderator_id
    }

def delete_team(db: Connection, team_id: int, moderator_id: int):
    cursor = db.execute(
        "DELETE FROM Team WHERE ID = ? AND ModeratorID = ?", 
        (team_id, moderator_id)
    )
    db.commit()
    return cursor.rowcount > 0

def get_members_by_team(conn, team_id: int):
    cursor = conn.execute("""
        SELECT ID as id, Username as fullName, Role as itRole, Email as email 
        FROM User 
        WHERE team_id = ?
    """, (team_id,))
    return [dict(row) for row in cursor.fetchall()]

def get_user_detailed_progress(conn, user_id: int):
    user = conn.execute("SELECT Username, Role, Email FROM User WHERE ID = ?", (user_id,)).fetchone()
    if not user: return None

    reports_query = """
        SELECT 
            r.ID as id, 
            r.Skill as name, 
            r.Total_Practice_Hours as hours,
            COUNT(t.ID) as total_report_tasks,
            SUM(CASE WHEN t.Completed_At IS NOT NULL THEN 1 ELSE 0 END) as completed_report_tasks
        FROM Report r
        LEFT JOIN Task t ON r.ID = t.Report_ID
        WHERE r.User_ID = ? AND r.Completed_At IS NOT NULL
        GROUP BY r.ID
        ORDER BY r.Created_At DESC
    """
    
    report_rows = conn.execute(reports_query, (user_id,)).fetchall()
    completed_modules = []
    total_scores_sum = 0

    for r in report_rows:
        total_tasks = r['total_report_tasks'] or 0
        completed_tasks = r['completed_report_tasks'] or 0
        
        report_score = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0
        total_scores_sum += report_score
        
        completed_modules.append({
            "id": r["id"],
            "name": f"Report: {r['name'] or 'General'}",
            "score": report_score,
            "hours": r["hours"]
        })

    tasks_query = """
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN Completed_At IS NOT NULL THEN 1 ELSE 0 END) as completed
        FROM Task 
        WHERE User_ID = ?
    """
    task_stats = conn.execute(tasks_query, (user_id,)).fetchone()
    
    total_tasks_global = task_stats['total'] or 0
    completed_tasks_global = task_stats['completed'] or 0
    progress_percent = int((completed_tasks_global / total_tasks_global * 100)) if total_tasks_global > 0 else 0

    total_hours = sum(m['hours'] for m in completed_modules)
    avg_score = int(total_scores_sum / len(completed_modules)) if completed_modules else progress_percent

    return {
        "memberName": user["Username"],
        "memberRole": user["Role"],
        "memberEmail": user["Email"],
        "activeModule": {
            "title": f"Overall Progress ({completed_tasks_global}/{total_tasks_global})",
            "progress": progress_percent
        },
        "completedModules": completed_modules,
        "avgScore": avg_score,
        "totalHours": round(total_hours, 1)
    }