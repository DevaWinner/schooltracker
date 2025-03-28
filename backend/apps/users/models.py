from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    Stores Supabase user information for Synchronization.
    """
    supabase_uid = models.UUIDField(editable=False, unique=True, blank=True, null=True)