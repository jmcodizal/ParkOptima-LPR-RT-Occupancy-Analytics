from sqlalchemy.orm import Session
from models import User, UserRole
import bcrypt
from datetime import datetime

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_user(db: Session, full_name: str, email: str, password: str, role: str):
    hashed = hash_password(password)
    # Convert string to enum
    role_enum = UserRole.owner if role == "owner" else UserRole.attendant
    user = User(
        full_name=full_name,
        email=email,
        password_hash=hashed,
        role=role_enum,
        created_at=datetime.now()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, full_name: str = None, email: str = None):
    user = db.query(User).filter(User.user_id == user_id).first()
    if full_name:
        user.full_name = full_name
    if email:
        user.email = email
    user.updated_at = datetime.now()
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.user_id == user_id).first()
    db.delete(user)
    db.commit()
    return user