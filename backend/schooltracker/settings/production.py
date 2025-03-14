
from .base import *
import cloudinary
import cloudinary.uploader
import cloudinary.api

DEBUG = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS_PROD', cast=Csv())

INSTALLED_APPS += [
    'cloudinary_storage',
    'cloudinary',
]

# Media
# MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Cloudinary configs
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_API_KEY'),
    'API_SECRET': config('CLOUDINARY_API_SECRET'),
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_pscopg2-binary',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', cast=int),
    }
}