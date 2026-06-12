from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from database import get_db
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from datetime import datetime, timedelta
import bcrypt

router = APIRouter(prefix="/api/auth", tags=["auth"])

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def send_reset_email(recipient_email: str, reset_token: str):
    sender_email = "parkoptima.capstone@gmail.com"  
    sender_password = "ukrw jfet wjvk ynsa"
    sender_name = "ParkOptima Support"   
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ParkOptima Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table width="520" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
                        <tr>
                            <td style="padding: 40px 32px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <h2 style="color: #1a1a2e; font-size: 24px; margin: 0 0 12px 0; font-weight: 600;">Reset Your Password</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin: 0 0 28px 0;">We received a request to reset your password for your ParkOptima account.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <a href="{reset_link}" style="display: inline-block; background: #2D4A8F; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 8px 0 20px;">Reset Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <div style="background: #f7f9fc; padding: 12px; border-radius: 8px; font-size: 13px; color: #64748b; margin: 24px 0 0;">This link expires in 1 hour for security reasons.</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <div style="font-size: 12px; color: #94a3b8; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">If you didn't request this, please ignore this email.<br>Your password will remain unchanged.</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "Reset Your ParkOptima Password"
    msg.attach(MIMEText(html_template, 'html'))
    
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"Password reset email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS reset_tokens (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            INDEX idx_token (token)
        )
    """))
    db.commit()
    
    result = db.execute(
        text("SELECT user_id, email FROM users WHERE email = :email"),
        {"email": request.email}
    )
    user = result.first()
    
    if not user:
        return {"message": "If your email is registered, you will receive a reset link"}
    
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    db.execute(
        text("""
            INSERT INTO reset_tokens (user_id, token, expires_at, used)
            VALUES (:user_id, :token, :expires_at, FALSE)
        """),
        {
            "user_id": user[0], 
            "token": reset_token, 
            "expires_at": expires_at
        }
    )
    db.commit()
    
    background_tasks.add_task(send_reset_email, request.email, reset_token)
    
    return {"message": "If your email is registered, you will receive a reset link"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT user_id, expires_at, used 
            FROM reset_tokens 
            WHERE token = :token
        """),
        {"token": request.token}
    )
    token_data = result.first()
    
    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user_id = token_data[0]
    expires_at = token_data[1]
    used = token_data[2]
    
    if used:
        raise HTTPException(status_code=400, detail="Token already used")
    
    if datetime.utcnow() > expires_at:
        raise HTTPException(status_code=400, detail="Token expired")
    
    hashed = bcrypt.hashpw(request.new_password.encode('utf-8'), bcrypt.gensalt())
    
    db.execute(
        text("UPDATE users SET password_hash = :hash WHERE user_id = :user_id"),
        {"hash": hashed.decode('utf-8'), "user_id": user_id}
    )
    
    db.execute(
        text("UPDATE reset_tokens SET used = TRUE WHERE token = :token"),
        {"token": request.token}
    )
    
    db.execute(
        text("UPDATE sessions SET is_active = FALSE WHERE user_id = :user_id"),
        {"user_id": user_id}
    )
    
    db.commit()
    
    return {"message": "Password reset successfully"}