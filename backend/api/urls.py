from django.urls import path, include
from api.views.auth_views import RegisterAPIView, LoginAPIView
from api.views.user_views import (
    UserInfoAPIView, UserProfileAPIView, UserSettingsAPIView,
    UploadProfilePictureAPIView, DeleteUserAPIView
)
from api.views.institution_views import InstitutionListView, InstitutionDetailView

# Define URL patterns for each module
auth_urls = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('signin/', LoginAPIView.as_view(), name='signin'),
]

user_urls = [
    path('info/', UserInfoAPIView.as_view(), name='user_info'),
    path('profile/', UserProfileAPIView.as_view(), name='user_profile'),
    path('settings/', UserSettingsAPIView.as_view(), name='user_settings'),
    path('upload-profile-picture/', UploadProfilePictureAPIView.as_view(), name='upload_profile_picture'),
    path('delete-account/', DeleteUserAPIView.as_view(), name='delete_user'),
]

institution_urls = [
    path('', InstitutionListView.as_view(), name='institution_list'),
    path('<str:id>/', InstitutionDetailView.as_view(), name='institution_detail'),
]

# Main URL patterns with modules grouped together
urlpatterns = [
    # Auth endpoints
    path('auth/', include((auth_urls, 'auth'))),
    
    # User endpoints
    path('user/', include((user_urls, 'user'))),
    
    # Institution directory endpoints
    path('institutions/', include((institution_urls, 'institutions'))),
]
