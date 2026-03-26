from sqlite3 import Connection

def join_team_by_code(db: Connection, user_id: int, code: str):
    # 1. Ieškome komandos pagal kodą
    team = db.execute("SELECT ID FROM Team WHERE Code = ?", (code,)).fetchone()
    
    if not team:
        return {"success": False, "message": "Invalid team code"}

    team_id = team["ID"]

    # 2. Atnaujiname vartotojo team_id
    db.execute("UPDATE User SET team_id = ? WHERE id = ?", (team_id, user_id))
    db.commit()
    
    return {"success": True, "team_id": team_id}

def leave_team(db: Connection, user_id: int):
    db.execute("UPDATE User SET team_id = NULL WHERE id = ?", (user_id,))
    db.commit()
    return True