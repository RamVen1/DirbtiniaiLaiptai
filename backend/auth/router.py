from fastapi import APIRouter, HTTPException, Depends
from sqlite3 import Connection
from core.database import get_db
from . import service, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: schemas.RegisterRequest, db: Connection = Depends(get_db)):
    if len(user.password) < 7:
        raise HTTPException(status_code=400, detail="Password too short.")
    
    if service.get_user_by_email(db, user.email) or service.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="User already exists.")
    
    service.create_user(db, user)
    return {"message": "User created"}

@router.post("/login")
def login(user: schemas.LoginRequest, db: Connection = Depends(get_db)):
    db_user = service.get_user_by_email(db, user.email)
    if not db_user or not service.verify_password(user.password, db_user["Password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful", "user": {"id": db_user["ID"], "username": db_user["Username"]}}