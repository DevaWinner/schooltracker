from rest_framework import serializers
from .models import (
    Userinfo, UserProfile, UserSettings,
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty, InternationalStudents,
    InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userinfo
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender', 'country', 'created_at', 'updated_at')
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Userinfo
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender', 'country')
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Userinfo.objects.create_user(password=password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user.id', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user_id', 'bio', 'profile_picture', 'facebook', 'twitter', 'linkedin', 'instagram', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_id', 'created_at', 'updated_at')

class UserSettingsSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user.id', read_only=True)
    
    class Meta:
        model = UserSettings
        fields = ('id', 'user_id', 'language', 'timezone', 'notification_email', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_id', 'created_at', 'updated_at')

# Institution Serializers

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
    """Simplified serializer for listing institutions"""
    class Meta:
        model = Institution
        fields = ('id', 'rank', 'name', 'country', 'overall_score')
