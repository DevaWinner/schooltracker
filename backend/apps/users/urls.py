from django.urls import path

from apps.users import views

app_name = 'users'

urlpatterns = [
    path('auth/register/', views.register_user, name='create-user'),
    path('auth/signin/', views.signin, name='sign-in'),

]