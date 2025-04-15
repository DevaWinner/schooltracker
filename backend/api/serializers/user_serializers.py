from rest_framework import serializers
from api.models.user_models import Userinfo, UserProfile, UserSettings

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userinfo
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender', 'country', 'created_at', 'updated_at')
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')

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
