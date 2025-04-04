from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import uuid
import os
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from supabase import create_client, Client

from .models import Userinfo, UserProfile, UserSettings
from .serializers import (
    RegisterSerializer, 
    LoginSerializer, 
    UserInfoSerializer, 
    UserProfileSerializer, 
    UserSettingsSerializer
)

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

class UserInfoAPIView(APIView):
    """
    Retrieve or update user basic information
    
    Get or update the authenticated user's basic registration information.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## GET
    Retrieves the user's basic information
    
    ### Responses
    
    #### 200 OK
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
    
    ## PUT
    Updates the user's basic information
    
    ### Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | first_name | string | No | User's first name |
    | last_name | string | No | User's last name |
    | phone | string | No | User's phone number |
    | date_of_birth | string (YYYY-MM-DD) | No | User's date of birth |
    | gender | string (enum) | No | User's gender: "Male", "Female", or "Other" |
    | country | string | No | User's country |
    
    ### Responses
    
    #### 200 OK
    User information updated successfully
    ```json
    {
        "id": 1,
        "email": "user@example.com",
        "first_name": "Updated First",
        "last_name": "Updated Last",
        "phone": "9876543210",
        "date_of_birth": "1992-02-02",
        "gender": "Female",
        "country": "Canada",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T13:00:00Z"
    }
    ```
    
    #### 400 Bad Request
    Invalid input data
    ```json
    {
        "gender": ["\"Invalid\" is not a valid choice."]
    }
    ```
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        serializer = UserInfoSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileAPIView(APIView):
    """
    Retrieve or update user profile
    
    Get or update the authenticated user's extended profile information.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## GET
    Retrieves the user's profile information
    
    ### Responses
    
    #### 200 OK
    User profile retrieved successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
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
    
    ## PUT
    Updates the user's profile information
    
    ### Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | bio | string | No | User's biography or description |
    | profile_picture | string (URL) | No | URL to user's profile picture |
    | facebook | string (URL) | No | User's Facebook profile URL |
    | twitter | string (URL) | No | User's Twitter profile URL |
    | linkedin | string (URL) | No | User's LinkedIn profile URL |
    | instagram | string (URL) | No | User's Instagram profile URL |
    
    ### Responses
    
    #### 200 OK
    User profile updated successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "bio": "Updated bio information",
        "profile_picture": "https://example.com/new-avatar.jpg",
        "facebook": "https://facebook.com/johndoe",
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "instagram": "https://instagram.com/johndoe",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T13:00:00Z"
    }
    ```
    
    #### 400 Bad Request
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
    Retrieve or update user settings
    
    Get or update the authenticated user's preference settings.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## GET
    Retrieves the user's settings
    
    ### Responses
    
    #### 200 OK
    User settings retrieved successfully
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
    
    ## PUT
    Updates the user's settings
    
    ### Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | language | string | No | User's preferred language (default: 'en') |
    | timezone | string | No | User's timezone (default: 'UTC') |
    | notification_email | boolean | No | Whether to receive email notifications (default: true) |
    
    ### Responses
    
    #### 200 OK
    User settings updated successfully
    ```json
    {
        "id": 1,
        "user_id": 1,
        "language": "fr",
        "timezone": "Europe/Paris",
        "notification_email": false,
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T13:00:00Z"
    }
    ```
    
    #### 400 Bad Request
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

class UploadProfilePictureAPIView(APIView):
    """
    Upload profile picture
    
    Uploads a profile picture for the current user and stores it in Supabase Storage.
    Updates the user's profile with the new image URL.
    If the user already has a profile picture, the previous one is deleted.
    
    ---
    ## Request
    
    Multipart form with the file in the 'profile_picture' field.
    Maximum file size: 50 MB
    Allowed file types: JPEG, PNG, GIF
    
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## Responses
    
    ### 200 OK
    Profile picture uploaded successfully
    ```json
    {
        "profile_picture": "https://example.com/storage/v1/object/public/profile-pictures/user_1_abc123.jpg"
    }
    ```
    
    ### 400 Bad Request
    No file provided or invalid file
    ```json
    {
        "error": "No file provided"
    }
    ```
    or
    ```json
    {
        "error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."
    }
    ```
    
    ### 413 Payload Too Large
    File exceeds maximum size
    ```json
    {
        "error": "File size exceeds maximum allowed (50 MB)"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        # Check if a file was provided
        if 'profile_picture' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['profile_picture']
        
        # Check file size
        if file.size > settings.MAX_UPLOAD_SIZE:
            return Response(
                {"error": f"File size exceeds maximum allowed (50 MB)"},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            )
        
        # Validate file type
        import magic
        file_content = file.read()
        file.seek(0)  # Reset file pointer after reading
        
        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file_content)
        
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if file_type not in allowed_types:
            return Response(
                {"error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate unique filename
        _, file_extension = os.path.splitext(file.name)
        unique_filename = f"user_{request.user.id}_{uuid.uuid4()}{file_extension}"
        
        try:
            # Initialize Supabase client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            
            # Get the user's profile
            profile = request.user.profile
            
            # Delete previous profile picture if exists
            if profile.profile_picture:
                try:
                    # Extract filename from the URL
                    current_filename = profile.profile_picture.split('/')[-1]
                    
                    # Delete the file from Supabase
                    supabase.storage.from_(settings.SUPABASE_BUCKET).remove([current_filename])
                    print(f"Deleted previous profile picture: {current_filename}")
                except Exception as e:
                    # Log the error but continue with the upload
                    print(f"Error deleting previous profile picture: {e}")
            
            # Upload file to Supabase Storage
            result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                path=unique_filename,
                file=file_content,
                file_options={"content-type": file_type}
            )
            
            # Get public URL for the uploaded file
            file_url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(unique_filename)
            
            # Update user profile with the new profile picture URL
            profile.profile_picture = file_url
            profile.save()
            
            return Response({"profile_picture": file_url}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserAPIView(APIView):
    """
    Delete user account
    
    Deletes the authenticated user's account and all related data (profile, settings, etc.).
    Also deletes any profile pictures stored in Supabase.
    This action cannot be undone.
    
    ---
    ## Authorization
    
    Requires a valid JWT access token in the Authorization header:
    `Authorization: Bearer {access_token}`
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | confirm_deletion | boolean | Yes | Must be set to true to confirm account deletion |
    
    ## Responses
    
    ### 200 OK
    User account deleted successfully
    ```json
    {
        "message": "User account deleted successfully"
    }
    ```
    
    ### 400 Bad Request
    Deletion not confirmed
    ```json
    {
        "error": "You must confirm deletion by setting confirm_deletion to true"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        # Require explicit confirmation to prevent accidental deletion
        confirm_deletion = request.data.get('confirm_deletion', False)
        
        if not confirm_deletion:
            return Response(
                {"error": "You must confirm deletion by setting confirm_deletion to true"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        
        try:
            # Delete profile picture from Supabase storage if it exists
            if hasattr(user, 'profile') and user.profile.profile_picture:
                try:
                    # Initialize Supabase client
                    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                    
                    # Extract filename from the URL
                    current_filename = user.profile.profile_picture.split('/')[-1]
                    
                    # Delete the file from Supabase
                    supabase.storage.from_(settings.SUPABASE_BUCKET).remove([current_filename])
                except Exception as e:
                    # Log the error but continue with account deletion
                    print(f"Error deleting profile picture during account deletion: {e}")
            
            # Delete the user (which will cascade to profile and settings due to ForeignKey relationships)
            user.delete()
            
            return Response({"message": "User account deleted successfully"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
