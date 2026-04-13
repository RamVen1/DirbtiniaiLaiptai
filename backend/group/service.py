from sqlite3 import Connection

def join_team_by_code(db: Connection, user_id: int, code: str, skill: str):
    team = db.execute("SELECT ID FROM Team WHERE Code = ?", (code,)).fetchone()
    
    if not team:
        return {"success": False, "message": "Invalid team code"}

    team_id = team["ID"]

    db.execute(
        "UPDATE User SET team_id = ?, skill = ? WHERE id = ?", 
        (team_id, skill, user_id)
    )
    db.commit()
    
    return {"success": True, "team_id": team_id}

def leave_team(db: Connection, user_id: int):
    db.execute("UPDATE User SET team_id = NULL, skill = NULL WHERE id = ?", (user_id,))
    db.commit()
    return True