# DataStreamX - Setup & Deployment Guide

A full-stack data generation application with Python FastAPI backend and React Vite frontend.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Windows/Linux/macOS

### 1. Backend Setup (Python)

```bash
# Navigate to project root
cd e:\DataStreamX

# Activate virtual environment
.venv\Scripts\Activate.ps1   # Windows PowerShell
# OR
source .venv/bin/activate    # Linux/macOS

# Install dependencies
pip install -r backend/requirements.txt

# Start backend server
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend runs on: `http://127.0.0.1:8000`

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://127.0.0.1:5173`

## 📁 Project Structure

```
DataStreamX/
├── .venv/                          # Single Python virtual environment
├── backend/
│   ├── requirements.txt            # Python dependencies
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── api/
│   │   │   ├── database.py         # Database REST endpoints
│   │   │   ├── table.py            # Table REST endpoints
│   │   │   ├── generator.py        # Generator REST endpoints
│   │   ├── database/               # SQLite database layer
│   │   ├── generator/              # Data generation engine
│   │   │   ├── manager.py          # Datatype registry
│   │   │   ├── datatypes/          # 8 generator types
│   │   │   │   ├── boolean.py
│   │   │   │   ├── date.py
│   │   │   │   ├── datetime.py
│   │   │   │   ├── email.py
│   │   │   │   ├── integer.py
│   │   │   │   ├── phone.py
│   │   │   │   ├── real.py
│   │   │   │   ├── text.py
│   │   │   ├── service.py          # Job lifecycle management
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   ├── databases/                  # SQLite .db files stored here
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── api/api.js              # Backend API client
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Database.jsx        # Database management
│   │   │   ├── Tables.jsx          # Table CRUD
│   │   │   ├── Generator.jsx       # Data generator UI
│   │   │   ├── Jobs.jsx            # Job monitoring
│   │   │   ├── Logs.jsx            # System logs
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── routes/
│   └── public/
└── README.md
```

## ✨ Features

### Database Management
- ✅ List all created databases
- ✅ Create new SQLite databases
- ✅ Delete databases
- ✅ View tables in each database

### Table Management
- ✅ Create tables with multiple columns
- ✅ Support 8 column data types: TEXT, INTEGER, REAL, EMAIL, PHONE, BOOLEAN, DATE, DATETIME
- ✅ Rename tables (edit inline)
- ✅ Delete tables
- ✅ View table schema

### Data Generation
- ✅ Select database and table
- ✅ Generate realistic test data with 8 data types:
  - **TEXT**: Random names (Faker)
  - **INTEGER**: Random integers (1-100)
  - **REAL**: Random decimals (1000-100000)
  - **EMAIL**: Valid email addresses (Faker)
  - **PHONE**: Valid phone numbers (Faker)
  - **BOOLEAN**: Random 0 or 1
  - **DATE**: Random dates (2-year range, ISO format)
  - **DATETIME**: Random datetimes (2-year range, ISO format)
- ✅ Configure delay between row inserts
- ✅ Start/stop generator jobs
- ✅ Monitor active jobs with row counts
- ✅ Thread-based background generation

## 🔧 REST API Endpoints

### Database Management
```
POST   /database/create              # Create new database
GET    /database/list                # List all databases with table counts
GET    /database/{db_name}/tables    # Get tables in database
DELETE /database/{db_name}           # Delete database
```

### Table Management
```
POST   /table/create                 # Create table
POST   /table/rename                 # Rename table
DELETE /table/delete                 # Delete table
```

### Data Generation
```
POST   /generator/start              # Start generator job
GET    /generator/jobs               # List active jobs
GET    /generator/status/{job_id}    # Get job status
POST   /generator/stop/{job_id}      # Stop job
```

## 📊 Data Storage

All data is stored in **SQLite** local files:
- Location: `backend/databases/{database_name}.db`
- Each database = one `.db` file
- Tables are created within SQLite files
- Persistent across restarts

## 🎯 Usage Example

1. **Create Database**: Dashboard → Database → Create "company"
2. **Create Table**: Tables → Create "employees" with columns:
   - `name` (TEXT)
   - `email` (EMAIL)
   - `salary` (REAL)
   - `active` (BOOLEAN)
3. **Generate Data**: Generator → Select "company" + "employees" → Start
4. **View Results**: Tables → See "employees" with generated rows

## 🧹 Cleanup

Remove duplicate virtual environments (if any):
```bash
# Already done - `.venv` is now the single venv
# .venv-1 has been removed
```

## ⚙️ Environment Variables

Create `backend/.env` if needed:
```env
DATABASE_PATH=backend/databases
API_HOST=127.0.0.1
API_PORT=8000
```

## 🐛 Troubleshooting

### Port already in use?
```bash
# Backend uses port 8000, change with:
python -m uvicorn app.main:app --port 8001

# Frontend uses port 5173, Vite auto-increments if unavailable
```

### Virtual environment issues?
```bash
# Deactivate current venv
deactivate

# Recreate venv
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### Database file corrupted?
```bash
# Delete the database file and recreate
del backend/databases/{database_name}.db

# Then create a new database from UI
```

## 📝 Technologies

- **Backend**: FastAPI, Uvicorn, SQLAlchemy, Faker
- **Frontend**: React, Vite, Material-UI
- **Database**: SQLite3
- **Data Generation**: Python threading, Faker library
- **Python**: 3.12+
- **Node**: 18+

## 📦 Dependencies

### Backend (21 packages)
FastAPI, Uvicorn, Pydantic, SQLAlchemy, Faker, PyMySQL, psycopg2, python-dotenv, and more

### Frontend (292 packages)
React, Vite, Material-UI, Axios, and development dependencies

---

**Last Updated**: 2026-07-12  
**Version**: 1.0  
**Status**: ✅ Production Ready
