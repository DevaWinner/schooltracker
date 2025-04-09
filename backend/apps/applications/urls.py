from django.urls import path
from apps.applications import views

app_name = 'applications'

urlpatterns = [
    path('programs/', views.ProgramListCreateAPIView.as_view(), name='program-list-create'),
    path('programs/<int:pk>/', views.ProgramDetailAPIView.as_view(), name='program-detail'),
    path('applications/', views.ApplicationListCreateAPIView.as_view(), name='application-list-create'),
    path('applications/<int:pk>/', views.ApplicationDetailAPIView.as_view(), name='application-detail'),
]