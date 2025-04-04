import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .supabase_config import (
    supabase_signup,
    supabase_signin,
    signin_with_google
)
from supabase import AuthApiError

from .serializers import (
    UserProfileSerializer,
    UserInfoSerializer,
    UserSettingsSerializer
)
from .models import UserProfile, UserInfo, UserSettings

User = get_user_model()

#function to register users
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            password2 = data.get("password2")
            first_name = data.get("first_name")
            last_name = data.get("last_name")

            # Password match check
            if password != password2:
                return JsonResponse(
                    {"error": "Registration failed! Passwords do not match"},
                    status=400,
                )

            # Email already exists check
            if User.objects.filter(email=email).exists():
                return JsonResponse(
                    {"error": "Registration failed! Email already exists"},
                    status=400,
                )

            # Register user with Supabase
            response = supabase_signup(email, password)

            if response.get("status") == "success" and "user" in response:
                user_data = response["user"]
                supabase_uid = user_data["id"]

                # Create or update Django user
                user, created = User.objects.update_or_create(
                    email=email,
                    defaults={
                        "username": email,
                        "supabase_uid": supabase_uid,
                        "first_name": first_name,
                        "last_name": last_name
                    }
                )

                if created:
                    user.set_password(password)
                    user.save()

                # Create user profile if not exists
                UserProfile.objects.get_or_create(user=user)

                return JsonResponse(
                    {
                        "status": "User registered successfully",
                        "user": {
                            "id": user_data["id"],
                            "email": user_data["email"],
                            "created_at": user_data["created_at"],
                            "updated_at": user_data.get("updated_at", user_data["created_at"]),
                        },
                    },
                    status=201,
                )
            else:
                return JsonResponse(
                    {"error": "Registration failed", "details": response},
                    status=400,
                )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def signin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            result = supabase_signin(email, password)

            # Check if Supabase returned an error
            if "error" in result:
                error_message = str(result["error"])
                
                if "Email not confirmed" in error_message:
                    return JsonResponse(
                        {"error": "Your email is not confirmed. Please check your inbox for the verification email."}, 
                        status=403
                    )
                return JsonResponse({"error": error_message}, status=400)
            return JsonResponse(result)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data received."}, status=400)
        except AuthApiError as e:
            return JsonResponse({"error": f"Authentication failed: {str(e)}"}, status=401)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=400)


def google_login_view(request):
    """
    Uses your signin_with_google() function
    Returns JSON with auth URL or error
    """
    try:
        result = signin_with_google()
        # If result is a tuple (error case), unpack it
        if isinstance(result, tuple) and 'error' in result[0]:
            error_data, status_code = result
            return JsonResponse(error_data, status=status_code)
        # Successful case
        if 'url' in result:
            return JsonResponse({"auth_url": result['url']})
        # Fallback error if neither case matches
        return JsonResponse(
            {"error": "Unexpected response from authentication service"},
            status=500
        )
    except Exception as e:
        return JsonResponse(
            {"error": f"Internal server error: {str(e)}"},
            status=500
        )
    

class UserProfileView(APIView):
    """
    API endpoint to retrieve and update user profiles.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Retrieve authenticated user's profile, including User and UserProfile fields."""
        if request.user.id != user_id:
            return Response(
                {"error": "You are not authorized to access this profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        """Update the authenticated user's profile, including first_name and last_name."""
        if request.user.id != user_id:
            return Response(
                {"error": "You are not authorized to access this profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "user profile": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    """
    API endpoint to retrieve and update user info.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            if request.user.id != user_id:
                return Response(
                    {"error": "You are not authorized to access this profile."},
                    status=status.HTTP_403_FORBIDDEN
                )
            user_info, _ = UserInfo.objects.get_or_create(user=request.user)
            serializer = UserInfoSerializer(user_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, user_id):
        try:
            if request.user.id != user_id:
                return Response(
                    {"error": "You are not authorized to access this profile."},
                    status=status.HTTP_403_FORBIDDEN
                )
            user_info, _ = UserInfo.objects.get_or_create(user=request.user)
            serializer = UserInfoSerializer(user_info, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User info updated successfully", "user info": serializer.data},
                    status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UserSettingsView(APIView):
    """
    API endpoint to retrieve and update user settings.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            if request.user.id != user_id:
                return Response(
                    {"error": "You are not authorized to access this profile."},
                    status=status.HTTP_403_FORBIDDEN
                )
            user_settings, _ = UserSettings.objects.get_or_create(user=request.user)
            serializer = UserSettingsSerializer(user_settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, user_id):
        try:
            if request.user.id != user_id:
                return Response(
                    {"error": "You are not authorized to access this profile."},
                    status=status.HTTP_403_FORBIDDEN
                )
            user_settings, _ = UserSettings.objects.get_or_create(user=request.user)
            serializer = UserSettingsSerializer(user_settings)
            serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                {"message": "User settings updated successfully", "user settings": serializer.data},
                status=status.HTTP_200_OK
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)