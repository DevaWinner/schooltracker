from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from api.models.user_models import Userinfo
from api.serializers.auth_serializers import RegisterSerializer, LoginSerializer, CustomTokenRefreshSerializer
from api.serializers.user_serializers import UserInfoSerializer

class RegisterAPIView(APIView):
    """
    Register a new user
    
    Creates a new user account with the provided information and returns authentication tokens.
    Also automatically creates associated profile and settings records.
    
    ---
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | email | string (email) | Yes | User's email address (must be unique) |
    | password | string | Yes | User's password |
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

class TokenRefreshAPIView(TokenRefreshView):
    """
    Refresh Authentication Token
    
    **POST /api/auth/token/refresh/**
    
    Obtain a new access token using a valid refresh token.
    This extends the user's session without requiring them to log in again.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | refresh | string | Yes | Valid refresh token previously obtained during login |
    
    ## Response Format (Success)
    ```json
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```
    
    ## Error Response
    ```json
    {
        "detail": "Token is invalid or expired",
        "code": "token_not_valid"
    }
    ```
    """
    serializer_class = CustomTokenRefreshSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except TokenError as e:
            raise InvalidToken(e.args[0])

class TokenVerifyAPIView(APIView):
    """
    Verify Authentication Token
    
    **POST /api/auth/token/verify/**
    
    Check if a token is still valid without making an authenticated request.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | token | string | Yes | JWT token to verify |
    
    ## Response Format (Success)
    ```json
    {
        "valid": true
    }
    ```
    
    ## Response Format (Invalid Token)
    ```json
    {
        "valid": false
    }
    ```
    """
    def post(self, request, *args, **kwargs):
        token = request.data.get('token', '')
        
        if not token:
            return Response({"valid": False}, status=status.HTTP_200_OK)
            
        try:
            # Attempt to parse the token - will raise an exception if invalid
            RefreshToken(token)
            return Response({"valid": True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"valid": False}, status=status.HTTP_200_OK)
