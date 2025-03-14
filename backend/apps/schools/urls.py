from django.urls import path

from apps.schools import views

app_name = 'schools'

urlpatterns = [
    path('', views.schools, name='schools-directory'),
]