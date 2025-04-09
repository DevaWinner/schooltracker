from django.contrib import admin
from api.models.user_models import Userinfo, UserProfile, UserSettings
from api.models.institution_models import (
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty, InternationalStudents,
    InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)

# Register user models
admin.site.register(Userinfo)
admin.site.register(UserProfile)
admin.site.register(UserSettings)

# Register institution models
admin.site.register(Institution)
admin.site.register(Classification)
admin.site.register(AcademicReputation)
admin.site.register(EmployerReputation)
admin.site.register(FacultyStudent)
admin.site.register(CitationsPerFaculty)
admin.site.register(InternationalFaculty)
admin.site.register(InternationalStudents)
admin.site.register(InternationalResearchNetwork)
admin.site.register(EmploymentOutcomes)
admin.site.register(Sustainability)