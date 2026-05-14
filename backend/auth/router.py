import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from sqlite3 import Connection
from core.database import get_db
from core.security import create_access_token, get_current_user
from . import service, schemas
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="", tags=["auth"])

class UpdateProfileRequest(BaseModel):
    username: str
    email: str
    avatar_index: int
    old_password: Optional[str] = None
    new_password: Optional[str] = None

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
        
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

        conn.execute(
            "INSERT INTO User (Username, Email, Password, Role, avatar_index) VALUES (?, ?, ?, 'Member', 0)",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
    finally:
        conn.close()
        
    return {"message": "Account created successfully"}

@router.post("/login")
def login_user(user: schemas.LoginRequest):
    conn = get_db()
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

    db_val = db_user_dict["Password"]
    if isinstance(db_val, str):
        normalized_hash = db_val.replace("$2b$", "$2a$")
        stored_hash_bytes = normalized_hash.encode('utf-8')
    else:
        stored_hash_bytes = db_val

    is_valid = bcrypt.checkpw(
        user.password.encode('utf-8'), 
        stored_hash_bytes
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
            "role": db_user_dict["Role"].lower() if db_user_dict["Role"] else "member",
            "team_id": db_user_dict.get("team_id"),
            "avatar_index": db_user_dict.get("avatar_index", 0)
        }
    }

@router.get("/me")
def get_current_user_data(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        user = conn.execute(
            "SELECT ID, Email, Role, team_id, Username, avatar_index FROM User WHERE ID = ?", 
            (current_user_id,)
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        u_dict = dict(user)
        return {
            "id": u_dict["ID"],
            "email": u_dict["Email"],
            "role": u_dict["Role"].lower() if u_dict["Role"] else "member",
            "team_id": u_dict.get("team_id"),
            "username": u_dict["Username"],
            "avatar_index": u_dict.get("avatar_index", 0)
        }

@router.put("/me")
def update_profile(data: UpdateProfileRequest, current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        try:
            db_user = conn.execute(
                "SELECT Password FROM User WHERE ID = ?", (current_user_id,)
            ).fetchone()
            
            if not db_user:
                raise HTTPException(status_code=404, detail="User not found")

            hashed_new_password = None

            if data.old_password and data.new_password:
                db_val = db_user["Password"]
                if isinstance(db_val, str):
                    normalized_hash = db_val.replace("$2b$", "$2a$")
                    stored_hash_bytes = normalized_hash.encode('utf-8')
                else:
                    stored_hash_bytes = db_val

                if not bcrypt.checkpw(data.old_password.encode('utf-8'), stored_hash_bytes):
                    raise HTTPException(status_code=400, detail="Neteisingas dabartinis slaptažodis.")

                if len(data.new_password) < 7:
                    raise HTTPException(status_code=400, detail="Naujas slaptažodis turi būti bent 7 simbolių.")

                hashed_new_password = bcrypt.hashpw(data.new_password.encode('utf-8'), bcrypt.gensalt())

            updated_user = service.update_user_profile(
                conn, 
                int(current_user_id), 
                data.username, 
                data.email,
                data.avatar_index,
                hashed_new_password
            )
            
            if not updated_user:
                raise HTTPException(status_code=404, detail="User not found")
            
            u_dict = dict(updated_user)
            if "Password" in u_dict: del u_dict["Password"]
            return u_dict

        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"Error updating profile: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
    with get_db() as conn:
        try:
            updated_user = service.update_user_profile(
                conn, 
                int(current_user_id), 
                data.username, 
                data.email,
                data.avatar_index
            )
            if not updated_user:
                raise HTTPException(status_code=404, detail="User not found")
            
            return dict(updated_user)
        except Exception as e:
            print(f"Error updating profile: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/history")
def get_user_history(current_user_id: str = Depends(get_current_user)):
    conn = get_db()
    try:
        history = service.get_user_report_history(conn, int(current_user_id))
        return {"history": history}
    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@router.get("/report-history")
def get_grouped_report_history(current_user_id: str = Depends(get_current_user)):
    conn = get_db()
    try:
        grouped_history = service.get_grouped_report_history(conn, int(current_user_id))
        return {"grouped_history": grouped_history}
    except Exception as e:
        print(f"Error fetching grouped history: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@router.get("/activity")
def get_activity(current_user_id: str = Depends(get_current_user)):
    conn = get_db()
    try:
        dates = service.get_user_activity_dates(conn, int(current_user_id))
        return {"completed_dates": dates}
    except Exception as e:
        print(f"Error fetching activity: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@router.get("/stats")
def get_user_stats(current_user_id: str = Depends(get_current_user)):
    conn = get_db()
    try:
        stats = service.get_user_rank_stats(conn, int(current_user_id))
        return stats
    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()