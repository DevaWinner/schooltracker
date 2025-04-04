from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

GENDER_CHOICES = (
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
)

class UserInfoManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, country, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            country=country,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        
        # Create default profile and settings for the user
        UserProfile.objects.create(user=user)
        UserSettings.objects.create(user=user)
        
        return user

    def create_superuser(self, email, first_name, last_name, country, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name, country, password, **extra_fields)

# Rename UserInfo to Userinfo to match Django's internal references
class Userinfo(AbstractBaseUser, PermissionsMixin):
    """User information collected at registration"""
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields required for Django's auth system
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserInfoManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'country']

    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'user_info'
        verbose_name = 'userinfo'
        verbose_name_plural = 'userinfos'

class UserProfile(models.Model):
    """User profile information updated after sign-in"""
    # Update reference from UserInfo to Userinfo
    user = models.OneToOneField(Userinfo, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    facebook = models.CharField(max_length=255, blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email}'s profile"
    
    class Meta:
        db_table = 'user_profile'

class UserSettings(models.Model):
    """User settings updated after sign-in"""
    # Update reference from UserInfo to Userinfo
    user = models.OneToOneField(Userinfo, on_delete=models.CASCADE, related_name='settings')
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    notification_email = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email}'s settings"
    
    class Meta:
        db_table = 'user_settings'
