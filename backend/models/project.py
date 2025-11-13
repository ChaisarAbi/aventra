from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import EmailStr


class ProjectBase(SQLModel):
    title: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    description: str
    content: str  # Markdown content
    technologies: str  # Comma-separated list
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool = False
    image_url: Optional[str] = None
    status: str = "completed"  # completed, in-progress, planned


class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(SQLModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    technologies: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: Optional[bool] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class ProjectPublic(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ContactMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
