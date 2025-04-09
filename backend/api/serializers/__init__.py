# This file makes the serializers directory a Python package
# The serializers should be imported directly from their respective files
from .auth_serializers import RegisterSerializer, LoginSerializer
from .user_serializers import UserInfoSerializer, UserProfileSerializer, UserSettingsSerializer
from .institution_serializers import (
    InstitutionListSerializer, InstitutionDetailSerializer,
    ClassificationSerializer, AcademicReputationSerializer, EmployerReputationSerializer,
    FacultyStudentSerializer, CitationsPerFacultySerializer, InternationalFacultySerializer,
    InternationalStudentsSerializer, InternationalResearchNetworkSerializer,
    EmploymentOutcomesSerializer, SustainabilitySerializer
)
