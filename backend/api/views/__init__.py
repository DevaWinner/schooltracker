# This file imports and re-exports views from the modular structure

# Auth views
from .auth_views import RegisterAPIView, LoginAPIView

# User views (updated with new class names)
from .user_views import (
    UserInfoRetrieveView, UserInfoUpdateView,
    UserProfileRetrieveView, UserProfileUpdateView,
    UserSettingsRetrieveView, UserSettingsUpdateView,
    ProfilePictureUploadView, UserAccountDeleteView
)

# Institution views
from .institution_views import InstitutionListView, InstitutionDetailView

# Application views
from .application_views import (
    ApplicationListView, ApplicationCreateView, ApplicationDetailView,
    ApplicationFullUpdateView, ApplicationStatusUpdateView, ApplicationDeleteView
)

# Document views
from .document_views import (
    DocumentListView,
    DocumentUploadView,
    DocumentDetailView,
    DocumentDeleteView
)
