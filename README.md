# RMS256 – Restaurant Management System

Two-part project: **backend** (Django API) and **frontend** (React + TypeScript).

## Project layout

```
RMS256/
├── backend/          # Django app (API, auth, menu, orders)
│   ├── Menu/         # Django project (settings, urls, wsgi)
│   ├── USER/         # Django app (models, views, API, templates)
│   ├── static/
│   ├── db.sqlite3
│   ├── requirements.txt
│   ├── Procfile
│   └── README.md
├── frontend/         # React + TypeScript (Vite)
│   └── README.md
└── .venv/            # Python virtualenv (used by backend)
```

## Run both servers

### 1. Backend (Django)

From the **project root**:

```bash
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend && python manage.py migrate
cd backend && python manage.py runserver
```

Backend: **http://127.0.0.1:8000** (API under `/api/`).

### 2. Frontend (React)

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173** (proxies `/api` to the backend).

---

See **backend/README.md** and **frontend/README.md** for more detail.
