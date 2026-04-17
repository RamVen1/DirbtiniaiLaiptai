import bcrypt
from sqlite3 import Connection
from .schemas import RegisterRequest

def get_user_by_email(db: Connection, email: str):
    return db.execute("SELECT * FROM User WHERE Email = ?", (email,)).fetchone()

def get_user_by_username(db: Connection, username: str):
    return db.execute("SELECT * FROM User WHERE Username = ?", (username,)).fetchone()

def create_user(db: Connection, user: RegisterRequest):
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.execute(
        "INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)",
        (user.username, user.email, hashed_pw)
    )
    db.commit()

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def update_user_profile(conn, user_id: int, username: str, email: str):
    conn.execute(
        "UPDATE User SET Username = ?, Email = ? WHERE ID = ?",
        (username, email, user_id)
    )
    conn.commit()
    
    cursor = conn.execute(
        "SELECT ID, Username as username, Email as email, Role as role, team_id FROM User WHERE ID = ?", 
        (user_id,)
    )
    return cursor.fetchone()