from rest_framework import serializers
from api.models.document_models import Document

class DocumentListSerializer(serializers.ModelSerializer):
    """Serializer for listing documents"""
    application_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'document_type', 'file_name', 'file_url', 'uploaded_at', 'application_id', 'application_info']
        read_only_fields = ['id', 'file_url', 'uploaded_at', 'application_info']
    
    def get_application_info(self, obj):
        if obj.application:
            return {
                'id': obj.application.id,
                'program_name': obj.application.program_name,
                'institution_name': obj.application.institution.name if obj.application.institution else None
            }
        return None

class DocumentDetailSerializer(serializers.ModelSerializer):
    """Serializer for document details"""
    application_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'user', 'application', 'document_type', 'file_name', 
                  'file_url', 'uploaded_at', 'application_info']
        read_only_fields = ['id', 'user', 'file_url', 'uploaded_at', 'application_info']
    
    def get_application_info(self, obj):
        if obj.application:
            return {
                'id': obj.application.id,
                'program_name': obj.application.program_name,
                'institution_name': obj.application.institution.name if obj.application.institution else None,
                'degree_type': obj.application.degree_type,
                'status': obj.application.status
            }
        return None

class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for document upload"""
    file = serializers.FileField(write_only=True)
    
    class Meta:
        model = Document
        fields = ['id', 'application', 'document_type', 'file_name', 'file_url', 'file', 'uploaded_at']
        read_only_fields = ['id', 'file_url', 'uploaded_at']
        extra_kwargs = {
            'file_name': {'required': False}  # Will be set from the uploaded file if not provided
        }
