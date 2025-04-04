from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, UserInfoSerializer

class RegisterAPIView(APIView):
    """
    post:
    Register a new user.
    
    This endpoint registers a new user with the provided information.
    
    **Request Body:**
    
    - **email**: User email address (string, required)
    - **password**: User password (string, required)
    - **first_name**: First name (string, required)
    - **last_name**: Last name (string, required)
    - **phone**: Phone number (string, optional)
    - **date_of_birth**: Date of birth (YYYY-MM-DD, optional)
    - **gender**: Gender ('Male', 'Female', 'Other'; optional)
    - **country**: Country (string, required)
    
    **Response (201 Created):**
    
    ```json
    {
        "status": "User registered successfully",
        "user": { ...user info... },
        "access_token": "access_token_here",
        "refresh_token": "refresh_token_here"
    }
    ```
    
    **Error Response (400 Bad Request):**
    Invalid input data.
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
    post:
    Log in an existing user.
    
    This endpoint authenticates the user using email and password and returns JWT tokens.
    
    **Request Body:**
    
    - **email**: User email address (string, required)
    - **password**: User password (string, required)
    
    **Response (200 OK):**
    
    ```json
    {
        "status": "success",
        "user": { ...user info... },
        "access_token": "access_token_here",
        "refresh_token": "refresh_token_here"
    }
    ```
    
    **Error Response (401 Unauthorized):**
    Invalid email or password.
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
    get:
    Retrieve user information.
    
    This endpoint returns the authenticated user's information.
    
    **Security:**
    Requires Bearer JWT token.
    
    **Response (200 OK):**
    
    ```json
    {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1234567890",
        "date_of_birth": "1990-01-01",
        "gender": "Male",
        "country": "CountryName",
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
    }
    ```
    
    **Error Response (401 Unauthorized):**
    Invalid or missing authentication token.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
