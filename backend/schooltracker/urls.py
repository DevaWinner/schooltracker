from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.users.urls', namespace='users')),
    path('api/schools/', include('apps.schools.urls', namespace='schools')),
    path('api/', include('apps.applications.urls', namespace='applications')),
]
