from rest_framework import serializers
from api.models.user_models import Userinfo

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
