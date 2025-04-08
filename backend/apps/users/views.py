import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes

from .supabase_config import (
    supabase_signup,
    supabase_signin,
    signin_with_google
)
from supabase import AuthApiError
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from .serializers import (
    UserProfileSerializer,
    UserInfoSerializer,
    UserSettingsSerializer
)
from .models import UserProfile, UserInfo, UserSettings

User = get_user_model()

#function to register users
@swagger_auto_schema(
    method='post',
    operation_summary="Sign up for an account",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email', 'password', 'password2', 'first_name', 'last_name'],
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
            'password2': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
            'first_name': openapi.Schema(type=openapi.TYPE_STRING),
            'last_name': openapi.Schema(type=openapi.TYPE_STRING),
        },
    ),
    responses={
        201: openapi.Response(
            description="User registered successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "status": openapi.Schema(type=openapi.TYPE_STRING, example="User registered successfully"),
                    "user": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(type=openapi.TYPE_STRING),
                            "email": openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        }
                    )
                }
            )
        ),
        400: openapi.Response(
            description="Invalid input or email exists",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING, example="Registration failed! Passwords do not match")
                }
            )
        ),
        500: openapi.Response(
            description="Server error",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING, example="Unexpected server error")
                }
            )
        )
    },
    security=[]
)
@api_view(["POST"])
@permission_classes([AllowAny])
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


@swagger_auto_schema(
    method='post',
    operation_summary="Sign in with email & password",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email', 'password'],
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
        }
    ),
    responses={
        200: openapi.Response(
            description="User signed in successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "status": openapi.Schema(type=openapi.TYPE_STRING, example="success"),
                    "user": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(type=openapi.TYPE_STRING),
                            "email": openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                        }
                    ),
                    "access_token": openapi.Schema(type=openapi.TYPE_STRING),
                    "refresh_token": openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
        ),
        400: openapi.Response(
            description="Invalid credentials or input",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING, example="Invalid email or password")
                }
            )
        ),
        500: openapi.Response(
            description="Server error",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING, example="Internal server error")
                }
            )
        )
    },
    security=[]
)
@api_view(['POST'])
@permission_classes([AllowAny])
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


@swagger_auto_schema(
    method='get',
    operation_summary="Sign in with google",
    responses={
        200: openapi.Response(
            description="Returns the Google authentication URL",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'auth_url': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        format="uri",
                        example="https://xyz.supabase.co/auth/v1/authorize?provider=google&..."
                    )
                }
            )
        ),
        503: openapi.Response(
            description="Supabase failed to return auth URL",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example="Authentication service unavailable"
                    )
                }
            )
        ),
        500: openapi.Response(
            description="Unexpected server error",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example="Internal server error: Authentication error"
                    )
                }
            )
        )
    },
    security=[]
)
@api_view(["GET"])
@permission_classes([AllowAny])
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

    @swagger_auto_schema(
        operation_summary="Get user profile",
        operation_description="Retrieve the authenticated user's profile. You must be the owner of the profile.",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="User profile retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "email": openapi.Schema(type=openapi.TYPE_STRING, format="email"),
                        "first_name": openapi.Schema(type=openapi.TYPE_STRING),
                        "last_name": openapi.Schema(type=openapi.TYPE_STRING),
                        "country_code": openapi.Schema(type=openapi.TYPE_STRING),
                        "phone_number": openapi.Schema(type=openapi.TYPE_STRING),
                        "age": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "gender": openapi.Schema(type=openapi.TYPE_STRING),
                        "date_of_birth": openapi.Schema(type=openapi.TYPE_STRING, format="date"),
                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                        "profile_avatar": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            403: openapi.Response(description="Forbidden: You are not authorized to access this profile"),
        }
    )
    def get(self, request):
        """Retrieve authenticated user's profile, including User and UserProfile fields."""
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Update user profile",
        operation_description="Update the authenticated user's profile. Allows partial updates.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "country": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the user's country. Optional. Must match one of the available COUNTRY_CHOICES.",
                    nullable=True,
                    maxLength=80
                ),
                "country_code": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Country code (e.g., +1, +234). Optional. Must match one of the COUNTRY_CODE_CHOICES.",
                    nullable=True,
                    maxLength=80
                ),
                "phone_number": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Phone number of the user. Optional field.",
                    nullable=True,
                    maxLength=20
                ),
                "age": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Age of the user. Must be a positive integer. Optional field.",
                    nullable=True
                ),
                "gender": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Gender of the user. Acceptable values: 'Male', 'Female'. Optional field.",
                    nullable=True,
                    enum=["Male", "Female"]
                ),
                "date_of_birth": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    description="Date of birth in YYYY-MM-DD format. Optional field.",
                    nullable=True
                ),
                "profile_avatar": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the profile picture/avatar of the user. Optional field.",
                    nullable=True
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Profile updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "user profile": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "email": openapi.Schema(type=openapi.TYPE_STRING),
                                "first_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "last_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "country_code": openapi.Schema(type=openapi.TYPE_STRING),
                                "phone_number": openapi.Schema(type=openapi.TYPE_STRING),
                                "age": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "gender": openapi.Schema(type=openapi.TYPE_STRING),
                                "date_of_birth": openapi.Schema(type=openapi.TYPE_STRING, format="date"),
                                "country": openapi.Schema(type=openapi.TYPE_STRING),
                                "profile_avatar": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(description="Invalid input or validation error"),
            403: openapi.Response(description="Forbidden: You are not authorized to access this profile"),
        }
    )
    def put(self, request):
        """Update the authenticated user's profile, including first_name and last_name."""
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "user_profile": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    """
    API endpoint to retrieve and update user info.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get user info",
        operation_description="Retrieves the bio and social links for the authenticated user. Only the owner can access this.",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="User info retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "bio": openapi.Schema(type=openapi.TYPE_STRING, description="User biography"),
                        "facebook": openapi.Schema(type=openapi.TYPE_STRING, format="uri", description="Facebook URL"),
                        "twitter": openapi.Schema(type=openapi.TYPE_STRING, format="uri", description="Twitter URL"),
                        "linkedin": openapi.Schema(type=openapi.TYPE_STRING, format="uri", description="LinkedIn URL"),
                        "instagram": openapi.Schema(type=openapi.TYPE_STRING, format="uri", description="Instagram URL"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            403: openapi.Response(description="Forbidden: You are not authorized to access this info"),
            404: openapi.Response(description="User not found"),
        }
    )
    def get(self, request):
        user_info, created = UserInfo.objects.get_or_create(user=request.user)
        serializer = UserInfoSerializer(user_info)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    @swagger_auto_schema(
        operation_summary="Update user info",
        operation_description="Partially updates the bio and social media links of the authenticated user.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "bio": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="A short biography or description about the user. Optional.",
                    nullable=True
                ),
                "facebook": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the user's Facebook profile. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "twitter": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the user's Twitter profile. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "linkedin": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the user's LinkedIn profile. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "instagram": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the user's Instagram profile. Optional field.",
                    nullable=True,
                    maxLength=100
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="User info updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "user info": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "bio": openapi.Schema(type=openapi.TYPE_STRING),
                                "facebook": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                                "twitter": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                                "linkedin": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                                "instagram": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(description="Validation failed"),
            403: openapi.Response(description="Forbidden: You are not authorized to access this info"),
            404: openapi.Response(description="User not found"),
        }
    )
    def put(self, request):
        user_info, created = UserInfo.objects.get_or_create(user=request.user)
        serializer = UserInfoSerializer(user_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User info updated successfully", "user info": serializer.data},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSettingsView(APIView):
    """
    API endpoint to retrieve and update user settings.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get user settings",
        operation_description="Retrieves notification, language, and timezone settings for the authenticated user. Only the owner can access this.",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="User settings retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "language": openapi.Schema(type=openapi.TYPE_STRING, description="User's preferred language"),
                        "timezone": openapi.Schema(type=openapi.TYPE_STRING, description="User's timezone (e.g., UTC, GMT+1)"),
                        "email_notification": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Whether email notifications are enabled"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            403: openapi.Response(description="Forbidden: You are not authorized to access this settings"),
            404: openapi.Response(description="User not found"),
        }
    )
    def get(self, request):
        user_settings, created = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(user_settings)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    @swagger_auto_schema(
        operation_summary="Update user settings",
        operation_description="Partially updates the user's settings like language, timezone, and email notifications.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "language": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="The language preference for the user. Defaults to 'en'. Optional field.",
                    nullable=False,
                    default="en"
                ),
                "timezone": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="The timezone preference for the user. Defaults to 'UTC'. Optional field.",
                    nullable=False,
                    default="UTC"
                ),
                "email_notification": openapi.Schema(
                    type=openapi.TYPE_BOOLEAN,
                    description="User's email notification preference. Defaults to 'False'. Optional field.",
                    nullable=False,
                    default=False
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="User settings updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "user settings": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "language": openapi.Schema(type=openapi.TYPE_STRING),
                                "timezone": openapi.Schema(type=openapi.TYPE_STRING),
                                "email_notification": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(description="Validation error"),
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="User not found")
        }
    )
    def put(self, request):
        user_settings, created = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User settings updated successfully", "user info": serializer.data},
                    status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    