# This file now serves as an entry point that re-exports all views from the modular structure
# Import all views from the modular structure
from api.views.auth_views import RegisterAPIView, LoginAPIView
from api.views.user_views import (
    UserInfoAPIView, 
    UserProfileAPIView, 
    UserSettingsAPIView, 
    UploadProfilePictureAPIView, 
    DeleteUserAPIView
)
from api.views.institution_views import InstitutionListView, InstitutionDetailView

# All these classes are re-exported so existing imports will still work
