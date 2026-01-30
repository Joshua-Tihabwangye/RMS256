# J.T Restaurant – React Frontend

TypeScript + React (Vite) frontend for the RMS256 restaurant management system. Connects to the Django REST API.

## Setup

```bash
cd frontend
npm install
```

## Run (development)

1. Start the Django backend (from project root):

   ```bash
   source .venv/bin/activate
   pip install djangorestframework djangorestframework-simplejwt django-cors-headers
   python Menu/manage.py runserver
   ```

2. Start the React dev server (with API proxy to `http://127.0.0.1:8000`):

   ```bash
   npm run dev
   ```

3. Open **http://localhost:5173**

## Build for production

```bash
npm run build
```

Serve the `dist/` folder and point API requests to your Django backend (e.g. set `VITE_API_BASE` or configure your server to proxy `/api` to Django).

## Features

- **Public**: Home, Food / Soft Drinks / Alcohol / Fast Foods ordering, Sign In, Sign Up
- **Admin** (after sign-in): Dashboard (stats, chart), Edit menus (foods, drinks, alcohol, fast foods), Order lists by category
- **Design**: Warm palette (terracotta/amber, charcoal, cream), mobile-responsive layout, DM Sans + Fraunces fonts
