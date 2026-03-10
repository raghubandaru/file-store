# File Store

A production-ready file storage application built as a pnpm monorepo. Users can securely upload, manage, and delete files with support for both AWS S3 and local storage backends.

---

## Architecture Overview

```
file-store/
├── apps/
│   └── web/                    # Next.js 16 frontend (BFF pattern)
├── packages/
│   ├── design-system/          # React component library
│   ├── schemas/                # Zod validation schemas
│   └── types/                  # Shared TypeScript types
├── services/
│   ├── auth/                   # Authentication & session service (port 3001)
│   ├── users/                  # User account management service (port 3002)
│   └── files/                  # File storage orchestration service (port 3003)
└── docker-compose.yml
```

### Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | Next.js 16, React 19, App Router        |
| Backend          | Express.js 4 (three microservices)      |
| Database         | MongoDB + Mongoose (three separate DBs) |
| Storage          | AWS S3 (with local filesystem fallback) |
| Monorepo         | pnpm workspaces + Turborepo             |
| Language         | TypeScript 5 (strict)                   |
| Validation       | Zod 4                                   |
| Containerization | Docker + Docker Compose                 |
| CI/CD            | GitHub Actions → EC2                    |

---

## Packages

### `@file-store/types`

Centralized TypeScript types shared across all services and the web app.

- `ActionState` — server action result type with optional errors
- `UserProfile` — user data shape (id, name, email)
- `FileItem` — file metadata (id, filename, contentType, size, createdAt, url)

### `@file-store/schemas`

Zod validation schemas with shared constants.

- `signupSchema` / `loginSchema` — auth form validation
- `uploadRequestSchema` — file upload validation
- `MAX_FILE_SIZE` — 5 MB limit
- `ALLOWED_CONTENT_TYPES` — `image/jpeg`, `image/png`
- `fieldErrors()` — Zod error flattening helper

### `@file-store/design-system`

React 19 component library built with TypeScript.

- **Atoms:** `Button`, `Input`, `Label`, `ErrorMessage`, `ActionGroup`, `PageHeading`
- **Molecules:** `Form`, `Field`, `Navbar`, `Main`, `FileDropzone`, `ImagePreview`

---

## Services

### Auth Service (port 3001)

Handles authentication, JWT issuance, and session lifecycle. Delegates user credential verification and account creation to the Users Service.

**Endpoints:**

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| POST   | `/api/signup`  | Register and receive tokens     |
| POST   | `/api/login`   | Authenticate and receive tokens |
| POST   | `/api/logout`  | Invalidate refresh token        |
| POST   | `/api/refresh` | Rotate refresh token            |
| GET    | `/api/session` | Validate access token → userId  |

**Session model:** 30-day refresh tokens stored in MongoDB with TTL auto-cleanup.

### Users Service (port 3002)

Manages user accounts and credentials. Only called internally by the Auth Service and Web BFF.

**Endpoints:**

| Method | Path                 | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/users`         | Create user (409 if email exists) |
| POST   | `/api/users/verify`  | Verify email + password           |
| GET    | `/api/users/:userId` | Get user profile                  |
| DELETE | `/api/users/:userId` | Delete user account               |

Passwords are hashed with bcrypt.

### Files Service (port 3003)

Orchestrates file storage via a dual-mode adapter (S3 or local). Manages presigned URL generation and file metadata persistence.

**Endpoints:**

| Method | Path                  | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/files?userId=`  | List user files                       |
| POST   | `/api/files`          | Save file metadata                    |
| DELETE | `/api/files/:fileId`  | Delete a file                         |
| DELETE | `/api/files/user`     | Delete all files for a user           |
| POST   | `/api/upload-url`     | Get presigned S3 or local upload URL  |
| PUT    | `/api/local-upload/*` | Binary upload (local mode only)       |
| GET    | `/uploads/*`          | Static file serving (local mode only) |

**Storage adapters:**

- **S3:** Presigned PUT URLs (60s expiry), signed GET URLs (1h expiry)
- **Local:** Disk-based, served as static files from `./uploads/`

---

## Web App (`apps/web`)

Next.js 16 App Router application acting as a **Backend-for-Frontend (BFF)**. Server Components handle data fetching; API routes proxy calls to backend services, keeping credentials server-side.

### Routes

| Route           | Description                                   |
| --------------- | --------------------------------------------- |
| `/`             | Redirects to profile (authenticated) or login |
| `/auth/login`   | Login page                                    |
| `/auth/signup`  | Sign-up page                                  |
| `/user/profile` | User profile + account deletion               |
| `/file/upload`  | File upload page                              |
| `/file/list`    | Uploaded files list                           |

### API Routes (BFF layer)

| Method | Path                | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/api/auth/login`   | Proxy login, set cookies         |
| POST   | `/api/auth/signup`  | Proxy signup, set cookies        |
| POST   | `/api/auth/logout`  | Clear cookies, call Auth Service |
| POST   | `/api/auth/refresh` | Rotate session tokens            |
| GET    | `/api/auth/me`      | Current user from session        |
| GET    | `/api/user`         | Fetch user profile               |
| POST   | `/api/upload-url`   | Request presigned upload URL     |
| POST   | `/api/save-file`    | Persist file metadata            |
| DELETE | `/api/files/[id]`   | Delete a file                    |

### File Upload Flow

```
1. User selects file (JPEG/PNG ≤ 5 MB)
2. POST /api/upload-url  →  Files Service returns presigned URL
3. Client PUTs file directly to S3 (or local endpoint)
4. POST /api/save-file  →  Files Service persists metadata
```

### Authentication Flow

- `refreshToken` stored in httpOnly, secure, SameSite=strict cookie
- Access token lives in memory; validated server-side via Auth Service
- `getSessionUserId()` reads cookie and validates against Auth Service on each request

### Project Structure

```
apps/web/src/
├── app/                    # Next.js App Router (pages + API routes)
├── features/               # Feature-scoped components
│   ├── auth/               # AuthForm, AuthLayout
│   ├── files/              # FileList, UploadForm
│   ├── user/               # DeleteAccount
│   └── nav/                # NavLinks
├── lib/                    # HTTP clients (auth, users, files)
├── services/               # Business logic (session, user)
└── actions/                # Next.js Server Actions
```

---

## Data Layer

### Databases

Three separate MongoDB databases, one per service:

| Database          | Service | Collections |
| ----------------- | ------- | ----------- |
| `filestore_auth`  | Auth    | `sessions`  |
| `filestore_users` | Users   | `users`     |
| `filestore_files` | Files   | `files`     |

### File Key Format

```
{userId}/{uuid}-{filename}
```

---

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- MongoDB (Atlas or local)
- Docker (for containerized setup)

### Environment Variables

Copy `.env.local` to the root and fill in values:

```env
# Storage
STORAGE=local                    # or "s3"
AWS_REGION=
AWS_ACCESS_KEY_RES=
AWS_SECRET_KEY_RES=
AWS_S3_BUCKET=

# Databases
DB_AUTH=mongodb+srv://...
DB_USERS=mongodb+srv://...
DB_FILES=mongodb+srv://...

# Auth
ACCESS_TOKEN_SECRET=

# Service URLs (used by web app and inter-service calls)
AUTH_SERVICE_URL=http://localhost:3001
USERS_SERVICE_URL=http://localhost:3002
FILES_SERVICE_URL=http://localhost:3003

# CORS
ALLOWED_ORIGIN=http://localhost:3000

# Ports
PORT_AUTH=3001
PORT_USERS=3002
PORT_FILES=3003

# Fallback
HTTPS_ENABLED=false               # or true (in production)

# Environment
NODE_ENV=development              # or production
```

### Local Development

```bash
pnpm install
pnpm dev          # starts web app + all three services in parallel
```

### Docker

```bash
docker compose --env-file .env.local up --build
```

---

## Build & CI/CD

```bash
pnpm build        # full workspace build (Turbo-orchestrated)
pnpm lint         # ESLint across all packages
pnpm typecheck    # TypeScript strict check across all packages
pnpm format       # Prettier formatting
```

**CI/CD:** GitHub Actions triggers on push to `main`, SSHs into an EC2 instance, and runs a Docker Compose rebuild.

---

## Internal Package Dependencies

```
web
├── @file-store/design-system  (workspace:*)
├── @file-store/schemas        (workspace:*)
└── @file-store/types          (workspace:*)

services/auth
├── @file-store/schemas        (workspace:*)
└── @file-store/types          (workspace:*)

services/users
└── @file-store/types          (workspace:*)

services/files
├── @file-store/schemas        (workspace:*)
└── @file-store/types          (workspace:*)
```

---

## Error Handling

### Service Startup

All three services validate required environment variables before `app.listen()`. If any are missing the process exits with code `1`, producing a clear error log rather than a confusing runtime failure.

```
[users-service] Missing required environment variable: DB_USERS
```

### Backend Services (Auth / Users / Files)

Every route handler wraps its logic in `try/catch`. Errors thrown by service and repository layers are caught at the route boundary and converted to HTTP responses — they never crash the server.

| Scenario                           | HTTP Status | Response                                                  |
| ---------------------------------- | ----------- | --------------------------------------------------------- |
| Invalid credentials (login/verify) | 401         | `{ error: "Invalid credentials" }`                        |
| Duplicate email on signup          | 409         | `{ error: "User exists" }`                                |
| Resource not found                 | 404         | `{ error: "Not found" }`                                  |
| Missing required body fields       | 400         | `{ error: "... required" }`                               |
| File not found on delete           | 400         | `{ error: "File not found" }`                             |
| No/expired refresh token           | 401         | `{ error: "Unauthorized" }`                               |
| Unhandled internal errors          | 500         | `{ error: "Internal error" }`                             |
| Logout failure                     | 200         | Still returns `{ success: true }` — logout is best-effort |

### Orphan File Cleanup

When a file is uploaded to storage (S3 or local) but the subsequent MongoDB `insertFile` fails, the service automatically deletes the stored object to avoid orphaned files:

```
upload to storage → insertFile fails → storage.deleteObject(key) → rethrow error
```

If the cleanup itself fails, it is logged but does not suppress the original error.

### Web App — BFF API Routes

All BFF API routes check session before proceeding. Unauthenticated requests are rejected immediately without hitting any downstream service.

| Scenario                                      | HTTP Status                  |
| --------------------------------------------- | ---------------------------- |
| Missing or invalid session cookie             | 401                          |
| Failed Zod validation (`uploadRequestSchema`) | 400 with first issue message |
| Missing required file fields on save          | 400                          |
| Downstream service failure                    | 500                          |
| File delete — file not found or not owned     | 400                          |

### Web App — Server Actions

Server Actions (`loginAction`, `signupAction`) use Zod schemas for input validation before calling any service. Errors are returned as `ActionState` and displayed in the form — no exceptions bubble to the UI.

```ts
// Validation failure
if (!result.success) return { errors: fieldErrors(result.error) }

// Service failure
catch (e) {
  return { errors: { general: e instanceof Error ? e.message : "Something went wrong" } }
}
```

### Session Management

- Refresh tokens have a 30-day TTL and are automatically removed from MongoDB via a TTL index — no manual cleanup needed.
- `getSessionUserId()` returns `null` (never throws) if the cookie is absent or the Auth Service returns a non-2xx response, allowing pages to redirect gracefully.
