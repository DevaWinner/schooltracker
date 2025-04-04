# This file configures the path for Vercel deployment

import os
import sys

# Add the project directory to the sys.path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.insert(0, path)

# Import the WSGI application
from schooltracker_backend.wsgi import application

# Vercel expects the WSGI application as "app"
app = application