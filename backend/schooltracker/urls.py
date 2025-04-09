from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.users.authentication import SupabaseAuthentication

from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="SchoolTracker API",
        default_version='v1',
        description="API Documentation",
        terms_of_service="https://yoursite.com/terms/",
        contact=openapi.Contact(email="contact@yoursite.com"),
    ),
    public=True,
    permission_classes=(AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.users.urls', namespace='users')),
    path('api/', include('apps.schools.urls', namespace='schools')),
    path('api/', include('apps.applications.urls', namespace='applications')),
    # Swagger UI and Redoc
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
