from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import BaseModel


class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    username: Optional[str] = None


class AdminLogin(BaseModel):
    username: str
    password: str
