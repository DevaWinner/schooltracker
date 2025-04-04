from django.urls import path
from .views import (
    RegisterAPIView, 
    LoginAPIView, 
    UserInfoAPIView, 
    UserProfileAPIView, 
    UserSettingsAPIView,
    UploadProfilePictureAPIView,
    DeleteUserAPIView
)

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/signin/', LoginAPIView.as_view(), name='signin'),
    path('user/info/', UserInfoAPIView.as_view(), name='user_info'),
    path('user/profile/', UserProfileAPIView.as_view(), name='user_profile'),
    path('user/settings/', UserSettingsAPIView.as_view(), name='user_settings'),
    path('user/upload-profile-picture/', UploadProfilePictureAPIView.as_view(), name='upload_profile_picture'),
    path('user/delete-account/', DeleteUserAPIView.as_view(), name='delete_user'),
]
