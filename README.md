# 🚀 SchoolTracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A centralized platform to simplify international school applications by tracking deadlines, documents, and progress.

---

## 📑 Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables & Configuration](#environment-variables--configuration)
  - [Running the App Locally](#running-the-app-locally)
- [Project Structure](#project-structure)
- [Team Members](#team-members)
- [License](#license)

---

## 🌟 About the Project

**SchoolTracker** addresses the challenges international students face when applying to schools abroad. Our goal is to simplify the entire process: from managing deadlines and applications to securely storing documents—all in one place.

By combining **React** for a seamless user experience, **Django** to handle server-side logic, and **Supabase** (Postgres + Auth) for secure data storage, our stack aims to be both easy to maintain and robust enough for real-world usage.

---

## 🚀 Features

1. **User Authentication & Profiles**  
   - 🔒 Handled by Supabase Auth.  
   - 🔍 Django backend will verify tokens and store user data for additional logic.

2. **Application Tracker**  
   - 📝 Add/edit application entries, update statuses (In Progress, Submitted, Accepted, etc.), and track deadlines.

3. **Document Management**  
   - 📁 Store file metadata in Supabase.  
   - ☁️ Use Supabase Storage for the files themselves.

4. **Notifications & Reminders**  
   - 🔔 Email or in-app reminders for upcoming deadlines.  
   - ⏳ Leverage Django’s background tasks Celery as needed.

5. **International School Directory** (Planned)  
   - 🌍 Curate a list of schools, programs, and regions for easy searching.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/)  
- **Backend:** [Django](https://www.djangoproject.com/) (Python)  
- **Database & Auth:** [Supabase](https://supabase.com/) (Postgres + Authentication)  
- **Hosting:** [Render](https://render.com/) for both the React client (as a static site) and the Django server (as a web service).

### Why Supabase for Auth and Postgres?
- **⚡ Easy Setup:** No need to self-host or manually set up Postgres.  
- **🔒 Scalable Authentication:** Built-in email/password and social logins.  
- **🔐 Row-Level Security:** Fine-grained access control if you need it.

### Why Django?
- **🚀 Rapid Development:** Batteries-included framework for quick prototyping.  
- **🔌 Robust Ecosystem:** Lots of third-party packages for everything from payments to analytics.  
- **🔄 Easy Integration:** With the right configuration, Django can read/write data in Supabase’s Postgres.

---

## 🏁 Getting Started

### 🔧 Prerequisites

1. **Node.js** (v14+ recommended)  
2. **Python** (3.8+ recommended)  
3. **Git**  
4. **Render Account** ([Sign Up Here](https://render.com/))  
5. **Supabase Account** ([Sign Up Here](https://supabase.com/)) – Create a project to get your `SUPABASE_URL` and keys.

### 📥 Installation

1. **Clone the Repo**
   ```bash
   git clone git@github.com:DevaWinner/schooltracker.git
   cd schooltracker
   ```

2. **Install React Dependencies**
   ```bash
   cd client
   npm install
   # or yarn
   ```

3. **Install Django Dependencies**
   ```bash
   cd ../server
   pip install -r requirements.txt
   ```

### 🔑 Environment Variables & Configuration

1. **Supabase Setup**  
   - We will provide you with `SUPABASE_URL` and `SUPABASE_ANON_KEY` (and `SERVICE_ROLE_KEY` for server-side).  

2. **Django Configuration**  
   - In `server/schooltracker/settings.py`, set up your database configuration to point to your Supabase Postgres.  
     ```python
     DATABASES = {
       'default': {
         'ENGINE': 'django.db.backends.postgresql',
         'NAME': 'postgres', 
         'USER': 'postgres', 
         'PASSWORD': '<YOUR-SUPABASE-PASSWORD>',
         'HOST': '<PROJECT>.db.supabase.co',
         'PORT': '5432',
       }
     }
     ```

3. **React Configuration**  
   - In `client/.env` (or `.env.local` if using Create React App or Next.js), add:
     ```bash
     REACT_APP_SUPABASE_URL=https://<PROJECT>.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=<YOUR-ANON-KEY>
     ```

> **⚠️ Note:** Make sure to add `.env` files to your `.gitignore` to avoid committing secrets.

---

## 🏃 Running the App Locally

1. **Start the Django Server**
   ```bash
   cd server
   python manage.py migrate  # Set up initial database tables
   python manage.py runserver
   ```
   Your backend should be running at `http://127.0.0.1:8000/` by default.

2. **Start the React Client**
   ```bash
   cd ../client
   npm start
   ```
   Your frontend should be running at `http://localhost:3000/`.

3. **Open in Your Browser**  
   - Visit `http://localhost:3000/` to see your React frontend.  
   - API calls to Django (e.g., `http://127.0.0.1:8000/api/...`) can be proxied or managed via environment variables.

---

## 📁 Project Structure

```
SchoolTracker/
├── .gitignore
├── LICENSE
├── README.md
├── client/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── ...
├── server/
│   ├── manage.py
│   ├── requirements.txt
│   ├── schooltracker/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── ...
│   └── ...
└── docs/
    ├── architecture.md
    ├── design_mockups.md
    └── ...
```

- **client/**: React code (interacting with Django’s API and/or Supabase Auth).  
- **server/**: Django backend (handling logic, additional user data, or custom endpoints).  
- **docs/**: Extra documentation resources.

---

## 👥 Team Members

### Aniekan Winner Anietie
**GitHub:** [@devawinner](https://github.com/DevaWinner)  
**LinkedIn:** [Aniekan Winner](https://www.linkedin.com/in/winnera)

---

### Jose Emilio Zamarron Sanchez
**GitHub:** [@JohnSmith](https://github.com/JohnSmith)  
**LinkedIn:** [John-Smith](https://www.linkedin.com/in/john-smith/)

---

### Godspower Onyebuchi Okonkwo
**GitHub:** [@JohnSmith](https://github.com/JohnSmith)  
**LinkedIn:** [John-Smith](https://www.linkedin.com/in/john-smith/)

---

### Joseph A Wallace
**GitHub:** [@JohnSmith](https://github.com/JohnSmith)  
**LinkedIn:** [John-Smith](https://www.linkedin.com/in/john-smith/)

> **💡 Note:** If you’d like to contribute to the project or have any questions, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub. We’re always open to new ideas and collaboration opportunities!

---

## 📜 License

Distributed under the [MIT License](./LICENSE). Feel free to use and modify this project in accordance with the terms of this license.

---

**🙏 Thank you for checking out SchoolTracker!**  
If you have any questions, ideas, or run into any issues, feel free to [open an issue](https://github.com/DevaWinner/schooltracker/issues). Let’s simplify the school application process together!
