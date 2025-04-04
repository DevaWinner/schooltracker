from rest_framework import serializers
from .models import Userinfo, UserProfile, UserSettings

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
