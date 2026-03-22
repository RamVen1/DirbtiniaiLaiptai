import os
import sqlite3
import bcrypt
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from datetime import datetime, timedelta
from jose import JWTError, jwt

#Kolkas login verification su JWT info cia
SECRET_KEY = "72j0rJhL2IUeedeP4B5UX0Z04N7FuhC1WygKwwLfIEJ"

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
    with get_db_connection() as conn:
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS User (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Username TEXT UNIQUE NOT NULL,
                Email TEXT UNIQUE NOT NULL,
                Password TEXT NOT NULL,
                Role TEXT NOT NULL DEFAULT '{UserRole.Member.value}',
                streak INTEGER DEFAULT 0,
                skill TEXT NULL
            )
        """)

        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Task (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Task_content TEXT,
                Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS RoleRequest (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                Status TEXT NOT NULL DEFAULT '{RequestStatus.Pending.value}',
                User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Report (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Start DATETIME,
                End DATETIME,
                CompletionRate REAL,
                User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)   
            )
        """)
        
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Companion (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Happiness INTEGER DEFAULT 100,
                 Type TEXT NOT NULL DEFAULT '{CompanionType.Dog.value}',
                 User_ID INTEGER,
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS Team (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Code TEXT UNIQUE,
                ModeratorID INTEGER,
                FOREIGN KEY (ModeratorID) REFERENCES User (ID)
            )
        """)

        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS TeamMembers (
                Team_ID INTEGER,
                User_ID INTEGER,
                PRIMARY KEY (Team_ID, User_ID),
                FOREIGN KEY (Team_ID) REFERENCES Team (ID),
                FOREIGN KEY (User_ID) REFERENCES User (ID)
            )
        """)
        conn.commit()

init_db()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7) # Tokenas kolkas 7 dienom galioja
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

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
        
        token = create_access_token(data={"sub": str(db_user["ID"])})
        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": db_user["ID"],
                "username": db_user["Username"],
                "role": db_user["Role"]
            }
        }

def generate_daily_task(user_id: int):
    prompt = "Generate a single, short, productive daily task for someone trying to learn time management Keep it under 20 words."
    response = model.generate_content(prompt)
    task_text = response.text.strip()
    
    with get_db_connection() as conn:
        conn.execute("INSERT INTO task (task_content, User_ID) VALUES (?, ?)", (task_text, user_id))
        conn.commit()
    return task_text

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/task")
def get_task(current_user_id: str = Depends(get_current_user)):
    with get_db_connection() as conn:
        task = conn.execute("SELECT * FROM task WHERE User_ID = ? ORDER BY id DESC LIMIT 1", (current_user_id,)).fetchone()
    
    if not task:
        new_task = generate_daily_task(int(current_user_id))
        return {"task": new_task}
        
    return {"task": task["task_content"]}

@app.post("/refresh-task")
def refresh_task(current_user_id: str = Depends(get_current_user)):
    refreshed_task = generate_daily_task(int(current_user_id))
    return {"task": refreshed_task}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)