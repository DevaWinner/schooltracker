from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import School
from .serializers import SchoolSerializer

class SchoolListCreateAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        schools = School.objects.all()
        if query:
            # Efficient case-insensitive partial match search on name and country
            schools = schools.filter(
                Q(name__icontains=query) | Q(country__icontains=query)
            )
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchoolDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return School.objects.get(pk=pk)
        except School.DoesNotExist:
            return None

    def get(self, request, pk):
        school = self.get_object(pk)
        if not school:
            return Response({'detail': 'School not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SchoolSerializer(school)
        return Response(serializer.data)

    def put(self, request, pk):
        school = self.get_object(pk)
        if not school:
            return Response({'detail': 'School not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SchoolSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
