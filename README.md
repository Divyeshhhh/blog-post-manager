# Blog Post Manager

A full-stack blog management application built with React and .NET 8.

## Features
- CRUD for blog posts (Create, Read, Update, Delete) with ownership enforced
- JWT-based authentication and protected routes
- User profiles with editable details (username, full name, bio, profile image)
- Server- and client-side validation (FluentValidation + form validation)
- DTO-based API and service layer with unit tests (xUnit + FluentAssertions)
- Swagger API docs in development, PostgreSQL database via EF Core
- Containerized development using Docker Compose

# Blog Post Manager

Full-stack blog-management app (React + .NET) with a PostgreSQL backend. This README explains how to run the project locally and with Docker, run tests, and where to configure secrets.

Contents
- Overview
- Quick start (Docker)
- Local development (Backend & Frontend)
- Environment variables and configuration
- Database migrations
- Running tests

## Overview
This repo contains two main apps:
- `backend/BlogPostApi` — .NET 8 Web API using Entity Framework Core and PostgreSQL.
- `frontend` — React + Vite + TypeScript frontend with Tailwind CSS.

Prerequisites
- Docker & Docker Compose (recommended)
- OR
	- .NET 8 SDK (this repo uses SDK `8.0.416` configured in `backend/global.json`)
	- Node.js 18+ (see `frontend/package.json`)

Ports
- Frontend (browser): http://localhost:3000
- Backend (API / Swagger): http://localhost:5000/swagger

Note about frontend dev server
- When running the frontend locally with `npm run dev` (Vite), the dev server usually runs on `http://localhost:5173` by default — open the address Vite prints in the terminal. The port `3000` above refers to the static site served by the Docker `frontend` service (nginx).

Quick start with Docker
1. From the repo root:

```powershell
cd C:\Users\divye\OneDrive\Desktop\blog-post-manager
docker-compose up --build
```

2. Visit the frontend at `http://localhost:3000`.
3. Swagger (API docs) at `http://localhost:5000/swagger`.

The compose file runs three services:
- `postgres` — Postgres database (port 5432)
- `backend` — .NET API (port 5000)
- `frontend` — built frontend served on port 3000

Docker quick-check
- Watch backend logs while containers start (helps confirm migrations completed):

```powershell
docker-compose up --build -d    # run detached
docker-compose logs -f backend  # follow backend logs
```

- Look for EF Core migration messages in the backend logs and Swagger startup lines. If you see errors about DB connectivity, wait for the Postgres healthcheck and retry.
 
- API base URL note: The frontend currently uses a hard-coded API base (`http://localhost:5000/api`) in `frontend/src/services/api.ts`. This works for the local Docker Compose setup (host port 5000), but if you relocate the backend or serve the frontend from a different host, consider one of:
	- Build-time env var for the frontend (e.g., `VITE_API_BASE_URL`) and use `import.meta.env.VITE_API_BASE_URL` in `api.ts`.
	- Configure nginx (in the `frontend` container) to proxy `/api` to the backend service so the frontend can use a relative `/api` base.

- Stop and remove containers, networks and (optionally) volumes:

```powershell
docker-compose down            # stops containers and removes network
docker-compose down -v         # also removes volumes (deletes DB data)
```

- Ports note: If your host already uses ports `3000` or `5000`, change the host mappings in `docker-compose.yml` before running.

```powershell
cd backend\BlogPostApi
# (optional) install the EF Core CLI if you need `dotnet ef`:
dotnet tool install --global dotnet-ef --version 8.*

dotnet restore
dotnet ef database update    # applies migrations to the database
```

Frontend (dev server)
1. From the frontend folder:

```powershell
cd frontend
npm install
npm run dev
```

Database migrations
- Migrations are located in `backend/BlogPostApi/Migrations`.
- To create a new migration:

```powershell
cd backend\BlogPostApi
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Running tests
- Backend unit tests (xUnit) live in `backend/BlogPostApi.Tests`.

```powershell
cd backend\BlogPostApi.Tests
dotnet test
```

Note about test output
- Running tests may display a license/notice from Fluent Assertions — this is informational about its licensing terms for commercial use.

Project structure (important files)
- `backend/BlogPostApi` — .NET API app
	- `Program.cs`, `Controllers/`, `Services/`, `Data/`, `DTOs/`, `Migrations/`
- `backend/BlogPostApi.Tests` — unit tests
- `frontend` — React + Vite frontend
- `docker-compose.yml` — local docker orchestration

Author
- Divyesh Jokhoo

Notes
- Password reset / email flow is disabled by default: `IEmailService` is intentionally empty and reset emails are not sent.
- Post flagging is present as a `PostFlag` model, but flagging functionality is intentionally removed from the service and UI.

- Author note: I began implementing both the password-reset/email flow and the post-flagging feature, but ran out of time before they were finished.

Suggested improvements
- Make the frontend API base configurable via `VITE_API_BASE_URL` or add an nginx proxy that forwards `/api` to `http://backend:5000` (more robust for container-only setups).
