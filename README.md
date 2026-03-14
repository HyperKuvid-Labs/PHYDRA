# PHYDRA

PHYDRA is a cargo stowage management system with a FastAPI backend, C++ optimization algorithms, a Vite/React frontend, and Prisma for data modeling.

## Stack

- Backend: FastAPI (Python) + C++ algorithm modules
- Frontend: React + Vite
- Database: Prisma (MongoDB)
- Deployment: Docker

## Project Structure

```text
PHYDRA/
├── backend/            # FastAPI app, CSV data, C++ algorithm code
├── frontend/           # React frontend (Vite)
├── prisma/             # Prisma schema
├── Dockerfile          # Backend image
├── Dockerfile.frontend # Frontend image
└── compose.yaml        # Multi-service setup
```

## Quick Start

```bash
git clone --depth 1 https://github.com/Mantissagithub/PHYDRA.git
cd PHYDRA
```

### Backend (Docker)

```bash
docker build -t phydra .
docker run -d -p 8000:8000 --name phydra-backend phydra
```

Backend runs at http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### Prisma

Create `prisma/.env`:

```env
MONGODB_URI=<your_mongodb_uri>
```

Then generate the client:

```bash
cd prisma
prisma generate
```

## Contributors

- Pradheep — https://github.com/Mantissagithub/
- Harish — https://github.com/HARISH20205
- Dalton — https://github.com/Daltonar05
- Rakshith — https://github.com/RAAKISG
- Yuvanesh — https://github.com/YuvaneshSankar
