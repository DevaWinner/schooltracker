from django.db import models
from api.models.user_models import Userinfo
from api.models.application_models import Application

class Document(models.Model):
    """Document model for storing user documents"""
    
    DOCUMENT_TYPE_CHOICES = [
        ('Transcript', 'Transcript'),
        ('Essay', 'Essay'),
        ('CV', 'CV'),
        ('Recommendation Letter', 'Recommendation Letter'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey(Userinfo, on_delete=models.CASCADE, related_name='documents')
    application = models.ForeignKey(
        Application, 
        on_delete=models.CASCADE, 
        related_name='documents',
        null=True,  # Allow documents not associated with an application
        blank=True
    )
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    file_name = models.CharField(max_length=255)
    file_url = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.file_name} ({self.document_type})"
