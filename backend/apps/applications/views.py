from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

from .models import Program, Application
from .serializers import ProgramSerializer, ApplicationSerializer

# Utility function for consistent response format
def response_message(success=True, message="", data=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": success,
        "message": message,
        "data": data
    }, status=status_code)

# --- Program Views ---

class ProgramListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        programs = Program.objects.all()
        serializer = ProgramSerializer(programs, many=True)
        return response_message(True, "Programs retrieved successfully.", serializer.data)

    def post(self, request):
        serializer = ProgramSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response_message(True, "Program added successfully.", serializer.data, status.HTTP_201_CREATED)
        return response_message(False, "Invalid program data.", serializer.errors, status.HTTP_400_BAD_REQUEST)


class ProgramDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Program, pk=pk)

    def get(self, request, pk):
        program = self.get_object(pk)
        serializer = ProgramSerializer(program)
        return response_message(True, "Program retrieved successfully.", serializer.data)

    def put(self, request, pk):
        program = self.get_object(pk)
        serializer = ProgramSerializer(program, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response_message(True, "Program updated successfully.", serializer.data)
        return response_message(False, "Failed to update program. Invalid data.", serializer.errors, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        program = self.get_object(pk)
        program.delete()
        return response_message(True, "Program deleted successfully.", status_code=status.HTTP_204_NO_CONTENT)


# --- Application Views ---

class ApplicationListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return response_message(True, "Applications retrieved successfully.", serializer.data)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return response_message(True, "Application created successfully.", serializer.data, status.HTTP_201_CREATED)
        return response_message(False, "Invalid application data.", serializer.errors, status.HTTP_400_BAD_REQUEST)


class ApplicationDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        """Ensure user can only access their own applications."""
        app = get_object_or_404(Application, pk=pk)
        if app.user != user:
            raise PermissionDenied("You are not authorized to access this application.")
        return app

    def get(self, request, pk):
        try:
            application = self.get_object(pk, request.user)
            serializer = ApplicationSerializer(application)
            return response_message(True, "Application retrieved successfully.", serializer.data)
        except PermissionDenied as e:
            return response_message(False, str(e), status_code=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        try:
            application = self.get_object(pk, request.user)
            serializer = ApplicationSerializer(application, data=request.data, context={'request': request}, partial=True)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return response_message(True, "Application updated successfully.", serializer.data)
            return response_message(False, "Failed to update application. Invalid data.", serializer.errors, status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return response_message(False, str(e), status_code=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        try:
            application = self.get_object(pk, request.user)
            application.delete()
            return response_message(True, "Application deleted successfully.", status_code=status.HTTP_204_NO_CONTENT)
        except PermissionDenied as e:
            return response_message(False, str(e), status_code=status.HTTP_403_FORBIDDEN)
