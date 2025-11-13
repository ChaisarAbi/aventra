import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["Upload"])

# Direktori untuk menyimpan gambar
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Pastikan direktori upload ada
os.makedirs(UPLOAD_DIR, exist_ok=True)

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload image file and return URL"""
    
    # Validasi file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
    
    # Validasi file type
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # Return URL yang lengkap (development/production)
    base_url = os.getenv("API_BASE_URL", "http://localhost:8001")
    image_url = f"{base_url}/uploads/{unique_filename}"
    
    return JSONResponse({
        "success": True,
        "image_url": image_url,
        "filename": unique_filename
    })
