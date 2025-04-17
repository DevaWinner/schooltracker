---
# SchoolTracker Frontend

This is the frontend component of the **SchoolTracker** project, it handles the user interface and accepts user input. It then utilizes the API endpoints provided by the backend to process user inputs.
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
frontend/
├── public/
├── src/
│   ├── api/                    # API call functions and related logic
│   ├── components/             # Reusable UI components
│   │   └── SomeComponent/
│   │       ├── SomeComponent.tsx
│   │       └── props.ts        # Component props and types
│   ├── constants/              # All constants (routes, endpoints, etc.)
│   │   ├── Routes.ts           # Application route constants
│   │   └── Endpoints.ts        # API endpoints constants
│   ├── interfaces/             # General interface files (e.g., modal interfaces)
│   │   └── ModalProps.ts       # Modal-specific types
│   ├── context/                # Global state contexts
│   ├── hooks/                  # Custom hooks
│   ├── layout/                 # Layout components
│   ├── pages/                  # Page-level components
│   ├── utils/                  # Utility functions (formatters, helpers, etc.)
│   ├── icons/                  # Icons used throughout the app
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tsconfig.app.jsion
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 14+
- Python 3.8+
- PostgreSQL database
- Render account (for hosting the site)
- Git
- (Optional) Virtual environment tool like `venv`

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DevaWinner/schooltracker.git
cd schooltracker/frontend
```

### 2. Create and Activate a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
npm install
```

---

## Environment Setup

### 4. Create a `.env` File

Create a `.env` file in the `frontend/` directory and update it with the following variables:

```env
VITE_BASE_URL=
VITE_BASE_AUTH_URL=
```

> 💡 Tip: Never share your real `SECRET_KEY` publicly in production. Use `.env` to keep them secure.

---

## Run the Local Development Server

```bash
npm run dev
```

Visit: [http://localhost:3001/](http://localhost:3001/)

---

## Deployment (Render)

1. Push your code to GitHub
2. Connect the GitHub repo to Render
3. Make sure to add the environment variables to Render’s dashboard

---
