from rest_framework import status, generics, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from supabase import create_client
import uuid
import os
import mimetypes

from api.models.document_models import Document
from api.serializers.document_serializers import (
    DocumentListSerializer,
    DocumentDetailSerializer,
    DocumentUploadSerializer
)

class DocumentListView(generics.ListAPIView):
    """
    List User Documents
    
    **GET /api/documents/**
    
    Retrieve a list of all documents associated with the authenticated user.
    
    ## Query Parameters
    
    | Parameter | Type | Required | Description |
    | --------- | ---- | -------- | ----------- |
    | application | integer | No | Filter by application ID |
    | document_type | string | No | Filter by document type |
    
    ## Response Format
    ```json
    [
        {
            "id": 1,
            "document_type": "Transcript",
            "file_name": "official_transcript.pdf",
            "file_url": "https://example.com/storage/v1/object/public/documents/1/transcript_abc123.pdf",
            "uploaded_at": "2024-04-15T10:30:00Z",
            "application_id": 5,
            "application_info": {
                "id": 5,
                "program_name": "Computer Science",
                "institution_name": "Harvard University"
            }
        },
        ...
    ]
    ```
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'application']
    search_fields = ['file_name']
    ordering_fields = ['uploaded_at', 'document_type', 'file_name']
    ordering = ['-uploaded_at']
    
    def get_queryset(self):
        # Check if this is a schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()
        
        user = self.request.user
        queryset = Document.objects.filter(user=user)
        
        # Optional filter by application_id
        application_id = self.request.query_params.get('application')
        if application_id:
            queryset = queryset.filter(application_id=application_id)
            
        return queryset

class DocumentUploadView(generics.CreateAPIView):
    """
    Upload Document
    
    **POST /api/documents/**
    
    Upload a new document and associate it with the user and optionally an application.
    The document will be stored in Supabase Storage under the user's folder.
    
    ## Request
    
    Send a multipart/form-data request with:
    
    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | file | File | Yes | The document file to upload |
    | document_type | string | Yes | Type of document: 'Transcript', 'Essay', 'CV', 'Recommendation Letter', or 'Other' |
    | application | integer | No | ID of the application to associate with this document |
    | file_name | string | No | Custom name for the file (defaults to the uploaded file's name) |
    
    ## Maximum File Size
    
    Maximum upload size: 50 MB
    
    ## Response Format
    ```json
    {
        "id": 1,
        "document_type": "Transcript",
        "file_name": "official_transcript.pdf",
        "file_url": "https://example.com/storage/v1/object/public/documents/1/transcript_abc123.pdf",
        "uploaded_at": "2024-04-15T10:30:00Z",
        "application_id": 5,
        "application_info": {
            "id": 5,
            "program_name": "Computer Science",
            "institution_name": "Harvard University"
        }
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
    serializer_class = DocumentUploadSerializer
    
    def post(self, request, *args, **kwargs):
        # Check if this is a schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return Response({
                "id": 1,
                "document_type": "Transcript",
                "file_name": "transcript.pdf",
                "file_url": "https://example.com/documents/1.pdf",
                "uploaded_at": "2024-04-15T10:30:00Z"
            })
        
        try:
            # Check if a file was provided
            if 'file' not in request.FILES:
                return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            file = request.FILES['file']
            
            # Check file size
            if file.size > settings.MAX_UPLOAD_SIZE:
                return Response(
                    {"error": f"File size exceeds maximum allowed (50 MB)"},
                    status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                )
            
            # Create a serializer with the data
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract data from the valid serializer
            document_type = serializer.validated_data.get('document_type')
            application = serializer.validated_data.get('application')
            
            # Use provided filename or extract from the uploaded file
            file_name = serializer.validated_data.get('file_name') or file.name
            
            # Generate a unique filename
            user_id = request.user.id
            _, file_extension = os.path.splitext(file.name)
            unique_filename = f"{user_id}/documents/{document_type.lower().replace(' ', '_')}_{uuid.uuid4()}{file_extension}"
            
            # Read the file content
            file_content = file.read()
            
            try:
                # Initialize Supabase client
                service_key = getattr(settings, 'SUPABASE_SERVICE_KEY', None)
                if service_key:
                    supabase = create_client(settings.SUPABASE_URL, service_key)
                else:
                    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                
                # Determine content type
                content_type = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
                
                # Upload file to Supabase Storage
                try:
                    upload_result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                        path=unique_filename,
                        file=file_content,
                        file_options={"contentType": content_type}
                    )
                    
                except Exception as first_err:
                    # Try with upsert flag (overwrite if exists)
                    upload_result = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                        path=unique_filename,
                        file=file_content,
                        file_options={"contentType": content_type},
                    )
                
                # Get public URL for the uploaded file
                file_url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(unique_filename)
                
                # Create document record in the database
                document = Document.objects.create(
                    user=request.user,
                    application=application,
                    document_type=document_type,
                    file_name=file_name,
                    file_url=file_url
                )
                
                # Return the created document
                result_serializer = DocumentListSerializer(document)
                return Response(result_serializer.data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                import traceback
                traceback_str = traceback.format_exc()
                return Response({"error": str(e), "details": traceback_str}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            import traceback
            traceback_str = traceback.format_exc()
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class DocumentDetailView(generics.RetrieveAPIView):
    """
    View Document Details
    
    **GET /api/documents/{id}/**
    
    Retrieve detailed information about a specific document, including metadata and download URL.
    
    ## Response Format
    ```json
    {
        "id": 1,
        "user": 3,
        "application": 5,
        "document_type": "Transcript",
        "file_name": "official_transcript.pdf",
        "file_url": "https://example.com/storage/v1/object/public/documents/1/transcript_abc123.pdf",
        "uploaded_at": "2024-04-15T10:30:00Z",
        "application_info": {
            "id": 5,
            "program_name": "Computer Science",
            "institution_name": "Harvard University",
            "degree_type": "Master",
            "status": "Submitted"
        }
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentDetailSerializer
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()
        return Document.objects.filter(user=self.request.user)

class DocumentDeleteView(generics.DestroyAPIView):
    """
    Delete Document
    
    **DELETE /api/documents/{id}/**
    
    Permanently delete a document from both the database and storage.
    
    ## Response
    
    ### 204 No Content
    Document successfully deleted
    
    ### 404 Not Found
    Document not found or does not belong to the authenticated user
    ```json
    {
        "detail": "Not found."
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()
        return Document.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            # Initialize Supabase client to delete the file from storage
            service_key = getattr(settings, 'SUPABASE_SERVICE_KEY', None)
            if service_key:
                supabase = create_client(settings.SUPABASE_URL, service_key)
            else:
                supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            
            # Extract path from the file URL
            if instance.file_url and '/public/' in instance.file_url:
                file_path = instance.file_url.split('/public/')[1]
                # Delete the file from Supabase storage
                try:
                    supabase.storage.from_(settings.SUPABASE_BUCKET).remove([file_path])
                except Exception as e:
                    # Log but continue with database deletion even if storage deletion fails
                    print(f"Error deleting file from storage: {e}")
        except Exception as e:
            # Log but continue with database deletion
            print(f"Error initializing Supabase client: {e}")
        
        # Delete the document record from the database
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
