from pydantic import BaseModel
from typing import List

class TeamBase(BaseModel):
    ID: int
    Code: str
    ModeratorID: int

    class Config:
        from_attributes = True

class TeamCreate(BaseModel):
    pass

class TeamResponse(BaseModel):
    teams: List[TeamBase]