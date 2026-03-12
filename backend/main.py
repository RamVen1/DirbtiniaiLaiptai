import os
import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY, task_content TEXT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
init_db()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
PORT = int(os.getenv("PORT", 8000))
model = genai.GenerativeModel('models/gemini-2.5-flash')

def generate_daily_task():
    prompt = "Generate a single, short, productive daily task for someone trying to learn time management Keep it under 20 words."
    response = model.generate_content(prompt)
    task_text = response.text.strip()
    
    with get_db_connection() as conn:
        conn.execute("INSERT INTO task (task_content) VALUES (?)", (task_text,))
    return task_text

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/task")
def get_task():
    with get_db_connection() as conn:
        task = conn.execute("SELECT * FROM task ORDER BY id DESC LIMIT 1").fetchone()
    
    if not task:
        new_task = generate_daily_task()
        return {"task": new_task}
        
    return {"task": task["task_content"]}

@app.post("/refresh-task")
def refresh_task():
    return {"task": generate_daily_task()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)