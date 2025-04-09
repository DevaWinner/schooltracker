# This file now serves as an entry point that re-exports all serializers from the modular structure
# Import all serializers from the modular structure
from api.serializers.auth_serializers import RegisterSerializer, LoginSerializer
from api.serializers.user_serializers import UserInfoSerializer, UserProfileSerializer, UserSettingsSerializer
from api.serializers.institution_serializers import (
    InstitutionListSerializer, InstitutionDetailSerializer,
    ClassificationSerializer, AcademicReputationSerializer, EmployerReputationSerializer,
    FacultyStudentSerializer, CitationsPerFacultySerializer, InternationalFacultySerializer,
    InternationalStudentsSerializer, InternationalResearchNetworkSerializer,
    EmploymentOutcomesSerializer, SustainabilitySerializer
)

# All these classes are re-exported so existing imports will still work
