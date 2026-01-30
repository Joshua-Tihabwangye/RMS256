# RMS256 Backend (Django)

Django REST API and app for the restaurant management system.

## Setup

From the **project root** (RMS256):

```bash
# Use the project venv
source .venv/bin/activate   # or: .venv\Scripts\activate on Windows

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
cd backend && python manage.py migrate
```

## Run the backend server

From the **project root**:

```bash
source .venv/bin/activate
cd backend && python manage.py runserver
```

Backend will be at **http://127.0.0.1:8000**. API base path: `/api/`.

Or from the **backend** directory:

```bash
cd backend
../.venv/bin/python manage.py runserver   # if venv is at project root
```

## Production (Render / Heroku)

Set the **root directory** of your service to `backend`. The Procfile runs:

```
web: gunicorn Menu.wsgi
```
