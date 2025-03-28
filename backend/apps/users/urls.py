from django.urls import path

from apps.users import views

app_name = 'users'

urlpatterns = [
    path('auth/register/', views.register_user, name='create-user'),
    path('auth/signin/', views.signin, name='sign-in'),
    path('auth/sigin_google/', views.google_login_view, name='google_sign_in'),
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),

]