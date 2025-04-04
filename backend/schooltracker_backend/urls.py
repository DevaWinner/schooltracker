from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.views.generic import RedirectView

# Make Swagger UI available regardless of DEBUG mode
schema_view = get_schema_view(
   openapi.Info(
      title="Schooltracker API",
      default_version='v1',
      description="API documentation for the Schooltracker project",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@schooltracker.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
   url=getattr(settings, 'SWAGGER_URL', None),  # Allow setting base URL for Swagger (helps with Render)
)

urlpatterns = [
    # Make sure the root URL explicitly renders Swagger with public=True
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui-root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]
