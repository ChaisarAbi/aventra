from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "aventra",
                "password": "Leaveempty1!"
            }
        }
    }
