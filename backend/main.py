from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from utils.database import create_db_and_tables
from routes import projects, admin, contact, upload
from fastapi.staticfiles import StaticFiles


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    create_db_and_tables()
    yield


app = FastAPI(
    title="Abi Prasetyo Portfolio API",
    description="Backend API for Abi Prasetyo's personal portfolio website",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router)
app.include_router(admin.router)
app.include_router(contact.router)
app.include_router(upload.router)

# Serve static files (uploads)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Abi Prasetyo Portfolio API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
