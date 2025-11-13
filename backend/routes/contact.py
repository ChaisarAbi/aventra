from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/contact", tags=["contact"])

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

@router.post("/")
def send_contact_message(contact: ContactRequest):
    """
    Send a contact message.
    In a real implementation, this would send an email or save to database.
    """
    try:
        # Validate input
        if not contact.name or not contact.email or not contact.message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="All fields are required"
            )
        
        # Basic email validation
        if "@" not in contact.email or "." not in contact.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )
        
        # In a real implementation, you would:
        # 1. Save to database
        # 2. Send email notification
        # 3. Log the message
        
        # For now, just return success
        return {
            "message": "Contact message received successfully",
            "details": {
                "name": contact.name,
                "email": contact.email,
                "message_length": len(contact.message)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process contact message"
        )
