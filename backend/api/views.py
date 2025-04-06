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
from rest_framework import filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from .models import Userinfo, UserProfile, UserSettings, Institution
from .serializers import (
    RegisterSerializer, 
    LoginSerializer, 
    UserInfoSerializer, 
    UserProfileSerializer, 
    UserSettingsSerializer,
    InstitutionListSerializer, 
    InstitutionDetailSerializer
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
        try:
            print("Processing profile picture upload request...")
            
            # Check if a file was provided
            if 'profile_picture' not in request.FILES:
                print("No file found in request.FILES")
                return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            file = request.FILES['profile_picture']
            print(f"File received: {file.name}, size: {file.size} bytes")
            
            # Check file size
            if file.size > settings.MAX_UPLOAD_SIZE:
                print(f"File too large: {file.size} bytes (max: {settings.MAX_UPLOAD_SIZE})")
                return Response(
                    {"error": f"File size exceeds maximum allowed (50 MB)"},
                    status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                )
            
            # Validate file type using file extension (primary method)
            _, file_extension = os.path.splitext(file.name)
            file_extension = file_extension.lower()
            
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            
            if file_extension not in allowed_extensions:
                print(f"Invalid file extension: {file_extension}")
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
                import imghdr
                img_type = imghdr.what(None, file_content)
                
                valid_img_types = ['jpeg', 'jpg', 'png', 'gif']
                if img_type not in valid_img_types:
                    print(f"Invalid image type detected: {img_type}")
                    return Response(
                        {"error": "The file is not a valid image. Only JPEG, PNG, and GIF are allowed."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                # If imghdr validation fails, log the error but continue with the upload
                # since we've already validated the file extension
                print(f"Warning: image validation failed: {str(e)}")
            
            # Generate unique filename with user folder structure for RLS
            user_id = request.user.id
            unique_filename = f"{user_id}/profile{uuid.uuid4()}{file_extension}"
            print(f"Generated unique filename: {unique_filename}")
            
            try:
                # Initialize Supabase client
                print(f"Initializing Supabase client with URL: {settings.SUPABASE_URL}")
                
                # Try with service key if available
                service_key = getattr(settings, 'SUPABASE_SERVICE_KEY', None)
                if service_key:
                    supabase = create_client(settings.SUPABASE_URL, service_key)
                else:
                    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                
                # Get the user's profile
                profile = request.user.profile
                
                # Delete previous profile picture if exists
                if profile.profile_picture:
                    try:
                        # Extract filename from the URL
                        current_path = profile.profile_picture.split('/public/')[1] if '/public/' in profile.profile_picture else None
                        
                        if current_path:
                            # Delete the file from Supabase
                            print(f"Attempting to delete previous profile picture: {current_path}")
                            supabase.storage.from_(settings.SUPABASE_BUCKET).remove([current_path])
                            print(f"Deleted previous profile picture: {current_path}")
                    except Exception as e:
                        # Log the error but continue with the upload
                        print(f"Error deleting previous profile picture: {str(e)}")
                
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
                print(f"Uploading file to bucket: {settings.SUPABASE_BUCKET}")
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
                    print(f"First upload attempt failed: {str(first_err)}")
                    # Try with upsert flag (overwrite if exists)
                    result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                        path=unique_filename,
                        file=file_content,
                        file_options={"contentType": content_type},
                        file_options_extra={"upsert": "true"}
                    )
                
                # Get public URL for the uploaded file
                file_url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(unique_filename)
                print(f"File uploaded successfully. Public URL: {file_url}")
                
                # Update user profile with the new profile picture URL
                profile.profile_picture = file_url
                profile.save()
                
                return Response({"profile_picture": file_url}, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"Error during Supabase upload: {str(e)}")
                # Return detailed error message with traceback for debugging
                import traceback
                traceback_str = traceback.format_exc()
                print(traceback_str)
                return Response({"error": str(e), "details": traceback_str}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Unexpected error in profile picture upload: {str(e)}")
            import traceback
            traceback_str = traceback.format_exc()
            print(traceback_str)
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

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

# Institution Directory Views

class InstitutionListView(generics.ListAPIView):
    """
    List all institutions with pagination, search, and filters
    
    Get a list of educational institutions with various filtering and search options.
    
    ---
    ## Query Parameters
    
    | Parameter | Type | Description |
    | --------- | ---- | ----------- |
    | search | string | Search by institution name |
    | country | string | Filter by country |
    | rank_lte | number | Filter by rank less than or equal to value |
    | rank_gte | number | Filter by rank greater than or equal to value |
    | research | string | Filter by research level (from classification) |
    | size | string | Filter by institution size (from classification) |
    | focus | string | Filter by institution focus (from classification) |
    | page | number | Page number for pagination |
    | page_size | number | Number of results per page |
    
    ## Response
    
    ```json
    {
        "count": 1000,
        "next": "http://example.com/api/institutions/?page=2",
        "previous": null,
        "results": [
            {
                "id": "123",
                "rank": "1",
                "name": "Harvard University",
                "country": "United States",
                "overall_score": "95.8"
            },
            ...
        ]
    }
    ```
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'country': ['exact'],
        'rank': ['exact', 'lt', 'gt', 'lte', 'gte'],
    }
    search_fields = ['name', 'country']
    ordering_fields = ['rank', 'name', 'country', 'overall_score']
    ordering = ['rank']
    pagination_class = PageNumberPagination
    
    def get_queryset(self):
        queryset = Institution.objects.all()
        
        # Advanced filtering for related models
        research = self.request.query_params.get('research')
        size = self.request.query_params.get('size')
        focus = self.request.query_params.get('focus')
        
        if research:
            queryset = queryset.filter(classification__research=research)
        
        if size:
            queryset = queryset.filter(classification__size=size)
        
        if focus:
            queryset = queryset.filter(classification__focus=focus)
            
        return queryset

class InstitutionDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific institution by ID
    
    Get detailed information about a specific educational institution.
    
    ---
    ## Path Parameters
    
    | Parameter | Type | Description |
    | --------- | ---- | ----------- |
    | id | string | The unique identifier of the institution |
    
    ## Response
    
    ```json
    {
        "id": "123",
        "rank": "1",
        "name": "Harvard University",
        "country": "United States",
        "overall_score": "95.8",
        "web_links": "https://www.harvard.edu",
        "classification": {
            "id": "class_123",
            "size": "Large",
            "focus": "Full comprehensive",
            "research": "Very High"
        },
        "academic_reputation": {
            "id": "ar_123",
            "score": "100",
            "rank": "1"
        },
        ...
    }
    ```
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionDetailSerializer
    lookup_field = 'id'
