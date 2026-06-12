from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
import logging

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    authorization = request.headers.get("Authorization")
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    print(f"\n=== LOGOUT DEBUG ===")
    print(f"Token received: {token}")
    print(f"Token length: {len(token)}")
    
    result = db.execute(
        text("SELECT session_id, user_id, token, is_active FROM sessions WHERE token = :token"),
        {"token": token}
    )
    session = result.first()
    
    if session:
        print(f"Found exact match - Session ID: {session[0]}, is_active: {session[3]}")
        db.execute(
            text("UPDATE sessions SET is_active = FALSE WHERE session_id = :session_id"),
            {"session_id": session[0]}
        )
        db.commit()
        print("Session deactivated via exact match")
        return {"message": "Logged out successfully"}
    
    print("No exact match found, trying partial match...")
    token_prefix = token[:50]
    result2 = db.execute(
        text("SELECT session_id, user_id, LEFT(token, 50) as token_preview, is_active FROM sessions WHERE token LIKE :pattern AND is_active = TRUE"),
        {"pattern": f"{token_prefix}%"}
    )
    sessions = result2.fetchall()
    
    print(f"Found {len(sessions)} sessions with matching prefix")
    for s in sessions:
        print(f"  Session ID: {s[0]}, Token preview: {s[2]}")
        db.execute(
            text("UPDATE sessions SET is_active = FALSE WHERE session_id = :session_id"),
            {"session_id": s[0]}
        )
    db.commit()
    
    if len(sessions) > 0:
        return {"message": f"Logged out successfully ({len(sessions)} sessions deactivated)"}
    
    return {"message": "Session not found or already logged out"}