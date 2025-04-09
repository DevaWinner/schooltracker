from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, UserInfo, UserSettings
from .supabase_config import upload_file

CustomUser = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model.
    """
    def to_representation(self, instance):
        """
        Ensure the profile_avatar is correctly represented in API response.
        """
        representation = super().to_representation(instance)
        representation["profile_avatar"] = instance.profile_avatar if instance.profile_avatar else None
        return representation
    
    first_name = serializers.CharField(source="user.first_name", required=False)
    last_name = serializers.CharField(source="user.last_name", required=False)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id", "email", "first_name", "last_name", "country_code", "phone_number",
            "age", "gender", "date_of_birth", "country", "profile_avatar", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "email", "created_at", "updated_at"]

    def update(self, instance, validated_data):
        """
        Updates UserProfile including profile avatar upload.
        """
        user_data = validated_data.pop("user", {})
        user = instance.user

        # Handle profile picture upload
        profile_avatar = validated_data.pop("profile_avatar", None)
        if profile_avatar:
            upload_response = upload_file(profile_avatar, "profile_pictures")

            if not upload_response or "status" not in upload_response:
                raise serializers.ValidationError({"profile_avatar": "Upload service did not return a valid response."})

            # Correct way to access dictionary response
            if upload_response.get("status") == "success":
                uploaded_url = upload_response.get("url")
                
                if not uploaded_url.startswith("https"):
                    raise serializers.ValidationError({"profile_avatar": "Invalid image URL received from upload service."})
                instance.profile_avatar = uploaded_url
            else:
                raise serializers.ValidationError({"profile_avatar": upload_response.get("message")})

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update UserProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['bio', 'facebook', 'twitter', 'linkedin', 'instagram', 'created_at', 'updated_at']


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['language', 'timezone', 'email_notification', 'created_at', 'updated_at']
