#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn whitenoise psycopg2-binary django-cors-headers

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate