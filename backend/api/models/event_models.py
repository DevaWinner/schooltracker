from django.db import models
from api.models.user_models import Userinfo
from api.models.application_models import Application

class Event(models.Model):
    EVENT_COLOR_CHOICES = [
        ("danger", "Danger"),
        ("success", "Success"),
        ("primary", "Primary"),
        ("warning", "Warning"),
    ]

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='events')
    user = models.ForeignKey(Userinfo, on_delete=models.CASCADE, related_name='events')
    event_title = models.CharField(max_length=255)
    event_color = models.CharField(max_length=20, choices=EVENT_COLOR_CHOICES)
    event_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.event_title
