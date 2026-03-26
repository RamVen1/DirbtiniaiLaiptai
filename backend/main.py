import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import init_db
from core.config import settings
from auth.router import router as auth_router
from tasks.router import router as tasks_router
from moderate.router import router as moderate_router
from admin.router import router as admin_router
from group.router import router as group_router

app = FastAPI(title=settings.PROJECT_NAME)

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(moderate_router)
app.include_router(admin_router)
app.include_router(group_router)

@app.get("/")
def read_root():
    return {"status": "online"}
def read_root():
    return {"status": "online"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)