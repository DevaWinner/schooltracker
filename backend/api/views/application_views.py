from rest_framework import status, filters, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from api.models.application_models import Application
from api.serializers.application_serializers import (
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateSerializer
)

class ApplicationListView(generics.ListAPIView):
    """
    List All Applications
    
    **GET /api/applications/**
    
    Retrieve a paginated list of all your university applications with filtering and search capabilities.
    
    ## Response Format
    ```json
    {
        "count": 15,
        "next": "http://example.com/api/applications/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "institution_name": "Harvard University",
                "institution_country": "United States",
                "program_name": "Computer Science",
                "degree_type": "Master",
                "status": "Submitted",
                "submitted_date": "2024-04-01",
                "decision_date": null
            },
            ...
        ]
    }
    ```
    
    ## Filter Options
    
    - **status**: Filter by application stage (Draft, In Progress, Submitted, etc.)
    - **degree_type**: Filter by degree (Bachelor, Master, PhD, etc.)
    - **institution**: Filter by university ID
    
    ## Search Capability
    
    Search across program names and departments using the `search` parameter.
    Example: `?search=Computer Science`
    
    ## Sorting Options
    
    Sort using the `ordering` parameter:
    - `created_at` - When you added the application
    - `updated_at` - When you last modified the application
    - `start_date` - Program start date
    - `submitted_date` - When you submitted your application
    - `decision_date` - When you received a decision
    
    Prefix with `-` for descending order. Example: `?ordering=-submitted_date`
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'degree_type', 'institution']
    search_fields = ['program_name', 'department']
    ordering_fields = ['created_at', 'updated_at', 'start_date', 'submitted_date', 'decision_date']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Application.objects.none()
        return Application.objects.filter(user=self.request.user)

class ApplicationCreateView(generics.CreateAPIView):
    """
    Create New Application
    
    **POST /api/applications/create/**
    
    Add a new university application to your tracking list. The application is automatically 
    associated with the user.
    
    ## Request Format
    ```json
    {
        "institution": "123",
        "program_name": "Computer Science",
        "degree_type": "Master",
        "department": "School of Engineering",
        "duration_years": 2,
        "tuition_fee": 50000,
        "application_link": "https://apply.university.edu",
        "scholarship_link": "https://university.edu/scholarships",
        "program_info_link": "https://university.edu/programs/cs",
        "status": "Draft",
        "start_date": "2025-09-01",
        "notes": "Need to prepare statement of purpose"
    }
    ```
    
    ## Response
    
    Returns the created application with full details including ID and timestamps.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationCreateSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    """
    View and Update Application Details
    
    **GET /api/applications/{id}/**
    
    Retrieve comprehensive information about a specific application, including institution details,
    important dates, and user personal notes.
    
    **PATCH /api/applications/{id}/**
    
    Update fields of an existing application. Provide only the fields you want to update.
    
    ## Response Format
    ```json
    {
        "id": 1,
        "institution_details": {
            "id": "123",
            "rank": "5",
            "name": "Harvard University",
            "country": "United States",
            "overall_score": "95.2"
        },
        "program_name": "Computer Science",
        "degree_type": "Master",
        "department": "School of Engineering",
        "duration_years": 2,
        "tuition_fee": 50000,
        "application_link": "https://apply.university.edu",
        "scholarship_link": "https://university.edu/scholarships",
        "program_info_link": "https://university.edu/programs/cs",
        "status": "Submitted",
        "start_date": "2025-09-01",
        "submitted_date": "2024-04-01",
        "decision_date": null,
        "notes": "Submitted all required documents",
        "created_at": "2024-03-15T10:30:00Z",
        "updated_at": "2024-04-01T15:45:00Z"
    }
    ```
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationDetailSerializer
    http_method_names = ['get', 'patch']  # Allow both GET and PATCH
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Application.objects.none()
        return Application.objects.filter(user=self.request.user)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def perform_update(self, serializer):
        serializer.save()

class ApplicationFullUpdateView(viewsets.ModelViewSet):
    """
    Full Application Update
    
    **PUT /api/applications/{id}/update/**
    
    Completely update an existing application record with new information.
    All fields must be provided in the request for a full replacement update.
    
    ## Request Format
    ```json
    {
        "institution": "123",
        "program_name": "Computer Science",
        "degree_type": "Master",
        "department": "School of Engineering",
        "duration_years": 2,
        "tuition_fee": 50000,
        "application_link": "https://apply.university.edu",
        "scholarship_link": "https://university.edu/scholarships",
        "program_info_link": "https://university.edu/programs/cs",
        "status": "Submitted",
        "start_date": "2025-09-01",
        "submitted_date": "2024-04-01",
        "decision_date": null,
        "notes": "Updated application details"
    }
    ```
    
    ## Response
    
    Returns the updated application with all fields.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationDetailSerializer
    http_method_names = ['put']  # Only allow PUT method
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Application.objects.none()
        return Application.objects.filter(user=self.request.user)

class ApplicationStatusUpdateView(viewsets.ModelViewSet):
    """
    Update Application Fields
    
    **PATCH /api/applications/{id}/status/**
    
    Partially update an application by modifying only the fields provided.
    User can update any combination of fields including status, dates, program details, or notes.
    
    ## Request Examples
    
    ### Updating Status and Related Information
    ```json
    {
        "status": "Interview",
        "notes": "Interview scheduled for May 15, 2024 at 2:00 PM"
    }
    ```
    
    ### Updating Program Details
    ```json
    {
        "program_name": "Advanced Computer Science",
        "tuition_fee": 55000,
        "department": "Department of Computer Science"
    }
    ```
    
    ### Updating Application Links
    ```json
    {
        "application_link": "https://university.edu/apply/new-link",
        "scholarship_link": "https://university.edu/scholarships/updated"
    }
    ```
    
    ### Common Status Workflow Updates
    
    1. Change status to "Submitted":
    ```json
    {
        "status": "Submitted",
        "submitted_date": "2024-04-15"
    }
    ```
    
    2. Record interview stage:
    ```json
    {
        "status": "Interview",
        "notes": "Interview scheduled for May 15"
    }
    ```
    
    3. Record decision:
    ```json
    {
        "status": "Accepted",
        "decision_date": "2024-05-30",
        "notes": "Accepted with $10,000 scholarship"
    }
    ```
    
    ## Response
    
    Returns the updated application with all fields.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationDetailSerializer
    http_method_names = ['patch']  # Only allow PATCH method
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Application.objects.none()
        return Application.objects.filter(user=self.request.user)

class ApplicationDeleteView(generics.DestroyAPIView):
    """
    Delete Application
    
    **DELETE /api/applications/{id}/delete/**
    
    Remove an application from users tracking list.
    
    ## Restrictions
    
    - Only applications with status 'Draft' or 'In Progress' can be deleted
    - Returns 204 No Content on success
    - Returns 400 Bad Request if deletion is not allowed
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Application.objects.none()
        return Application.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Only allow deletion of applications in certain states
        if instance.status not in ['Draft', 'In Progress']:
            return Response(
                {"error": f"Cannot delete applications with status '{instance.status}'. Only Draft or In Progress applications can be deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
