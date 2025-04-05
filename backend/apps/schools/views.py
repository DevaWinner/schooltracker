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
