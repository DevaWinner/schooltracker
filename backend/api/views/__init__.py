# This file makes the views directory a Python package
# The views should be imported directly from their respective files

from .auth_views import RegisterAPIView, LoginAPIView
from .user_views import (
    UserInfoAPIView, 
    UserProfileAPIView, 
    UserSettingsAPIView, 
    UploadProfilePictureAPIView, 
    DeleteUserAPIView
)
from .institution_views import InstitutionListView, InstitutionDetailView
# Import the new Application views
from .application_views import ApplicationViewSet
