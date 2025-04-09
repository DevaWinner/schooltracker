from django.urls import path, include
from api.views.auth_views import RegisterAPIView, LoginAPIView
from api.views.user_views import (
    UserInfoRetrieveView, UserInfoUpdateView,
    UserProfileRetrieveView, UserProfileUpdateView,
    UserSettingsRetrieveView, UserSettingsUpdateView,
    ProfilePictureUploadView, UserAccountDeleteView
)
from api.views.institution_views import InstitutionListView, InstitutionDetailView
from api.views.application_views import (
    ApplicationListView, ApplicationCreateView, ApplicationDetailView,
    ApplicationFullUpdateView, ApplicationStatusUpdateView, ApplicationDeleteView
)

# Define URL patterns for each module
auth_urls = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('signin/', LoginAPIView.as_view(), name='signin'),
]

# Updated user URLs with separate views for GET and PUT operations
user_urls = [
    # User info endpoints
    path('info/', UserInfoRetrieveView.as_view(), name='user_info_retrieve'),
    path('info/update/', UserInfoUpdateView.as_view(), name='user_info_update'),
    
    # User profile endpoints
    path('profile/', UserProfileRetrieveView.as_view(), name='user_profile_retrieve'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user_profile_update'),
    
    # User settings endpoints
    path('settings/', UserSettingsRetrieveView.as_view(), name='user_settings_retrieve'),
    path('settings/update/', UserSettingsUpdateView.as_view(), name='user_settings_update'),
    
    # Profile picture upload
    path('upload-profile-picture/', ProfilePictureUploadView.as_view(), name='user_profile_picture_upload'),
    
    # Account deletion
    path('delete-account/', UserAccountDeleteView.as_view(), name='user_account_delete'),
]

institution_urls = [
    path('', InstitutionListView.as_view(), name='institution_list'),
    path('<str:id>/', InstitutionDetailView.as_view(), name='institution_detail'),
]

# Revised application URLs to avoid duplicate methods
application_urls = [
    # List and create endpoints
    path('', ApplicationListView.as_view(), name='application_list'),
    path('create/', ApplicationCreateView.as_view(), name='application_create'),
    
    # Detail endpoint (GET)
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application_detail'),
    
    # Full update endpoint (PUT only)
    path('<int:pk>/update/', ApplicationFullUpdateView.as_view({'put': 'update'}), name='application_update'),
    
    # Status update endpoint (PATCH only)
    path('<int:pk>/status/', ApplicationStatusUpdateView.as_view({'patch': 'partial_update'}), name='application_status_update'),
    
    # Delete endpoint
    path('<int:pk>/delete/', ApplicationDeleteView.as_view(), name='application_delete'),
]

# Main URL patterns with modules grouped together
urlpatterns = [
    # Auth endpoints
    path('auth/', include((auth_urls, 'auth'))),
    
    # User endpoints
    path('user/', include((user_urls, 'user'))),
    
    # Institution directory endpoints
    path('institutions/', include((institution_urls, 'institutions'))),
    
    # Application tracking endpoints
    path('applications/', include((application_urls, 'applications'))),
]
