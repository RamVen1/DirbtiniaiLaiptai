import google.generativeai as genai
from sqlite3 import Connection
from core.config import settings
from core.database import get_db

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

def get_latest_task(db: Connection):
    return db.execute("SELECT * FROM task ORDER BY id DESC LIMIT 1").fetchone()

def generate_daily_task(user_id: int):
    prompt = "Generate a single, short, productive daily task for someone trying to learn time management. Keep it under 20 words."
    response = model.generate_content(prompt)
    task_text = response.text.strip()
    
    conn = get_db()
    try:
        conn.execute("INSERT INTO task (task_content, User_ID) VALUES (?, ?)", (task_text, user_id))
        conn.commit()
    finally:
        conn.close()
    return task_text