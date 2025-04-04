from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, UserSettings
from .serializers import (RegisterSerializer, LoginSerializer, UserInfoSerializer,
                         UserProfileSerializer, UserSettingsSerializer)

class RegisterAPIView(APIView):
    """
    Register a new user account
    
    Creates a new user account with the provided information and returns authentication tokens.
    
    ---
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | email | string (email) | Yes | User's email address (must be unique) |
    | password | string | Yes | User's password (min length: 8 characters) |
    | first_name | string | Yes | User's first name |
    | last_name | string | Yes | User's last name |
    | phone | string | No | User's phone number |
    | date_of_birth | string (YYYY-MM-DD) | No | User's date of birth |
    | gender | string (enum) | No | User's gender: "Male", "Female", or "Other" |
    | country | string | Yes | User's country |
    
    ## Responses
    
    ### 201 Created
    User account created successfully
    ```json
    {
        "status": "User registered successfully",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "1234567890",
            "date_of_birth": "1990-01-01",
            "gender": "Male",
            "country": "United States",
            "created_at": "2024-05-10T12:00:00Z",
            "updated_at": "2024-05-10T12:00:00Z"
        },
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```
    
    ### 400 Bad Request
    Invalid or missing required fields
    ```json
    {
        "email": ["This field is required."],
        "password": ["This field is required."],
        "first_name": ["This field is required."],
        "last_name": ["This field is required."],
        "country": ["This field is required."]
    }
    ```
    
    ### 400 Bad Request
    Email already exists
    ```json
    {
        "email": ["User with this email already exists."]
    }
    ```
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                "status": "User registered successfully",
                "user": UserInfoSerializer(user).data,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    """
    Authenticate and log in a user
    
    Authenticates a user with their email and password, then returns JWT tokens for authorization.
    
    ---
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | email | string (email) | Yes | User's registered email address |
    | password | string | Yes | User's password |
    
    ## Responses
    
    ### 200 OK
    Login successful
    ```json
    {
        "status": "success",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "1234567890",
            "date_of_birth": "1990-01-01",
            "gender": "Male",
            "country": "United States",
            "created_at": "2024-05-10T12:00:00Z",
            "updated_at": "2024-05-10T12:00:00Z"
        },
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```
    
    ### 400 Bad Request
    Missing or invalid fields
    ```json
    {
        "email": ["This field is required."],
        "password": ["This field is required."]
    }
    ```
    
    ### 401 Unauthorized
    Invalid credentials
    ```json
    {
        "error": "Invalid email or password"
    }
    ```
    
    ## Usage Notes
    - The access token expires after 5 minutes
    - Use the refresh token to obtain a new access token
    - Include the access token in the Authorization header for protected endpoints: `Authorization: Bearer {access_token}`
    """
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                data = {
                    "status": "success",
                    "user": UserInfoSerializer(user).data,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                }
                return Response(data, status=status.HTTP_200_OK)
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfoAPIView(APIView):
    """
    Retrieve authenticated user's basic information
    
    Returns the basic registration information for the currently authenticated user.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## Responses
    
    ### 200 OK
    User information retrieved successfully
    ```json
    {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1234567890",
        "date_of_birth": "1990-01-01",
        "gender": "Male",
        "country": "United States",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T12:00:00Z"
    }
    ```
    
    ### 401 Unauthorized
    Missing or invalid token
    ```json
    {
        "detail": "Authentication credentials were not provided."
    }
    ```
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfileAPIView(APIView):
    """
    Manage user profile
    
    Retrieve or update the authenticated user's profile information.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## Endpoints
    
    ### GET
    Retrieve the user's profile
    
    #### Responses
    
    ##### 200 OK
    Profile retrieved successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "bio": "Software developer with 5 years of experience",
        "profile_picture": "https://example.com/avatar.jpg",
        "facebook": "https://facebook.com/johndoe",
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "instagram": "https://instagram.com/johndoe",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T12:00:00Z"
    }
    ```
    
    ### PUT
    Update the user's profile
    
    #### Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | bio | string | No | User's biography or description |
    | profile_picture | string (URL) | No | URL to user's profile picture |
    | facebook | string (URL) | No | User's Facebook profile URL |
    | twitter | string (URL) | No | User's Twitter profile URL |
    | linkedin | string (URL) | No | User's LinkedIn profile URL |
    | instagram | string (URL) | No | User's Instagram profile URL |
    
    #### Responses
    
    ##### 200 OK
    Profile updated successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "bio": "Updated bio information",
        "profile_picture": "https://example.com/new-avatar.jpg",
        "facebook": "https://facebook.com/johndoe",
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "instagram": "https://instagram.com/johndoe",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T12:30:00Z"
    }
    ```
    
    ##### 400 Bad Request
    Invalid input data
    ```json
    {
        "profile_picture": ["Enter a valid URL."]
    }
    ```
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSettingsAPIView(APIView):
    """
    Manage user settings
    
    Retrieve or update the authenticated user's preference settings.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## Endpoints
    
    ### GET
    Retrieve the user's settings
    
    #### Responses
    
    ##### 200 OK
    Settings retrieved successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "language": "en",
        "timezone": "UTC",
        "notification_email": true,
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T12:00:00Z"
    }
    ```
    
    ### PUT
    Update the user's settings
    
    #### Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | language | string | No | User's preferred language (default: 'en') |
    | timezone | string | No | User's timezone (default: 'UTC') |
    | notification_email | boolean | No | Whether to receive email notifications (default: true) |
    
    #### Responses
    
    ##### 200 OK
    Settings updated successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "language": "fr",
        "timezone": "Europe/Paris",
        "notification_email": false,
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T12:30:00Z"
    }
    ```
    
    ##### 400 Bad Request
    Invalid input data
    ```json
    {
        "language": ["Ensure this field has no more than 10 characters."]
    }
    ```
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings = UserSettings.objects.get(user=request.user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        settings = UserSettings.objects.get(user=request.user)
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
