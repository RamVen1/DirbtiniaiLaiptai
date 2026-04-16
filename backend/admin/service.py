from core.database import RequestStatus, UserRole
from datetime import datetime

def check_existing_request(conn, user_id: int):
    cursor = conn.execute(
        "SELECT 1 FROM RoleRequest WHERE User_ID = ? AND Status = ?", 
        (user_id, RequestStatus.Pending.value)
    )
    return cursor.fetchone() is not None

def create_role_request(conn, user_id: int):
    conn.execute(
        "INSERT INTO RoleRequest (User_ID) VALUES (?)", 
        (user_id,)
    )
    conn.commit()

def get_all_pending_requests(conn):
    cursor = conn.execute("""
        SELECT r.ID, r.RequestDate, u.Email 
        FROM RoleRequest r
        JOIN User u ON r.User_ID = u.ID
        WHERE r.Status = ?
    """, (RequestStatus.Pending.value,))
    return cursor.fetchall()

def get_request_summary(conn):
    pending_cursor = conn.execute(
        "SELECT COUNT(*) AS count FROM RoleRequest WHERE Status = ?",
        (RequestStatus.Pending.value,)
    )
    pending_count = pending_cursor.fetchone()["count"]

    handled_rows = conn.execute("""
        SELECT r.ID, r.Status, r.RequestDate, r.ProcessedDate, u.Email AS UserEmail, a.Email AS AdminEmail
        FROM RoleRequest r
        JOIN User u ON r.User_ID = u.ID
        LEFT JOIN User a ON r.Admin_ID = a.ID
        WHERE r.ProcessedDate IS NOT NULL
        ORDER BY r.ProcessedDate DESC
        LIMIT 3
    """).fetchall()

    handled_requests = [dict(row) for row in handled_rows]

    return {
        "pending_count": pending_count,
        "latest_handled": handled_requests[0] if handled_requests else None,
        "recent_handled_requests": handled_requests,
    }

def process_request(conn, req_id: int, action: str, admin_id: int):
    status = RequestStatus.Accepted.value if action == "Accept" else RequestStatus.Denied.value
    
    cursor = conn.execute("SELECT User_ID FROM RoleRequest WHERE ID = ?", (req_id,))
    row = cursor.fetchone()
    if not row:
        return

    user_id = row["User_ID"]

    conn.execute("""
        UPDATE RoleRequest 
        SET Status = ?, Admin_ID = ?, ProcessedDate = ? 
        WHERE ID = ?
    """, (status, admin_id, datetime.utcnow(), req_id))

    if action == "Accept":
        conn.execute(
            "UPDATE User SET Role = ? WHERE ID = ?", 
            (UserRole.Moderator.value, user_id)
        )
    
    conn.commit()