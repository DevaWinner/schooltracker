from django.db import models

# Create your models here.
class School(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
