from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user
from . import service, schemas

router = APIRouter(prefix="/moderate", tags=["moderate"])

@router.get("/teams")
def list_my_teams(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        teams = service.get_moderator_teams(conn, int(current_user_id))
        return {"teams": [dict(t) for t in teams]}

@router.post("/teams/create")
def create_team(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        new_team = service.create_new_team(conn, int(current_user_id))
        return new_team

@router.delete("/teams/{team_id}")
def remove_team(team_id: int, current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        success = service.delete_team(conn, team_id, int(current_user_id))
        if not success:
            raise HTTPException(status_code=404, detail="Team not found or unauthorized")
        return {"message": "Team deleted successfully"}