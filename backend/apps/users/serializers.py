from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
from .utils.country_names import COUNTRY_CHOICES
from .utils.country_codes import COUNTRY_CODE_CHOICES

CustomUser = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model.
    """
    first_name = serializers.CharField(source="user.first_name", required=False)
    last_name = serializers.CharField(source="user.last_name", required=False)
    email = serializers.EmailField(source="user.email", read_only=True)
    country_code = serializers.ChoiceField(choices=COUNTRY_CODE_CHOICES, required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_null=True)
    gender = serializers.ChoiceField(choices=[("Male", "Male"), ("Female", "Female")], required=False, allow_null=True)
    country = serializers.ChoiceField(choices=COUNTRY_CHOICES, required=False, allow_null=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    profile_avatar = serializers.ImageField(required=False, allow_null=True)

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

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update UserProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
