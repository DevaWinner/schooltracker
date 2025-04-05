# apps/schools/serializers.py
from rest_framework import serializers
from .models import School

class SchoolSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_null=True)
    country = serializers.CharField(required=False, allow_null=True)
    website = serializers.CharField(required=False, allow_null=True)
    state_province = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = School
        fields = '__all__'
