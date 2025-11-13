from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "message": "Hello, I'm interested in your work!",
                "created_at": "2024-01-01T12:00:00"
            }
        }
    )
