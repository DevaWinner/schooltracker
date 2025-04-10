from rest_framework import serializers
from api.models.application_models import Application
from api.serializers.institution_serializers import InstitutionListSerializer

class ApplicationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing applications"""
    institution_name = serializers.CharField(source='institution.name', read_only=True)
    institution_country = serializers.CharField(source='institution.country', read_only=True)
    
    class Meta:
        model = Application
        fields = ('id', 'institution_name', 'institution_country', 'program_name', 
                  'degree_type', 'status', 'start_date', 'submitted_date', 'decision_date')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for application details"""
    institution_details = InstitutionListSerializer(source='institution', read_only=True)
    
    class Meta:
        model = Application
        fields = ('id', 'user', 'institution', 'institution_details', 'program_name', 
                  'degree_type', 'department', 'duration_years', 'tuition_fee', 
                  'application_link', 'scholarship_link', 'program_info_link',
                  'status', 'start_date', 'submitted_date', 'decision_date',
                  'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        
    def validate_institution(self, value):
        """Ensure the institution exists"""
        return value
        
class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating applications"""
    class Meta:
        model = Application
        fields = ('id', 'institution', 'program_name', 'degree_type', 'department',
                  'duration_years', 'tuition_fee', 'application_link', 'scholarship_link',
                  'program_info_link', 'status', 'start_date', 'submitted_date', 
                  'decision_date', 'notes')
        read_only_fields = ('id',)
        
    def create(self, validated_data):
        # Automatically set the user from the request
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
