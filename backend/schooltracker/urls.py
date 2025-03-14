from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.users.urls', namespace='users')),
    path('api/schools/', include('apps.schools.urls', namespace='schools')),
]

if settings.DEBUG:
    # Media Assets
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # # Static Assets
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Schema URLs
urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
