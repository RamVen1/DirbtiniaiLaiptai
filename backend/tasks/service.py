import google.generativeai as genai
from sqlite3 import Connection
from core.config import settings
from core.database import get_db

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

def get_latest_task(db: Connection):
    return db.execute("SELECT * FROM task ORDER BY id DESC LIMIT 1").fetchone()

def generate_daily_task(user_id: int):

    conn = get_db()
    skill = conn.execute("SELECT Skill FROM User WHERE ID = ?", (user_id,)).fetchone()
    difficulty = conn.execute("SELECT difficulty FROM User WHERE ID = ?", (user_id,)).fetchone()
    prompt = "Generate a short productive daily task for someone who is trying to learn {skill} at a {difficulty} difficulty level. Imagine difficulty is a a slider from 0 to 5. 0 being a beginner and 5 expert. Keep the answer to just the task and under 20 words.".format(skill=skill["Skill"], difficulty=difficulty["difficulty"])
    response = model.generate_content(prompt)
    task_text = response.text.strip()
    
    try:
        conn.execute("INSERT INTO task (task_content, User_ID) VALUES (?, ?)", (task_text, user_id))
        conn.commit()
    finally:
        conn.close()
    return task_text