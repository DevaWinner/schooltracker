from rest_framework import serializers
from api.models.institution_models import (
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty, InternationalStudents,
    InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)

class ClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classification
        exclude = ('institution',)

class AcademicReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicReputation
        exclude = ('institution',)

class EmployerReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerReputation
        exclude = ('institution',)

class FacultyStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyStudent
        exclude = ('institution',)

class CitationsPerFacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = CitationsPerFaculty
        exclude = ('institution',)

class InternationalFacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalFaculty
        exclude = ('institution',)

class InternationalStudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalStudents
        exclude = ('institution',)

class InternationalResearchNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalResearchNetwork
        exclude = ('institution',)

class EmploymentOutcomesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentOutcomes
        exclude = ('institution',)

class SustainabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Sustainability
        exclude = ('institution',)

class InstitutionDetailSerializer(serializers.ModelSerializer):
    classification = ClassificationSerializer(read_only=True)
    academic_reputation = AcademicReputationSerializer(read_only=True)
    employer_reputation = EmployerReputationSerializer(read_only=True)
    faculty_student = FacultyStudentSerializer(read_only=True)
    citations_per_faculty = CitationsPerFacultySerializer(read_only=True)
    international_faculty = InternationalFacultySerializer(read_only=True)
    international_students = InternationalStudentsSerializer(read_only=True)
    international_research_network = InternationalResearchNetworkSerializer(read_only=True)
    employment_outcomes = EmploymentOutcomesSerializer(read_only=True)
    sustainability = SustainabilitySerializer(read_only=True)

    class Meta:
        model = Institution
        fields = '__all__'

class InstitutionListSerializer(serializers.ModelSerializer):
    """Serializer for listing institutions"""
    rank = serializers.CharField()  # Changed to CharField to preserve original format
    
    class Meta:
        model = Institution
        fields = ['id', 'rank', 'name', 'country', 'overall_score']
