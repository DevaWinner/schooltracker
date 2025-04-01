#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Apply any outstanding database migrations
python manage.py makemigrations
python manage.py migrate