import os
import sqlite3
import bcrypt
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
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS User (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Username TEXT UNIQUE NOT NULL,
                Email TEXT UNIQUE NOT NULL,
                Password TEXT NOT NULL,
                Role TEXT DEFAULT 'Member',
                streak INTEGER NULL,
                skill TEXT NULL
            )
        """)
        conn.commit()

init_db()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
PORT = int(os.getenv("PORT", 8000))
model = genai.GenerativeModel('models/gemini-2.5-flash')

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

@app.post("/register")
def register_user(user: RegisterRequest):

    if len(user.password) < 7:
        raise HTTPException(status_code=400, detail="Password must be at least 7 characters long.")
    
    with get_db_connection() as conn:
        existing_user = conn.execute(
            "SELECT * FROM User WHERE Username = ? OR Email = ?", 
            (user.username, user.email)
        ).fetchone()
        
        if existing_user:
            if existing_user["Username"] == user.username:
                raise HTTPException(status_code=400, detail="Username already exists.")
            if existing_user["Email"] == user.email:
                raise HTTPException(status_code=400, detail="Email already exists.")
        
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        conn.execute(
            "INSERT INTO User (Username, Email, Password, Role) VALUES (?, ?, ?, 'Member')",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
        
    return {"message": "Account created successfully"}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login_user(user: LoginRequest):
    with get_db_connection() as conn:
        db_user = conn.execute(
            "SELECT * FROM User WHERE Email = ?", 
            (user.email,)
        ).fetchone()
        
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        is_valid = bcrypt.checkpw(
            user.password.encode('utf-8'), 
            db_user["Password"].encode('utf-8')
        )
        
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        return {
            "message": "Login successful",
            "user": {
                "id": db_user["ID"],
                "username": db_user["Username"],
                "role": db_user["Role"]
            }
        }

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