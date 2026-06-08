from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import os
from database import get_db
from crud_user import get_user_by_email, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])
SECRET_KEY = "parkoptima-secret-key-change-in-production"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    full_name: str
    email: str
    role: str

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=8))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=LoginResponse)
def login(login: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, login.email)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_role = user.role.value if hasattr(user.role, 'value') else str(user.role)
    if user_role != login.role.lower():
        raise HTTPException(status_code=403, detail=f"This account is not registered as {login.role}")
    
    user.last_login = datetime.now()
    db.commit()
    
    token = create_access_token(data={"sub": user.email, "role": user_role})
    
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        role=user_role
    )

@router.post("/login", response_model=LoginResponse)
def login(login: LoginRequest, db: Session = Depends(get_db)):
    print(f"Looking for email: {login.email}")
    
    user = get_user_by_email(db, login.email)
    
    if not user:
        print(f"User not found: {login.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print(f"User found: {user.email}, role: {user.role}")
    print(f"Password from DB: {user.password_hash}")
    print(f"Password from request: {login.password}")
    
    if not verify_password(login.password, user.password_hash):
        print("Password verification failed")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print("Password verified!")