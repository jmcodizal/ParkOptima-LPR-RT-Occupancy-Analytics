from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel, EmailStr
from typing import List
from database import get_db
from crud_user import create_user, get_user_by_email, get_all_users, update_user, delete_user
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/users", tags=["users"])
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    role: str
    phone_number: str = None

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: str
    created_at: str
    status: str = "Active"

def verify_token_and_session(authorization: str, db: Session):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        user_role = payload.get("role")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = db.execute(
        text("SELECT is_active FROM sessions WHERE token = :token AND is_active = TRUE"),
        {"token": token}
    )
    session = result.first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or logged out")
    
    return {"email": user_email, "role": user_role, "token": token}

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.role not in ["owner", "attendant"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    db_user = create_user(
        db=db,
        full_name=user.full_name,
        email=user.email,
        password=user.password,
        role=user.role
    )
    
    return UserResponse(
        user_id=db_user.user_id,
        full_name=db_user.full_name,
        email=db_user.email,
        role=db_user.role,
        created_at=db_user.created_at.isoformat()
    )

@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    auth_info = verify_token_and_session(authorization, db)
    
    if auth_info["role"] != "owner":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    users = get_all_users(db, skip=skip, limit=limit)
    return [
        UserResponse(
            user_id=u.user_id,
            full_name=u.full_name,
            email=u.email,
            role=u.role,
            created_at=u.created_at.isoformat()
        ) for u in users
    ]

@router.put("/{user_id}", response_model=UserResponse)
def edit_user(
    user_id: int, 
    full_name: str = None, 
    email: str = None, 
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    auth_info = verify_token_and_session(authorization, db)
    
    if auth_info["role"] != "owner":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    user = update_user(db, user_id, full_name, email)
    return UserResponse(
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat()
    )

@router.delete("/{user_id}")
def remove_user(
    user_id: int, 
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    auth_info = verify_token_and_session(authorization, db)
    
    if auth_info["role"] != "owner":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    delete_user(db, user_id)
    return {"message": "User deleted successfully"}