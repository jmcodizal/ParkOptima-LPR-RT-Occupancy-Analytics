from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from database import get_db
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])

class ForgotPasswordRequest(BaseModel):
    email: str

def send_reset_email(recipient_email: str, reset_token: str):
    """Background task to send email"""
    sender_email = "parkoptima.capstone@gmail.com"  
    sender_password = "ukrw jfet wjvk ynsa"
    sender_name = "ParkOptima Support"   
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    subject = "ParkOptima Password Reset"
    body = f"""
    <html>
    <body>
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for ParkOptima.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="http://localhost:5173/reset-password?token={reset_token}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
    </body>
    </html>
    """
    
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))
    
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("SELECT user_id, email FROM users WHERE email = :email"),
        {"email": request.email}
    )
    user = result.first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    import secrets
    reset_token = secrets.token_urlsafe(32)
    
    background_tasks.add_task(send_reset_email, request.email, reset_token)
    
    return {"message": "Password reset link sent to your email"}