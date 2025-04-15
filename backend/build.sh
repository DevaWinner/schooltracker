#!/bin/bash
# Script to build and collect static files

# exit on error
set -o errexit

# Install dependencies first
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn whitenoise psycopg2-binary django-cors-headers

# Create static directory
echo "Creating static directory..."
python create_static_dir.py

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Static files collected successfully"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

echo "Build completed successfully"