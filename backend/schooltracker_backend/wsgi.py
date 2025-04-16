import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "schooltracker_backend.settings")
application = get_wsgi_application()

# Expose the WSGI application as both "handler" and "app" for Vercel.
handler = application
app = application
