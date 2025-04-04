from django.urls import path
from .views import RegisterAPIView, LoginAPIView, UserInfoAPIView

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/signin/', LoginAPIView.as_view(), name='signin'),
    path('user/info/', UserInfoAPIView.as_view(), name='user_info'),
]
