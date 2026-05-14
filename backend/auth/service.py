import bcrypt
from sqlite3 import Connection
from .schemas import RegisterRequest

def get_user_by_email(db: Connection, email: str):
    return db.execute("SELECT * FROM User WHERE Email = ?", (email,)).fetchone()

def get_user_by_username(db: Connection, username: str):
    return db.execute("SELECT * FROM User WHERE Username = ?", (username,)).fetchone()

def create_user(db: Connection, user: RegisterRequest):
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.execute(
        "INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)",
        (user.username, user.email, hashed_pw)
    )
    db.commit()

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def update_user_profile(conn, user_id, username, email, avatar_index, hashed_password=None):
    if hashed_password:
        conn.execute(
            """
            UPDATE User 
            SET Username = ?, Email = ?, avatar_index = ?, Password = ? 
            WHERE ID = ?
            """,
            (username, email, avatar_index, hashed_password, user_id)
        )
    else:
        conn.execute(
            """
            UPDATE User 
            SET Username = ?, Email = ?, avatar_index = ? 
            WHERE ID = ?
            """,
            (username, email, avatar_index, user_id)
        )
    conn.commit()
    return conn.execute("SELECT * FROM User WHERE ID = ?", (user_id,)).fetchone()

def get_user_report_history(conn, user_id: int):
    """Fetch user's report history with associated tasks"""
    reports = conn.execute(
        """
        SELECT 
            ID, 
            User_ID, 
            Week_Start, 
            Week_End, 
            Total_Tasks_Completed, 
            Total_Practice_Hours, 
            Skill, 
            Created_At, 
            Completed_At
        FROM Report 
        WHERE User_ID = ? 
        ORDER BY Week_Start DESC
        """,
        (user_id,)
    ).fetchall()
    
    history = []
    for report in reports:
        report_dict = dict(report)
        
        # Fetch tasks for this report
        tasks = conn.execute(
            """
            SELECT 
                ID, 
                Task_content, 
                Date, 
                Completed_At, 
                Difficulty_Rating
            FROM Task 
            WHERE Report_ID = ? 
            ORDER BY Date DESC
            """,
            (report_dict["ID"],)
        ).fetchall()
        
        report_dict["tasks"] = [dict(task) for task in tasks]
        history.append(report_dict)
    
    return history

def get_grouped_report_history(conn, user_id: int):
    """Fetch user's report history grouped by skill"""
    reports = conn.execute(
        """
        SELECT 
            ID as id, 
            Week_Start as week_start, 
            Week_End as week_end, 
            Total_Tasks_Completed as tasks_completed, 
            Total_Practice_Hours as practice_hours, 
            Skill, 
            Completed_At as completed_at
        FROM Report 
        WHERE User_ID = ? 
        ORDER BY Week_Start DESC
        """,
        (user_id,)
    ).fetchall()
    
    grouped = {}
    for report in reports:
        report_dict = dict(report)
        skill = report_dict.get("Skill") or "General"
        
        if skill not in grouped:
            grouped[skill] = []
        
        grouped[skill].append({
            "id": report_dict["id"],
            "week_start": report_dict["week_start"],
            "week_end": report_dict["week_end"],
            "tasks_completed": report_dict["tasks_completed"],
            "practice_hours": report_dict["practice_hours"],
            "completed_at": report_dict["completed_at"]
        })
    
    return grouped

def get_user_activity_dates(conn, user_id: int):
    query = """
        SELECT DISTINCT date(Completed_At) as activity_date
        FROM Task
        WHERE User_ID = ? 
          AND Completed_At IS NOT NULL 
          AND Completed_At != ''
          AND Completed_At >= date('now', '-90 days')
        ORDER BY activity_date ASC
    """
    try:
        rows = conn.execute(query, (user_id,)).fetchall()
        return [row["activity_date"] for row in rows]
    except Exception as e:
        print(f"SQL Error in get_user_activity_dates: {e}")
        return []
    
def get_user_rank_stats(conn, user_id: int):
    """Apskaičiuoja bendrą užduočių kiekį ir vietą reitinge"""
    query = """
        WITH UserCounts AS (
            SELECT User_ID, COUNT(*) as task_count
            FROM Task
            WHERE Completed_At IS NOT NULL AND Completed_At != ''
            GROUP BY User_ID
        )
        SELECT 
            (SELECT task_count FROM UserCounts WHERE User_ID = ?) as total_completed,
            (SELECT COUNT(*) + 1 FROM UserCounts WHERE task_count > 
                (SELECT task_count FROM UserCounts WHERE User_ID = ?)) as rank,
            (SELECT COUNT(*) FROM UserCounts) as total_users_in_ranking
    """
    try:
        row = conn.execute(query, (user_id, user_id)).fetchone()
        if not row or row["total_completed"] is None:
            return {"total_completed": 0, "rank": None, "total_participants": 0}
            
        return {
            "total_completed": row["total_completed"],
            "rank": row["rank"],
            "total_participants": row["total_users_in_ranking"]
        }
    except Exception as e:
        print(f"Error calculating rank: {e}")
        return {"total_completed": 0, "rank": None, "total_participants": 0}