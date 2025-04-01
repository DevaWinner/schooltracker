from django.db import models
from django.contrib.auth.models import AbstractUser
from .utils.country_names import COUNTRY_CHOICES
from .utils.country_codes import COUNTRY_CODE_CHOICES


class CustomUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    Stores Supabase user information for Synchronization.
    """
    supabase_uid = models.UUIDField(editable=False, unique=True, blank=True, null=True)


class UserProfile(models.Model):
    """
    Model for storing additional user data.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="user_profile")
    country = models.CharField(choices=COUNTRY_CHOICES, max_length=80, blank=True, null=True)
    country_code = models.CharField(choices=COUNTRY_CODE_CHOICES, max_length=80, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_avatar = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} ({self.id})"