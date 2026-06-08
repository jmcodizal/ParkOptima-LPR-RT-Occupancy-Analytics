from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List
from database import get_db
from crud_user import create_user, get_user_by_email, get_all_users, update_user, delete_user

router = APIRouter(prefix="/api/users", tags=["users"])

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
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
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
def edit_user(user_id: int, full_name: str = None, email: str = None, db: Session = Depends(get_db)):
    user = update_user(db, user_id, full_name, email)
    return UserResponse(
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat()
    )

@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    delete_user(db, user_id)
    return {"message": "User deleted successfully"}