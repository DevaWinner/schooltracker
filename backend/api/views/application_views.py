from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from api.models.application_models import Application
from api.serializers.application_serializers import (
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateSerializer
)

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing university applications
    
    list:
    Lists all applications for the authenticated user.
    
    create:
    Creates a new application.
    
    retrieve:
    Retrieves details for a specific application.
    
    update:
    Updates all fields of an application.
    
    partial_update:
    Updates specific fields of an application.
    
    destroy:
    Deletes an application.
    
    ---
    ## Filters
    
    | Parameter | Type | Description |
    | --------- | ---- | ----------- |
    | status | string | Filter by application status |
    | degree_type | string | Filter by degree type |
    | institution | integer | Filter by institution ID |
    
    ## Search
    
    Search by program name or department
    
    ## Ordering
    
    Order by created_at, updated_at, start_date, submitted_date, or decision_date
    
    ## Permissions
    
    Users can only access their own applications
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'degree_type', 'institution']
    search_fields = ['program_name', 'department']
    ordering_fields = ['created_at', 'updated_at', 'start_date', 'submitted_date', 'decision_date']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        # Check if this is a schema generation request
        if getattr(self, 'swagger_fake_view', False):
            # Return an empty queryset for schema generation
            return Application.objects.none()
        
        # Regular request - users can only see their own applications
        return Application.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        elif self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationDetailSerializer
    
    def perform_create(self, serializer):
        # Ensure the application is assigned to the requesting user
        serializer.save(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Optional: Add business logic here if needed
        # For example, prevent deletion of submitted applications
        if instance.status not in ['Draft', 'In Progress']:
            return Response(
                {"error": f"Cannot delete applications with status '{instance.status}'. Only Draft or In Progress applications can be deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
