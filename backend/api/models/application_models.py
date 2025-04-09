from django.db import models
from api.models.user_models import Userinfo
from api.models.institution_models import Institution

class Application(models.Model):
    """Application tracking information for university applications"""
    
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('In Progress', 'In Progress'),
        ('Submitted', 'Submitted'),
        ('Interview', 'Interview'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]
    
    DEGREE_TYPE_CHOICES = [
        ('Associate', 'Associate'),
        ('Bachelor', 'Bachelor'),
        ('Master', 'Master'),
        ('PhD', 'PhD'),
        ('Certificate', 'Certificate'),
        ('Diploma', 'Diploma'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey(Userinfo, on_delete=models.CASCADE, related_name='applications')
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='applications')
    program_name = models.CharField(max_length=150)
    degree_type = models.CharField(max_length=50, choices=DEGREE_TYPE_CHOICES)
    department = models.CharField(max_length=100, blank=True, null=True)
    duration_years = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    tuition_fee = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    application_link = models.URLField(max_length=255, blank=True, null=True)
    scholarship_link = models.URLField(max_length=255, blank=True, null=True)
    program_info_link = models.URLField(max_length=255, blank=True, null=True)  # Fixed typo in field name
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    start_date = models.DateField(blank=True, null=True)
    submitted_date = models.DateField(blank=True, null=True)
    decision_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'applications'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.institution.name} - {self.program_name} ({self.status})"
