from .base import *  # Load common settings (shared between dev & prod)
import os

# Read the environment variable DJANGO_ENV (defaults to 'development' if not set)
ENVIRONMENT = os.getenv('DJANGO_ENV', 'development')

# Load the appropriate settings based on the environment
if ENVIRONMENT == 'production':
    from .production import *  # Load production-specific settings
else:
    from .development import *  # Load development-specific settings
