from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user
from . import service
from pydantic import BaseModel

router = APIRouter(prefix="/group", tags=["group"])

class JoinRequest(BaseModel):
    code: str
    skill: str

@router.post("/join")
def join_group(payload: JoinRequest, current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        result = service.join_team_by_code(
            conn, 
            int(current_user_id), 
            payload.code.upper(), 
            payload.skill
        )
        
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
            
        return {"status": "ok", "team_id": result["team_id"]}
    
@router.post("/leave")
def leave_group(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        service.leave_team(conn, int(current_user_id))
        return {"status": "ok", "message": "Left the team and cleared skill"}