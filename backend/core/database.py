import sqlite3
from .config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(settings.DB_NAME)
    with conn:
        # User Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS User (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Username TEXT UNIQUE NOT NULL,
                Email TEXT UNIQUE NOT NULL,
                Password TEXT NOT NULL,
                Role TEXT DEFAULT 'Member',
                streak INTEGER DEFAULT 0,
                skill TEXT NULL
            )
        """)
        # Task Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS task (
                id INTEGER PRIMARY KEY, 
                task_content TEXT, 
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    conn.close()