# This file now serves as an entry point that re-exports all models from the modular structure
# Import all models from the modular structure
from api.models.user_models import UserInfoManager, Userinfo, UserProfile, UserSettings, GENDER_CHOICES
from api.models.institution_models import (
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty, InternationalStudents,
    InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)

# All these classes are re-exported so existing imports will still work
