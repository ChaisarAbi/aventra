from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models.project import Project, ProjectPublic
from utils.database import get_session

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectPublic])
def get_projects(
    session: Session = Depends(get_session),
    featured: bool = None,
    limit: int = 100
):
    """Get all projects (optionally filtered by featured status)"""
    statement = select(Project)
    
    if featured is not None:
        statement = statement.where(Project.featured == featured)
    
    statement = statement.limit(limit)
    
    projects = session.exec(statement).all()
    return projects


@router.get("/{slug}", response_model=ProjectPublic)
def get_project_by_slug(slug: str, session: Session = Depends(get_session)):
    """Get a specific project by slug"""
    project = session.exec(select(Project).where(Project.slug == slug)).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.get("/id/{project_id}", response_model=ProjectPublic)
def get_project_by_id(project_id: int, session: Session = Depends(get_session)):
    """Get a specific project by ID"""
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project
