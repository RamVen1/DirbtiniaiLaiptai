from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user, role_required
from . import service

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/request-moderator")
def request_role(current_user_id: str = Depends(get_current_user)):
    with get_db() as conn:
        if service.check_existing_request(conn, int(current_user_id)):
            raise HTTPException(status_code=400, detail="Request already pending.")
        service.create_role_request(conn, int(current_user_id))
        return {"message": "Success"}

@router.get("/requests")
def get_requests(admin=Depends(role_required(["admin"]))):
    with get_db() as conn:
        reqs = service.get_all_pending_requests(conn)
        return {"requests": [dict(r) for r in reqs]}

@router.post("/requests/{req_id}/action")
def take_action(req_id: int, payload: dict, admin=Depends(role_required(["admin"]))):
    action = payload.get("action")
    with get_db() as conn:
        service.process_request(conn, req_id, action)
        return {"message": "Processed"}