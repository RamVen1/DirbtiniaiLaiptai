import sqlite3
from enum import Enum
from .config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

class RequestStatus(str, Enum):
    Pending = "Pending"
    Accepted = "Accepted"
    Denied = "Denied"

class UserRole(str, Enum):
    Member = "Member"
    Moderator = "Moderator"
    Admin = "Admin"

class CompanionType(str, Enum):
    Dog = "Dog"
    Cat = "Cat" #PLACEHOLDER COMPANIONS

def init_db():
    conn = get_db()
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS User (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT UNIQUE NOT NULL,
            Email TEXT UNIQUE NOT NULL,
                Password TEXT NOT NULL,
                Role TEXT NOT NULL DEFAULT '{UserRole.Member.value}',
                streak INTEGER DEFAULT 0,
                skill TEXT NULL,
                difficulty INTEGER NULL DEFAULT 0,
                team_id INTEGER NULL,
                FOREIGN KEY (team_id) REFERENCES Team (Id)
            )
        """)

    conn.execute(f"""
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

    conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Task (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Task_content TEXT,
                Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                User_ID INTEGER,
                Report_ID INTEGER,
                Completed_At TIMESTAMP NULL,
                Difficulty_Rating INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID),
                FOREIGN KEY (Report_ID) REFERENCES Report (ID)
            )
        """)
        
    conn.execute(f"""
            CREATE TABLE IF NOT EXISTS RoleRequest (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                Status TEXT NOT NULL DEFAULT '{RequestStatus.Pending.value}',
                User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        

        
    conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Companion (
                 ID INTEGER PRIMARY KEY AUTOINCREMENT,
                 Happiness INTEGER DEFAULT 100,
                 Type TEXT NOT NULL DEFAULT '{CompanionType.Dog.value}',
                 User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        
    conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Team (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Code TEXT UNIQUE,
                ModeratorID INTEGER,
                FOREIGN KEY (ModeratorID) REFERENCES User (ID)
            )
        """)
    conn.commit()