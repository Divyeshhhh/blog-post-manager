# Blog Post Manager

A full-stack blog management application built with React and .NET 8.

## Features

- Create, Read, Update, and Delete blog posts
- Responsive UI with Tailwind CSS
- Form validation on both frontend and backend
- RESTful API following SOLID principles
- Containerized with Docker
- Unit tests for backend services

## Tech Stack

**Backend:**
- .NET 8 / C#
- Entity Framework Core
- PostgreSQL
- FluentValidation
- Serilog
- xUnit

**Frontend:**
- React 18 with TypeScript
- React Router
- Axios
- Tailwind CSS

**DevOps:**
- Docker
- Docker Compose

## Prerequisites

- Docker & Docker Compose
- OR
- .NET 8 SDK
- Node.js 18+
- PostgreSQL 15+

## Quick Start with Docker

1. Clone the repository
2. Run: `docker-compose up --build`
3. Access the app at http://localhost:3000

### Database note 

- PostgreSQL runs in a Docker container with persistent volume storage.

### Swagger UI available at:

- http://localhost:5000/swagger

## Local Development

### Backend
```bash
cd backend/BlogPostApi
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- GET /api/blogposts - Get all posts
- GET /api/blogposts/{id} - Get single post
- POST /api/blogposts - Create post
- PUT /api/blogposts/{id} - Update post
- DELETE /api/blogposts/{id} - Delete post

## Running Tests
```bash
cd backend\BlogPostApi.Tests
dotnet test
```

## Design Decisions

- **SOLID Principles**: Service layer abstraction with interfaces
- **Clean Architecture**: Separation of concerns with DTOs and models
- **Validation**: FluentValidation for backend, form-level validation on frontend
- **Error Handling**: Centralized logging with structured error responses
- **Security**: Input validation, CORS configuration

## Project Structure

blog-post-manager/
├── backend/
│   ├── BlogPostApi/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Middleware/
│   │   └── Program.cs
│   ├── BlogPostApi.Tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md

## Author

Jokhoo Divyesh