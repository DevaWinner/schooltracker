import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "schooltracker_backend.settings")
application = get_asgi_application()

# Export the ASGI application as "handler" and "app"
handler = application
app = application
