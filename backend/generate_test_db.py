"""
Script to generate test.db with sample data for development and testing
"""
import sqlite3
from datetime import datetime, timedelta
import hashlib
import os
import bcrypt

# Database file path
DB_PATH = "test.db"

def hash_password(password: str) -> str:
    """Simple password hashing for testing"""
    password_bytes = password.encode('utf-8')

    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    return hashed_bytes

def init_test_db():
    """Initialize test database with schema"""
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    
    # Create tables
    conn.execute("""
        CREATE TABLE IF NOT EXISTS User (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT UNIQUE NOT NULL,
            Email TEXT UNIQUE NOT NULL,
            Password TEXT NOT NULL,
            Role TEXT NOT NULL DEFAULT 'Member',
            streak INTEGER DEFAULT 0,
            skill TEXT NULL,
            difficulty INTEGER NULL DEFAULT 0,
            team_id INTEGER NULL,
            avatar_index INTEGER DEFAULT 0,
            FOREIGN KEY (team_id) REFERENCES Team (Id)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS Report (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            User_ID INTEGER NOT NULL,
            Week_Start DATE NOT NULL,
            Week_End DATE NOT NULL,
            Total_Tasks_Completed INTEGER DEFAULT 0,
            Total_Practice_Hours REAL DEFAULT 0,
            Skill TEXT NULL,
            Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            Completed_At TIMESTAMP NULL,
            FOREIGN KEY (User_ID) REFERENCES User (ID)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS Task (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Task_content TEXT,
            Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            User_ID INTEGER,
            Report_ID INTEGER,
            Completed_At TIMESTAMP NULL,
            Difficulty_Rating INTEGER,
            auto_submitted INTEGER DEFAULT 0,
            is_incomplete INTEGER DEFAULT 0,
            FOREIGN KEY (User_ID) REFERENCES User (ID),
            FOREIGN KEY (Report_ID) REFERENCES Report (ID)
        )
    """)
        
    conn.execute("""
        CREATE TABLE IF NOT EXISTS RoleRequest (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            Status TEXT NOT NULL DEFAULT 'Pending',
            User_ID INTEGER,
            Admin_ID INTEGER NULL,
            ProcessedDate DATETIME NULL,
            FOREIGN KEY (User_ID) REFERENCES User (ID),
            FOREIGN KEY (Admin_ID) REFERENCES User (ID)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS Companion (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Happiness INTEGER DEFAULT 100,
            Type TEXT NOT NULL DEFAULT 'Dog',
            User_ID INTEGER,
            FOREIGN KEY (User_ID) REFERENCES User (ID)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS UserPet (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            User_ID INTEGER NOT NULL,
            Pet_Name TEXT NOT NULL,
            Skill TEXT NOT NULL,
            Quarter_Number INTEGER NOT NULL,
            Awarded_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (User_ID) REFERENCES User (ID),
            UNIQUE(User_ID, Skill, Quarter_Number)
        )
    """)
        
    conn.execute("""
        CREATE TABLE IF NOT EXISTS Team (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Code TEXT UNIQUE,
            ModeratorID INTEGER,
            FOREIGN KEY (ModeratorID) REFERENCES User (ID)
        )
    """)
    
    conn.commit()
    return conn

def insert_test_data(conn):
    """Insert test users, team, reports, and tasks"""
    
    # Create 3 users
    admin_password = hash_password("admin123")
    mod_password = hash_password("mod123")
    member_password = hash_password("member123")
    
    # Insert Admin
    conn.execute("""
        INSERT INTO User (Username, Email, Password, Role, skill, difficulty)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("admin_user", "admin@test.com", admin_password, "Admin", "Administration", 4))
    
    # Insert Moderator
    conn.execute("""
        INSERT INTO User (Username, Email, Password, Role, skill, difficulty)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("mod_user", "mod@test.com", mod_password, "Moderator", "Leadership", 3))
    
    # Insert Member
    conn.execute("""
        INSERT INTO User (Username, Email, Password, Role, skill, difficulty)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("member_user", "member@test.com", member_password, "Member", "Time-Management", 2))
    
    conn.commit()
    
    # Get user IDs
    admin_id = conn.execute("SELECT ID FROM User WHERE Username = ?", ("admin_user",)).fetchone()[0]
    mod_id = conn.execute("SELECT ID FROM User WHERE Username = ?", ("mod_user",)).fetchone()[0]
    member_id = conn.execute("SELECT ID FROM User WHERE Username = ?", ("member_user",)).fetchone()[0]
    
    # Create team with moderator
    conn.execute("""
        INSERT INTO Team (Name, Code, ModeratorID)
        VALUES (?, ?, ?)
    """, ("Dev Team", "DEVTEAM001", mod_id))
    
    team_id = conn.execute("SELECT ID FROM Team WHERE Code = ?", ("DEVTEAM001",)).fetchone()[0]
    
    # Add member to team
    conn.execute("""
        UPDATE User SET team_id = ? WHERE ID = ?
    """, (team_id, member_id))
    
    conn.commit()
    
    # Generate 13 weeks of reports and tasks for the member
    # Start from 13 weeks ago
    today = datetime.now().date()
    thirteen_weeks_ago = today - timedelta(weeks=13)
    
    # Task templates with varying completion - soft skills focused
    task_templates = [
        "Review your wins: Spend the last five minutes of your workday writing down what you actually accomplished to accurately measure your time.",
        "Turn off non-essential alerts: Mute all social media and news notifications on your phone for the rest of the workday.",
        "Schedule your breaks: Explicitly block out 15 minutes for a lunch break and two short walk breaks on your calendar today so you don't work straight through them.",
        "Process micro-tasks immediately: Tackle any email or request that comes in today that takes less than two minutes to finish, rather than letting it pile up.",
        "Clear your physical desk: Spend exactly three minutes right now throwing away trash and organizing your immediate workspace to cut down on visual chaos.",
        "Set a distraction alarm: Set a timer for 25 minutes of completely uninterrupted work, followed by a strict 5-minute break.",
        "Time-block your morning: Dedicate a specific 60-minute window on your calendar today for deep work, and treat it as an unchangeable appointment.",
        "Declutter your digital view: Close every single browser tab and application that isn't directly related to the task you are working on right now.",
        "Pick your \"Big Three\": Write down the three most important tasks you must accomplish today before you look at any emails or messages.",
    ]
    
    for week in range(13):
        # Calculate week start (Monday) and end (Sunday)
        week_start = thirteen_weeks_ago + timedelta(weeks=week)
        # Adjust to Monday if not already
        week_start = week_start - timedelta(days=week_start.weekday())
        week_end = week_start + timedelta(days=6)
        
        # Create report for this week
        conn.execute("""
            INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours, Skill, Completed_At)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (member_id, week_start, week_end, 0, 0, "Time-Management", datetime.now()))
        
        conn.commit()
        
        report_id = conn.execute(
            "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ? ORDER BY ID DESC LIMIT 1",
            (member_id, week_start)
        ).fetchone()[0]
        
        # Add varying number of tasks per week (5-7 tasks)
        # Week 0-3: fewer tasks (5-6)
        # Week 4-8: consistent (6-7)
        # Week 9-12: more tasks (6-7)
        
        if week < 4:
            num_tasks = 5 + (week % 2)  # 5 or 6
        elif week < 9:
            num_tasks = 6 + (week % 2)  # 6 or 7
        else:
            num_tasks = 6 + (1 if week % 2 == 0 else 0)  # 6 or 7
        
        tasks_completed = 0
        for day in range(7):
            # Add tasks on 5-6 days of the week
            if day < num_tasks:
                task_date = week_start + timedelta(days=day)
                task_content = task_templates[day % len(task_templates)]
                
                conn.execute("""
                    INSERT INTO Task (Task_content, Date, User_ID, Report_ID, Completed_At, Difficulty_Rating)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    task_content,
                    task_date,
                    member_id,
                    report_id,
                    task_date + timedelta(hours=2),  # Completed 2 hours after task date
                    (week % 3) + 1  # Difficulty 1-3
                ))
                tasks_completed += 1
        
        # Update report with actual task count and hours
        practice_hours = round(tasks_completed * 0.6, 1)
        conn.execute("""
            UPDATE Report SET Total_Tasks_Completed = ?, Total_Practice_Hours = ?
            WHERE ID = ?
        """, (tasks_completed, practice_hours, report_id))
        
        conn.commit()
    
    # Add recent tasks for the last 6 days (including today) to build streak
    today = datetime.now().date()
    for days_ago in range(5, -1, -1):
        task_date = today - timedelta(days=days_ago)
        task_content = task_templates[days_ago % len(task_templates)]
        
        # Get or create report for this week
        week_start = task_date - timedelta(days=task_date.weekday())
        week_end = week_start + timedelta(days=6)
        
        report = conn.execute(
            "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (member_id, week_start)
        ).fetchone()
        
        if not report:
            conn.execute("""
                INSERT INTO Report (User_ID, Week_Start, Week_End, Total_Tasks_Completed, Total_Practice_Hours, Skill, Completed_At)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (member_id, week_start, week_end, 0, 0, "Time-Management", None))
            conn.commit()
            report_id = conn.execute(
                "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ? ORDER BY ID DESC LIMIT 1",
                (member_id, week_start)
            ).fetchone()[0]
        else:
            report_id = report[0]
        
        conn.execute("""
            INSERT INTO Task (Task_content, Date, User_ID, Report_ID, Completed_At, Difficulty_Rating)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            task_content,
            task_date,
            member_id,
            report_id,
            task_date + timedelta(hours=2),
            2
        ))
    
    conn.commit()
    
    # Mark current week's report as complete so it shows in Improvement Progress
    today = datetime.now().date()
    current_week_start = today - timedelta(days=today.weekday())
    
    current_report = conn.execute(
        "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ?",
        (member_id, current_week_start)
    ).fetchone()
    
    if current_report:
        conn.execute(
            "UPDATE Report SET Completed_At = ? WHERE ID = ?",
            (datetime.now(), current_report[0])
        )
        conn.commit()
    
    # Calculate and set streak for member based on consecutive completed tasks
    today = datetime.now().date()
    streak = 0
    current_date = today
    
    # Check for consecutive completed tasks going backwards from today
    while True:
        # Check if member completed a task on this date
        task = conn.execute("""
            SELECT COUNT(*) as count FROM Task 
            WHERE User_ID = ? AND DATE(Completed_At) = ? AND Completed_At IS NOT NULL
        """, (member_id, current_date)).fetchone()
        
        if task['count'] > 0:
            streak += 1
            current_date = current_date - timedelta(days=1)
        else:
            break
    
    # Update member streak
    conn.execute("""
        UPDATE User SET streak = ? WHERE ID = ?
    """, (streak, member_id))
    
    conn.commit()
    
    # Update recent reports with correct task counts
    for days_ago in range(5, -1, -1):
        task_date = today - timedelta(days=days_ago)
        week_start = task_date - timedelta(days=task_date.weekday())
        
        report = conn.execute(
            "SELECT ID FROM Report WHERE User_ID = ? AND Week_Start = ?",
            (member_id, week_start)
        ).fetchone()
        
        if report:
            report_id = report[0]
            cursor = conn.execute(
                "SELECT COUNT(*) as count FROM Task WHERE Report_ID = ? AND Completed_At IS NOT NULL AND is_incomplete = 0",
                (report_id,)
            )
            tasks_completed = cursor.fetchone()['count']
            practice_hours = round(tasks_completed * 0.6, 1)
            conn.execute(
                "UPDATE Report SET Total_Tasks_Completed = ?, Total_Practice_Hours = ? WHERE ID = ?",
                (tasks_completed, practice_hours, report_id)
            )
    
    conn.commit()
    
    # Create companions for all users
    companion_types = ["Dog", "Cat", "Rabbit", "Hamster", "Parrot"]
    user_ids = [admin_id, mod_id, member_id]
    
    for idx, user_id in enumerate(user_ids):
        companion_type = companion_types[idx % len(companion_types)]
        happiness = 100 if idx == 2 else 80  # Member has higher happiness
        
        conn.execute("""
            INSERT INTO Companion (User_ID, Type, Happiness)
            VALUES (?, ?, ?)
        """, (user_id, companion_type, happiness))
    
    conn.commit()
    
    # Award pets to member for completing quarters (Q1, Q2, Q3)
    pet_names = ["Bunny", "Fox", "Red Panda"]
    skills = ["Time-Management", "Communication", "Problem-Solving"]
    
    for quarter in range(1, 4):
        conn.execute("""
            INSERT INTO UserPet (User_ID, Pet_Name, Skill, Quarter_Number, Awarded_At)
            VALUES (?, ?, ?, ?, ?)
        """, (member_id, pet_names[quarter-1], skills[quarter-1], quarter, datetime.now()))
    
    conn.commit()
    
    print(f"✅ Created test database: {DB_PATH}")
    print(f"📊 Test Data Summary:")
    print(f"   - Admin: admin@test.com (password: admin123)")
    print(f"   - Moderator: mod@test.com (password: mod123) - Manages 'Dev Team'")
    print(f"   - Member: member@test.com (password: member123) - In 'Dev Team'")
    print(f"   - Member has 13 weeks of historical reports + current week active report")
    print(f"   - Member streak calculated: {streak} days (from recent task completions)")
    print(f"   - Member has 3 awarded companion pets (Bunny, Fox, Red Panda)")
    print(f"   - Current week report marked as complete for 'Improvement Progress' display")
    print(f"   - All users have companions created in Companion table")
    print(f"   - Ready to test quarterly report generation!")

if __name__ == "__main__":
    conn = init_test_db()
    insert_test_data(conn)
    conn.close()
