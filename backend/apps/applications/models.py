from django.db import models
from django.contrib.auth import get_user_model
from apps.schools.models import Institution

User = get_user_model()

# Create your models here.
class Program(models.Model):
    DEGREE_TYPE_CHOICES = [
        ('BSc', 'Bachelor of Science'),
        ('BA', 'Bachelor of Arts'),
        ('BEng', 'Bachelor of Engineering'),
        ('LLB', 'Bachelor of Laws'),
        ('MBBS', 'Bachelor of Medicine & Surgery'),
        ('BEd', 'Bachelor of Education'),
        ('MSc', 'Master of Science'),
        ('MA', 'Master of Arts'),
        ('MEng', 'Master of Engineering'),
        ('LLM', 'Master of Laws'),
        ('MBA', 'Master of Business Administration'),
        ('PhD', 'Doctor of Philosophy'),
        ('PGD', 'Postgraduate Diploma'),
        ('HND', 'Higher National Diploma'),
        ('OND', 'Ordinary National Diploma'),
        ('Other', 'Other'),
    ]

    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    program_name = models.CharField(max_length=150)
    degree_type = models.CharField(max_length=50, choices=DEGREE_TYPE_CHOICES)
    department = models.CharField(max_length=100, null=True, blank=True)
    duration_years = models.PositiveIntegerField(null=True, blank=True)
    tuition_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    application_link = models.URLField(max_length=255, null=True, blank=True)
    scholarship_link = models.URLField(max_length=255, null=True, blank=True)
    program_info_link = models.URLField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.program_name


class Application(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('In Progress', 'In Progress'),
        ('Submitted', 'Submitted'),
        ('Interview', 'Interview'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    start_date = models.DateField(null=True, blank=True)
    submitted_date = models.DateField(null=True, blank=True)
    interview_scheduled_date = models.DateField(null=True, blank=True)
    decision_date = models.DateField(null=True, blank=True)
    accepted_date = models.DateField(null=True, blank=True)
    rejected_date = models.DateField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at', '-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.program.program_name}"
