from .auth_views import RegisterAPIView, LoginAPIView
from .user_views import (
    UserInfoAPIView, 
    UserProfileAPIView, 
    UserSettingsAPIView, 
    UploadProfilePictureAPIView, 
    DeleteUserAPIView
)
from .institution_views import InstitutionListView, InstitutionDetailView
