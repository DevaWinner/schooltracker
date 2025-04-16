---

# SchoolTracker Backend

This is the backend component of the **SchoolTracker** project, designed to power the core functionalities of the SchoolTracker system. It provides API endpoints for various functionalities.

---

## Features

- 🔐 User Authentication & Authorization   
- 🏫 School Data Management  
- 🌐 RESTful API with Django  
- 💾 PostgreSQL Database Integration  
- ☁️ Supabase Integration for Media Storage  
- 🚀 Ready for deployment with Render

---

## Project Structure

```
backend/
├── api/                      # API logic and views
├── schooltracker_backend/    # Django project core
├── manage.py                 # Django entrypoint
├── requirements.txt          # Project dependencies
├── build.sh                  # Build script
├── Procfile                  # Render deployment instruction
├── render.yaml               # Render deployment config
├── check_imports.py
├── complete_reset.py
├── create_static_dir.py
```

---

## Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL database
- Supabase account (for file storage)
- Git
- (Optional) Virtual environment tool like `venv`

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DevaWinner/schooltracker.git
cd schooltracker/backend
```

### 2. Create and Activate a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Setup

### 4. Create a `.env` File

Create a `.env` file in the `backend/` directory and update it with the following variables:

```env
# PostgreSQL database URL
DATABASE_URL=

# Debug mode
DEBUG=

# Django secret key
SECRET_KEY=

# Supabase configuration
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=profile-pictures
```

> 💡 Tip: Never share your real `SECRET_KEY` or Supabase `KEY` publicly in production. Use `.env` to keep them secure.

---

## Database Migration

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Run the Development Server

```bash
python manage.py runserver
```

Visit: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## Deployment (Render)

1. Push your code to GitHub
2. Connect the GitHub repo to Render
3. Render will auto-detect the `render.yaml` and deploy the backend
4. Make sure to add the environment variables to Render’s dashboard

---

## Utility Scripts

| Script               | Description                                  |
|----------------------|----------------------------------------------|
| `build.sh`           | Builds the project for deployment            |
| `check_imports.py`   | Checks for unused imports in the project     |
| `complete_reset.py`  | Wipes and resets the database (use with care)|
| `create_static_dir.py` | Creates required static file directories   |

---
