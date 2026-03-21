import google.generativeai as genai
from sqlite3 import Connection
from core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')

def get_latest_task(db: Connection):
    return db.execute("SELECT * FROM task ORDER BY id DESC LIMIT 1").fetchone()

def generate_new_task(db: Connection):
    prompt = "Generate a single, short, productive daily task for time management. Under 20 words."
    response = model.generate_content(prompt)
    task_text = response.text.strip()
    
    db.execute("INSERT INTO task (task_content) VALUES (?)", (task_text,))
    db.commit()
    return task_text