import bcrypt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.params import Header
from jose import JWTError, jwt
from .config import settings
from core.database import get_db

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, str(settings.JWT_SECRET_KEY), algorithm="HS256")

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

def get_current_user_with_role(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        user = conn.execute(
            "SELECT ID, Role FROM User WHERE ID = ?", 
            (current_user_id,)
        ).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return dict(user)

def role_required(allowed_roles: list):
    def role_checker(user=Depends(get_current_user_with_role)):
        if user["Role"].lower() not in [r.lower() for r in allowed_roles]:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user
    return role_checker

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))