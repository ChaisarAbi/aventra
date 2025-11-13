# Aventra Portfolio Website

Personal portfolio website for `aventra.my.id` built with Next.js 15 and FastAPI.

## 🚀 Tech Stack

### Frontend
- Next.js 15 (React 19)
- Tailwind CSS + shadcn/ui
- TypeScript
- Framer Motion
- Port: 3501

### Backend
- FastAPI (Python 3.11+)
- SQLModel + SQLite
- JWT Authentication
- Port: 8001

## 📁 Project Structure

```
aventra-portfolio/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
└── docker-compose.yml # Docker deployment
```

## 🛠️ Development

### Backend
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npm run dev -- --port 3501
```

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

## 🔐 Admin Access
- Username: aventra
- Password: Leaveempty1!
- Access: `/admin/login`
