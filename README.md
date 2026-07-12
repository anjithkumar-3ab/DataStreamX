# DataStreamX

DataStreamX is split into two parts:

- `backend/`: FastAPI service for database, table, and generator APIs
- `frontend/`: Vite + React UI for managing the application

## Project Layout

```text
backend/
  app/
    main.py
    api/
    database/
    generator/
    schemas/
    services/
    utils/
  requirements.txt

frontend/
  src/
    components/
    layouts/
    pages/
    routes/
    api/
```

## Running The App

Start the backend from the `backend/` folder.

```bash
uvicorn app.main:app --reload
```

Start the frontend from the `frontend/` folder.

```bash
npm install
npm run dev
```

## Notes

- The backend entry point is `backend/app/main.py`.
- The frontend entry point is `frontend/src/main.jsx`.
- The UI routes live in `frontend/src/routes/AppRoutes.jsx`.