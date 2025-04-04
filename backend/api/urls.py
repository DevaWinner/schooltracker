from django.urls import path
from .views import (
    RegisterAPIView, 
    LoginAPIView, 
    UserInfoAPIView, 
    UserProfileAPIView, 
    UserSettingsAPIView
)

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/signin/', LoginAPIView.as_view(), name='signin'),
    path('user/info/', UserInfoAPIView.as_view(), name='user_info'),
    path('user/profile/', UserProfileAPIView.as_view(), name='user_profile'),
    path('user/settings/', UserSettingsAPIView.as_view(), name='user_settings'),
]
