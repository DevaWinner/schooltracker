from django.urls import path

from apps.schools import views

app_name = 'schools'

urlpatterns = [
    path('schools/', views.SchoolListCreateAPIView.as_view(), name='schools-directory'),
    path('schools/<int:pk>/', views.SchoolDetailAPIView.as_view(), name='school-detail'),
    path('institutions/', views.InstitutionListAPIView.as_view(), name='institution-list'),
    path('institutions/<int:id>/', views.InstitutionDetailAPIView.as_view(), name='institution-detail'),
]