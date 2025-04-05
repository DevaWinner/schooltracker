from django.urls import path

from apps.schools import views

app_name = 'schools'

urlpatterns = [
    path('', views.SchoolListCreateAPIView.as_view(), name='schools-directory'),
    path('<int:pk>/', views.SchoolDetailAPIView.as_view(), name='school-detail'),
]