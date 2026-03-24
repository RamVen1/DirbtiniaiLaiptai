import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from sqlite3 import Connection
from core.database import get_db
from core.security import create_access_token
from . import service, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register_user(user: schemas.RegisterRequest):
    if len(user.password) < 7:
        raise HTTPException(status_code=400, detail="Password must be at least 7 characters long.")
    
    conn = get_db()
    try:
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
    finally:
        conn.close()
        
    return {"message": "Account created successfully"}

@router.post("/login")
def login_user(user: schemas.LoginRequest):
    conn = get_db
    try:
        db_user = conn.execute(
            "SELECT * FROM User WHERE Email = ?",
            (user.email,)
        ).fetchone()
        db_user_dict = dict(db_user) if db_user else None
    finally:
        conn.close()

    if not db_user_dict:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    stored_hash = db_user_dict["Password"].replace("$2b$", "$2a$")

    is_valid = bcrypt.checkpw(
        user.password.encode('utf-8'),
        stored_hash.encode('utf-8')
    )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(data={"sub": str(db_user_dict["ID"])})
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": db_user_dict["ID"],
            "username": db_user_dict["Username"],
            "role": db_user_dict["Role"]
        }
    }
