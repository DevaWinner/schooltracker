from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import School, Institution
from .serializers import (
    SchoolSerializer,
    InstitutionDetailSerializer,
    InstitutionFilter,
    InstitutionListSerializer
)
from .utils.rank_sorting import filter_and_sort_institutions
from .utils.swagger_filters import filter_parameters
from .utils.custom_pagination import CustomPagination


class SchoolListCreateAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    @swagger_auto_schema(
        operation_summary="List schools",
        operation_description="""
        Retrieve a list of schools.  
        You can optionally filter the results using the `q` query parameter to perform a **case-insensitive search** on the school `name` and `country`.
        """,
        manual_parameters=[
            openapi.Parameter(
                name="q",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description="Search keyword for filtering schools by name or country (case-insensitive)"
            )
        ],
        responses={
            200: openapi.Response(
                description="List of schools retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "name": openapi.Schema(type=openapi.TYPE_STRING),
                            "country": openapi.Schema(type=openapi.TYPE_STRING),
                            "state_province": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                            "website": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        }
                    )
                )
            )
        },
        security=[]
    )
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


    @swagger_auto_schema(
        operation_summary="Create a new school",
        operation_description="Creates a new school with details such as name, country, state/province, and website.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["name", "country", "website"],
            properties={
                "name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Full name of the school. This is a required field.",
                    maxLength=200
                ),
                "country": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Country where the school is located. This is a required field.",
                    maxLength=100
                ),
                "state_province": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="State or province where the school is located. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "website": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="Official website URL of the school. This is a required field.",
                    maxLength=255
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="School created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                        "state_province": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                        "website": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            400: openapi.Response(description="Validation failed")
        }
    )
    def post(self, request):
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchoolDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_object(self, pk):
        try:
            return School.objects.get(pk=pk)
        except School.DoesNotExist:
            return None

    @swagger_auto_schema(
        operation_summary="Get a school by ID",
        operation_description="Retrieve detailed information for a school by its unique ID.",
        responses={
            200: openapi.Response(
                description="School retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                        "state_province": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                        "website": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            404: openapi.Response(
                description="School not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="School not found")
                    }
                )
            )
        },
        security=[]
    )
    def get(self, request, pk):
        school = self.get_object(pk)
        if not school:
            return Response({'detail': 'School not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SchoolSerializer(school)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Update a school by ID",
        operation_description="Update an existing school by its unique ID. Only partial updates are allowed.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Full name of the school. Optional field.",
                    maxLength=200
                ),
                "country": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Country where the school is located. Optional field.",
                    maxLength=100
                ),
                "state_province": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="State or province where the school is located. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "website": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="Official website URL of the school. Optional field.",
                    maxLength=255
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="School updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                        "state_province": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                        "website": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    }
                )
            ),
            404: openapi.Response(
                description="School not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="School not found")
                    }
                )
            ),
            400: openapi.Response(
                description="Bad request (invalid data)",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Invalid data format")
                    }
                )
            )
        }
    )
    def put(self, request, pk):
        school = self.get_object(pk)
        if not school:
            return Response({'detail': 'School not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SchoolSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# GET /institutions/?search=&country=&rank_gte=&rank_lte=...
class InstitutionListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]  # Unprotected route
    queryset = Institution.objects.all().select_related('classification')
    serializer_class = InstitutionListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = InstitutionFilter
    ordering_fields = ['rank', 'name']
    ordering = ['rank']
    pagination_class = CustomPagination

    def filter_queryset(self, queryset):
        """
        Custom filtering and ordering logic for the institution list.
        Delegates sorting logic to the utility function.
        """
        return filter_and_sort_institutions(queryset)
    
    @swagger_auto_schema(
        operation_summary="List institutions",
        operation_description="Retrieve a list of institutions with search, filtering, sorting, and pagination capabilities.",
        manual_parameters=filter_parameters(),
        responses={
            400: openapi.Response(
                description="Bad request (invalid query parameters)",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Invalid query parameters")
                    }
                )
            )
        },
        security=[]
        )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# GET /institutions/<id>/
class InstitutionDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]  # Unprotected route
    queryset = Institution.objects.all()
    serializer_class = InstitutionDetailSerializer
    lookup_field = 'id'

    @swagger_auto_schema(
        operation_summary="Retrieve institution details",
        operation_description="Get detailed information about a single institution including classification and academic metrics.",
        responses={
            404: openapi.Response(
                description="Institution not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Not found.")
                    }
                )
            )
        },
        security=[]
        )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
