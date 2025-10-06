# Docker Setup for Book Management System

## Quick Start

### Run with Docker Compose (Recommended)
```bash
cd book-management-system
docker-compose up --build
```

### Access Applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432

## Individual Container Commands

### Backend Only
```bash
cd backend
docker build -t book-backend .
docker run -p 8080:8080 book-backend
```

### Frontend Only
```bash
cd frontend
docker build -t book-frontend .
docker run -p 3000:80 book-frontend
```

## Stop Services
```bash
docker-compose down
```

## Clean Up
```bash
docker-compose down -v
docker system prune -a
```