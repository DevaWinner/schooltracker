from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from supabase import create_client
import uuid
import os
import imghdr

from api.models.user_models import UserProfile, UserSettings
from api.serializers.user_serializers import UserInfoSerializer, UserProfileSerializer, UserSettingsSerializer

class UserInfoRetrieveView(RetrieveAPIView):
    """
    View User Information
    
    **GET /api/user/info/**
    
    Retrieve user's basic account information including personal details and contact information.
    
    ## Response Format
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
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserInfoSerializer
    
    def get_object(self):
        return self.request.user

class UserInfoUpdateView(UpdateAPIView):
    """
    Update User Information
    
    **PUT /api/user/info/update/**
    
    Update user's basic account information including personal details and contact information.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | first_name | string | No | Your first name |
    | last_name | string | No | Your last name |
    | phone | string | No | Your phone number |
    | date_of_birth | string (YYYY-MM-DD) | No | Your date of birth |
    | gender | string | No | Your gender: "Male", "Female", or "Other" |
    | country | string | No | Your country |
    
    ## Response Format
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
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserInfoSerializer
    http_method_names = ['put']  # Only allow PUT method
    
    def get_object(self):
        return self.request.user

class UserProfileRetrieveView(RetrieveAPIView):
    """
    View User Profile
    
    **GET /api/user/profile/**
    
    Retrieve user's extended profile information including bio, profile picture, and social media links.
    
    ## Response Format
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
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

class UserProfileUpdateView(UpdateAPIView):
    """
    Update User Profile
    
    **PUT /api/user/profile/update/**
    
    Update user's extended profile information including bio, social media links, and other public details.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | bio | string | No | Your biography or description |
    | facebook | string | No | Your Facebook profile URL |
    | twitter | string | No | Your Twitter profile URL |
    | linkedin | string | No | Your LinkedIn profile URL |
    | instagram | string | No | Your Instagram profile URL |
    
    ## Response Format
    ```json
    {
        "id": 1,
        "user_id": 1,
        "bio": "Updated bio information",
        "profile_picture": "https://example.com/avatar.jpg",
        "facebook": "https://facebook.com/johndoe",
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "instagram": "https://instagram.com/johndoe",
        "created_at": "2024-05-10T12:00:00Z",
        "updated_at": "2024-05-10T13:00:00Z"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    http_method_names = ['put']  # Only allow PUT method
    
    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

class UserSettingsRetrieveView(RetrieveAPIView):
    """
    View User Settings
    
    **GET /api/user/settings/**
    
    Retrieve user's application preferences and settings.
    
    ## Response Format
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
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSettingsSerializer
    
    def get_object(self):
        return UserSettings.objects.get(user=self.request.user)

class UserSettingsUpdateView(UpdateAPIView):
    """
    Update User Settings
    
    **PUT /api/user/settings/update/**
    
    Update user's application preferences and settings.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | language | string | No | Your preferred language (default: 'en') |
    | timezone | string | No | Your timezone (default: 'UTC') |
    | notification_email | boolean | No | Whether to receive email notifications (default: true) |
    
    ## Response Format
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
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSettingsSerializer
    http_method_names = ['put']  # Only allow PUT method
    
    def get_object(self):
        return UserSettings.objects.get(user=self.request.user)

class ProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField(required=True)
    
    class Meta:
        fields = ['profile_picture']

class ProfilePictureUploadView(CreateAPIView):
    """
    Upload Profile Picture
    
    **POST /api/user/upload-profile-picture/**
    
    Upload a new profile picture. If user already has a profile picture, it will be replaced.
    
    ## Request
    
    Send a multipart/form-data request with:
    - **profile_picture**: The image file (JPEG, PNG, or GIF) 
    
    ## Maximum File Size
    
    Maximum upload size: 50 MB
    
    ## Response Format
    ```json
    {
        "profile_picture": "https://example.com/storage/v1/object/public/profile-pictures/user_1_abc123.jpg"
    }
    ```
    
    ## Error Responses
    
    ### 400 Bad Request
    No file provided
    ```json
    {
        "error": "No file provided"
    }
    ```
    
    ### 400 Bad Request
    Invalid file type
    ```json
    {
        "error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."
    }
    ```
    
    ### 413 Payload Too Large
    File too large
    ```json
    {
        "error": "File size exceeds maximum allowed (50 MB)"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ProfilePictureSerializer  # Add serializer class
    
    def get_serializer_class(self):
        # Handle swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return self.serializer_class
        return self.serializer_class
    
    def post(self, request):
        # Check if this is a schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return Response({"profile_picture": "https://example.com/profile.jpg"})
        
        try:
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
            
            # Validate file type using file extension
            _, file_extension = os.path.splitext(file.name)
            file_extension = file_extension.lower()
            
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            
            if file_extension not in allowed_extensions:
                return Response(
                    {"error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Additional validation using built-in Python methods
            try:
                # Read a bit of the file to check if it's a valid image
                file_content = file.read()
                file.seek(0)  # Reset file pointer after reading
                
                # Try using the built-in imghdr module to detect image type
                img_type = imghdr.what(None, file_content)
                
                valid_img_types = ['jpeg', 'jpg', 'png', 'gif']
                if img_type not in valid_img_types:
                    return Response(
                        {"error": "The file is not a valid image. Only JPEG, PNG, and GIF are allowed."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                # Continue with upload if imghdr validation fails
                pass
            
            # Generate unique filename
            user_id = request.user.id
            unique_filename = f"{user_id}/profile{uuid.uuid4()}{file_extension}"
            
            try:
                # Initialize Supabase client
                service_key = getattr(settings, 'SUPABASE_SERVICE_KEY', None)
                if service_key:
                    supabase = create_client(settings.SUPABASE_URL, service_key)
                else:
                    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                
                # Get user's profile
                profile = request.user.profile
                
                # Delete previous profile picture if exists
                if profile.profile_picture:
                    try:
                        current_path = profile.profile_picture.split('/public/')[1] if '/public/' in profile.profile_picture else None
                        
                        if current_path:
                            supabase.storage.from_(settings.SUPABASE_BUCKET).remove([current_path])
                    except Exception as e:
                        pass
                
                # Ensure file_content exists
                if 'file_content' not in locals():
                    file_content = file.read()
                
                # Determine content type based on extension
                content_type_map = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif'
                }
                content_type = content_type_map.get(file_extension, 'application/octet-stream')
                
                # Upload file to Supabase Storage
                try:
                    result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                        path=unique_filename,
                        file=file_content,
                        file_options={"contentType": content_type}
                    )
                    
                    # Add a small delay to ensure the file is available
                    import time
                    time.sleep(1)
                    
                except Exception as first_err:
                    # Try with upsert flag (overwrite if exists)
                    result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                        path=unique_filename,
                        file=file_content,
                        file_options={"contentType": content_type},
                        file_options_extra={"upsert": "true"}
                    )
                
                # Get public URL for the uploaded file
                file_url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(unique_filename)
                
                # Update user profile with the new profile picture URL
                profile.profile_picture = file_url
                profile.save()
                
                return Response({"profile_picture": file_url}, status=status.HTTP_200_OK)
                
            except Exception as e:
                import traceback
                traceback_str = traceback.format_exc()
                return Response({"error": str(e), "details": traceback_str}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            import traceback
            traceback_str = traceback.format_exc()
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class UserAccountDeleteView(DestroyAPIView):
    """
    Delete User Account
    
    **DELETE /api/user/delete-account/**
    
    Permanently delete user account and all associated data.
    This action cannot be undone.
    
    ## Request Body
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | confirm_deletion | boolean | Yes | Set to true to confirm deletion |
    
    ## Response Format (Success)
    ```json
    {
        "message": "User account deleted successfully"
    }
    ```
    
    ## Error Response
    ```json
    {
        "error": "You must confirm deletion by setting confirm_deletion to true"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
        
    def delete(self, request, *args, **kwargs):
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
                    pass
            
            # Delete the user (which will cascade to profile and settings due to ForeignKey relationships)
            user.delete()
            
            return Response({"message": "User account deleted successfully"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
