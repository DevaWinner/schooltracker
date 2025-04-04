from django.contrib import admin
from .models import Userinfo, UserProfile, UserSettings

# Register your models here.
admin.site.register(Userinfo)
admin.site.register(UserProfile)
admin.site.register(UserSettings)