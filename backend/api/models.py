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
        # Ensure email is normalized and converted to lowercase
        email = self.normalize_email(email.lower())
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

# Institution and related tables for the School Directory

class Institution(models.Model):
    """Educational institution details"""
    id = models.CharField(primary_key=True, max_length=100)
    rank = models.CharField(max_length=50, null=True, blank=True)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    overall_score = models.CharField(max_length=50, null=True, blank=True)
    web_links = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.country})"
    
    class Meta:
        db_table = 'institutions'
        ordering = ['rank']

class Classification(models.Model):
    """Institution classification details"""
    SIZE_CHOICES = [
        ('Extra Large', 'Extra Large'),
        ('Large', 'Large'),
        ('Medium', 'Medium'),
        ('Small', 'Small'),
    ]
    
    FOCUS_CHOICES = [
        ('Full comprehensive', 'Full comprehensive'),
        ('Comprehensive', 'Comprehensive'),
        ('Focused', 'Focused'),
        ('Specialist', 'Specialist'),
    ]
    
    RESEARCH_CHOICES = [
        ('Very High', 'Very High'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='classification')
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, null=True, blank=True)
    focus = models.CharField(max_length=20, choices=FOCUS_CHOICES, null=True, blank=True)
    research = models.CharField(max_length=20, choices=RESEARCH_CHOICES, null=True, blank=True)
    
    def __str__(self):
        return f"Classification for {self.institution.name}"
    
    class Meta:
        db_table = 'classification'

class AcademicReputation(models.Model):
    """Institution academic reputation metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='academic_reputation')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Academic Reputation for {self.institution.name}"
    
    class Meta:
        db_table = 'academic_reputation'

class EmployerReputation(models.Model):
    """Institution employer reputation metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='employer_reputation')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Employer Reputation for {self.institution.name}"
    
    class Meta:
        db_table = 'employer_reputation'

class FacultyStudent(models.Model):
    """Institution faculty/student ratio metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='faculty_student')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Faculty/Student Ratio for {self.institution.name}"
    
    class Meta:
        db_table = 'faculty_student'

class CitationsPerFaculty(models.Model):
    """Institution citations per faculty metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='citations_per_faculty')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Citations per Faculty for {self.institution.name}"
    
    class Meta:
        db_table = 'citations_per_faculty'

class InternationalFaculty(models.Model):
    """Institution international faculty metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_faculty')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Faculty for {self.institution.name}"
    
    class Meta:
        db_table = 'international_faculty'

class InternationalStudents(models.Model):
    """Institution international students metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_students')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Students for {this.institution.name}"
    
    class Meta:
        db_table = 'international_students'

class InternationalResearchNetwork(models.Model):
    """Institution international research network metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_research_network')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Research Network for {this.institution.name}"
    
    class Meta:
        db_table = 'international_research_network'

class EmploymentOutcomes(models.Model):
    """Institution employment outcomes metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='employment_outcomes')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Employment Outcomes for {this.institution.name}"
    
    class Meta:
        db_table = 'employment_outcomes'

class Sustainability(models.Model):
    """Institution sustainability metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='sustainability')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Sustainability for {this.institution.name}"
    
    class Meta:
        db_table = 'sustainability'
