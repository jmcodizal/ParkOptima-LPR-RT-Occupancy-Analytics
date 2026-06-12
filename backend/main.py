from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, auth, password, logout
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ParkOptima API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(password.router)
app.include_router(logout.router)

@app.get("/")
def root():
    return {"message": "ParkOptima API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}