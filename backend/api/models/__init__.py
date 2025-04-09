# This file makes the models directory a Python package
# The models should be imported directly from their respective files

from .user_models import Userinfo, UserProfile, UserSettings
from .institution_models import (
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty, InternationalStudents,
    InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)
# Import the new Application model
from .application_models import Application
