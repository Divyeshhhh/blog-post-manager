# Blog Post Manager

A full-stack blog platform built with **React**, **TypeScript**, **.NET 8**, and **PostgreSQL**.  
The application delivers complete end-to-end CRUD functionality for blog posts, secure user authentication, and a responsive modern UI. It is designed to satisfy full-stack technical assignment requirements across both backend and frontend layers.

---

 ### Project Demo (Live Walkthrough)

![Website Demo](assets/demo-gif.gif)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Summary](#architecture-summary)
  - [Backend — `backend/BlogPostApi`](#backend--backendblogpostapi)
  - [Frontend — `frontend/`](#frontend--frontend)
- [Design Choices & Rationale](#design-choices--rationale)
  - [Security & Error Handling](#security--error-handling)
  - [Developer Experience & Maintainability](#developer-experience--maintainability)
  - [User Experience Enhancements](#user-experience-enhancements)
  - [Additional Enhancements Beyond Baseline](#additional-enhancements-beyond-baseline)
- [Feature Checklist](#feature-checklist)
  - [Backend Capabilities](#backend-capabilities)
  - [Frontend Capabilities](#frontend-capabilities)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Run with Docker Compose](#run-with-docker-compose)
  - [Run Locally (without Docker)](#run-locally-without-docker)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Author](#author)
- [Notes](#notes)

---

## Project Overview

- **Objective**: Build a full-stack blog post manager where authenticated users can create, update, and delete posts, while unauthenticated visitors can browse a public feed.
- **Technology Stack**:
  - **Frontend**: Vite, React 18, TypeScript, Tailwind CSS
  - **Backend**: ASP.NET Core 8 Web API, Entity Framework Core
  - **Database**: PostgreSQL
- **Deployment Ready**: Docker Compose orchestrates the database, backend API, and frontend so the entire system can be launched with a single command.

---

## Architecture Summary

### Backend — `backend/BlogPostApi`

- **Framework**: ASP.NET Core 8 Web API
- **Persistence**: Entity Framework Core with PostgreSQL
- **Structure**:
  - `Controllers/` expose RESTful endpoints
  - `Services/` encapsulate business logic and authorization rules
  - `Data/ApplicationDbContext.cs` manages database access
  - `DTOs/` decouple API contracts from persistence models
  - `Validators/` enforce request constraints using FluentValidation
- **Integrations**:
  - JWT Bearer authentication
  - FluentValidation for input validation
  - Serilog for structured logging
  - Swagger / OpenAPI for API documentation
  - Automatic EF Core migrations applied on application startup
- **Testing**:
  - Located in `BlogPostApi.Tests`
  - Uses xUnit, Moq, FluentAssertions, and EF Core In-Memory provider
  - Covers CRUD logic, ownership enforcement, and DTO mapping behaviour

### Frontend — `frontend/`

- **Framework**: React 18 with TypeScript
- **Tooling**: Vite, Tailwind CSS, Axios
- **Routing**: React Router
- **State & Authentication**:
  - `contexts/AuthContext.tsx` centralises JWT storage, profile retrieval, and logout flows
  - `components/ProtectedRoute.tsx` restricts access to authenticated routes
- **User Interface**:
  - Responsive layouts with Tailwind utilities
  - Animated gradients and polished UI components
  - Inline form validation and real-time feedback
  - Search and filtering on the public feed

---

## Design Choices & Rationale

### Security & Error Handling

- **JWT Authentication**: Configured in `Program.cs` with issuer, audience, and strict clock-skew validation to reduce replay risks.
- **Password Hashing**: BCrypt is used to securely hash and store user credentials.
- **Structured Logging**: Serilog provides contextual logs for auditing and debugging.
- **Validation**: FluentValidation ensures invalid requests are rejected before reaching business logic. Frontend forms mirror these rules for consistency.

### Developer Experience & Maintainability

- **Service Layer Pattern**: Keeps controllers thin and enables unit testing without HTTP dependencies.
- **DTO Boundaries**: Protect API consumers from schema changes in persistence models.
- **Automatic Migrations**: Database schema stays aligned during Docker deployments.
- **Test Coverage**: Core service logic is verified to reduce regressions.

### User Experience Enhancements

- **Responsive Design**: Tailwind CSS ensures accessibility and mobile-friendly layouts.
- **Search & Filtering**: Live search across post titles, content, and authors.
- **Form Safeguards**: Character counters, validation hints, unsaved-change warnings, and a global toast notification system (ToastProvider) that replaces disruptive alert dialogs with consistent success/error feedback across the SPA.

### Additional Enhancements Beyond Baseline

- **Production-Ready Docker Setup**: Includes service dependency ordering and health checks.
- **Profile Management**: Users can view and update profile information including bios and avatars.

---

## Feature Checklist

### Backend Capabilities

- RESTful CRUD endpoints under `/api/blogposts`
- JWT-secured authentication endpoints under `/api/auth`
- Ownership enforcement for post modification and deletion
- Ownership awareness via `isOwner` flags in response DTOs
- PostgreSQL schema with unique constraints on usernames and emails
- Swagger UI for API exploration

### Frontend Capabilities

- Public blog feed with responsive card layout
- Authentication flows for login and registration
- Post creation, editing, viewing, and deletion
- User profile viewing and editing
- Clean navigation using React Router

---

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- OR local installation:
  - .NET 8 SDK (`global.json` locks to `8.0.416`)
  - Node.js 18+
  - PostgreSQL 15+

### Run with Docker Compose

   > ⚠️ **Important**
   >
   > Make sure **Docker Desktop is running** before executing any `docker-compose` commands.

1. From the repository root, build and start containers:
   ```powershell
   docker-compose up --build
   ```
2. Frontend: <http://localhost:3000>
3. Swagger UI / API: <http://localhost:5000/swagger>
4. Tail logs for troubleshooting:
   ```powershell
   docker-compose logs -f backend
   ```
5. Tear down when finished:
   ```powershell
   docker-compose down        # stop containers
   docker-compose down -v     # also drop volumes (deletes database)
   ```

### Run Locally (without Docker)

#### Backend API
1. Open a terminal in `backend/BlogPostApi`.
2. Restore dependencies and apply migrations:
   ```powershell
   dotnet restore
   dotnet ef database update
   ```
3. Launch the API:
   ```powershell
   dotnet run
   ```
4. API listens on `http://localhost:5000` by default.

#### Frontend SPA
1. Open another terminal in `frontend`.
2. Install packages and start Vite:
   ```powershell
   npm install
   npm run dev
   ```
3. Vite serves the app on <http://localhost:5173>.

---

## Environment Configuration
- **Connection strings**: `backend/appsettings.json` reads `ConnectionStrings:DefaultConnection`. Docker passes the container-network value through environment variables.
- **JWT settings**: `backend/appsettings.json` defines `JwtSettings` (issuer, audience, secret). Update these for production secrets.
- **Frontend API base**: `frontend/src/services/api.ts` currently targets `http://localhost:5000/api`. For other environments, expose `VITE_API_BASE_URL` and reference `import.meta.env.VITE_API_BASE_URL`.
- **Serilog**: Logging sinks and minimum levels configured via `appsettings.json`.

---

## Database Migrations
- Migrations live in `backend/BlogPostApi/Migrations`.
- Create a migration:
  ```powershell
  dotnet ef migrations add <MigrationName>
  dotnet ef database update
  ```
- Docker builds automatically run migrations on startup.

---

## Testing
- Run unit tests from `backend/BlogPostApi.Tests`:

```powershell
cd backend\BlogPostApi.Tests
dotnet test
```
- Tests cover CRUD flows, ownership enforcement, DTO mapping fidelity, plus API-level integration tests that spin up the WebApplicationFactory, seed in-memory databases, and exercise controller endpoints end to end.

---

## Project Structure
```
.
├── backend/
│   ├── BlogPostApi/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Validators/
│   │   └── Migrations/
│   └── BlogPostApi.Tests/
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── contexts/
    │   └── services/
    └── public/
```

---

## Author
- Divyesh Jokhoo

---

## Notes
- Password reset / email flow is disabled by default: `IEmailService` is intentionally empty and reset emails are not sent.
- Post flagging is present as a `PostFlag` model, but flagging functionality is intentionally removed from the service and UI.

  >- ⚠️ **Author note:** Implementation of the password reset/email flow and post-flagging feature was started but deferred prior to completion due to time constraints.
