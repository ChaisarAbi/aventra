from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from models.project import Project, ProjectCreate, ProjectUpdate, ProjectPublic
from utils.database import get_session
from utils.auth import verify_token

load_dotenv()

router = APIRouter(prefix="/api/admin", tags=["admin"])

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Static admin credentials (simple and direct)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "abi")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


def authenticate_user(username: str, password: str):
    """Simple authentication without bcrypt"""
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/login")
def login(credentials: dict):
    """Simple login endpoint without OAuth2 complexity"""
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    if not authenticate_user(username, password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/projects", response_model=List[ProjectPublic])
def get_admin_projects(
    session: Session = Depends(get_session),
    token: str = Depends(verify_token)
):
    """Get all projects (admin only)"""
    projects = session.exec(select(Project)).all()
    return projects


@router.post("/projects", response_model=ProjectPublic)
def create_project(
    project: ProjectCreate,
    session: Session = Depends(get_session),
    token: str = Depends(verify_token)
):
    """Create a new project (admin only)"""
    # Check if slug already exists
    existing_project = session.exec(
        select(Project).where(Project.slug == project.slug)
    ).first()
    if existing_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project with this slug already exists"
        )
    
    db_project = Project.from_orm(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@router.put("/projects/{project_id}", response_model=ProjectPublic)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    session: Session = Depends(get_session),
    token: str = Depends(verify_token)
):
    """Update a project (admin only)"""
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if slug already exists (if slug is being updated)
    if project_update.slug and project_update.slug != db_project.slug:
        existing_project = session.exec(
            select(Project).where(Project.slug == project_update.slug)
        ).first()
        if existing_project:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project with this slug already exists"
            )
    
    project_data = project_update.dict(exclude_unset=True)
    for key, value in project_data.items():
        setattr(db_project, key, value)
    
    db_project.updated_at = datetime.utcnow()
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    token: str = Depends(verify_token)
):
    """Delete a project (admin only)"""
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    session.delete(db_project)
    session.commit()
    return {"message": "Project deleted successfully"}
