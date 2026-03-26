import uuid
from sqlite3 import Connection

def get_moderator_teams(db: Connection, moderator_id: int):
    cursor = db.execute("SELECT * FROM Team WHERE ModeratorID = ?", (moderator_id,))
    return cursor.fetchall()

def create_new_team(db: Connection, moderator_id: int):
    new_code = str(uuid.uuid4()).replace("-", "").upper()[:8]
    
    cursor = db.execute(
        "INSERT INTO Team (Code, ModeratorID) VALUES (?, ?)",
        (new_code, moderator_id)
    )
    db.commit()
    
    return {"ID": cursor.lastrowid, "Code": new_code, "ModeratorID": moderator_id}

def delete_team(db: Connection, team_id: int, moderator_id: int):
    cursor = db.execute(
        "DELETE FROM Team WHERE ID = ? AND ModeratorID = ?", 
        (team_id, moderator_id)
    )
    db.commit()
    return cursor.rowcount > 0