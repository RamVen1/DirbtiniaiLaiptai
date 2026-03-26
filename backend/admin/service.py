from sqlite3 import Connection
from datetime import datetime

def check_existing_request(db: Connection, user_id: int):
    return db.execute("SELECT 1 FROM RoleRequest WHERE User_ID = ?", (user_id,)).fetchone()

def create_role_request(db: Connection, user_id: int):
    date_str = datetime.now().strftime("%Y-%m-%d")
    db.execute(
        "INSERT INTO RoleRequest (RequestDate, Status, User_ID) VALUES (?, ?, ?)",
        (date_str, "Pending", user_id)
      )
    db.commit()

def get_all_pending_requests(db: Connection):
    cursor = db.execute("""
        SELECT rr.ID, rr.RequestDate, rr.Status, u.Email 
        FROM RoleRequest rr 
        JOIN User u ON rr.User_ID = u.id 
        WHERE rr.Status = 'Pending'
    """)
    return cursor.fetchall()

def process_request(db: Connection, request_id: int, action: str):
    row = db.execute("SELECT User_ID FROM RoleRequest WHERE ID = ?", (request_id,)).fetchone()
    if not row: return False
    
    user_id = row["User_ID"]
    if action == "Accept":
        db.execute("UPDATE User SET Role = 'Moderator' WHERE id = ?", (user_id,))
    
    db.execute("DELETE FROM RoleRequest WHERE ID = ?", (request_id,))
    db.commit()
    return True