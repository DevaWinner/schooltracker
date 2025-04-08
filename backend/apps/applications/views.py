from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from apps.schools.utils.custom_pagination import CustomPagination
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
    """
    API endpoint for listing and creating academic programs.
    Users must be authenticated to access this endpoint.
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @swagger_auto_schema(
        operation_summary="Retrieve a list of academic programs",
        operation_description="Retrieve a paginated list of academic programs with optional filters by program name and institution name.",
        manual_parameters=[
            openapi.Parameter('program', openapi.IN_QUERY, description="Filter programs by program name", type=openapi.TYPE_STRING),
            openapi.Parameter('school', openapi.IN_QUERY, description="Filter programs by institution name", type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description="Page number for pagination", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="Number of results per page", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(
                description="A list of academic programs",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "count": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "next": openapi.Schema(type=openapi.TYPE_STRING),
                        "previous": openapi.Schema(type=openapi.TYPE_STRING),
                        "results": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                "message": openapi.Schema(type=openapi.TYPE_STRING),
                                "data": openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "institution": openapi.Schema(
                                                type=openapi.TYPE_OBJECT,
                                                properties={
                                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                    "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                                }
                                            ),
                                            "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                            "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                            "department": openapi.Schema(type=openapi.TYPE_STRING),
                                            "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_FLOAT),
                                            "application_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "program_info_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        }
                                    )
                                )
                            }
                        )
                    }
                )
            ),
            401: openapi.Response(
                description="Unauthorized request - user needs to be authenticated",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example='Unauthorized request - user needs to be authenticated'),
                    }
                )
            )
        },
        security=[]
    )
    def get(self, request):
        # Retrieve the query parameters for filtering
        program_name_filter = request.query_params.get('program', None)
        institution_name_filter = request.query_params.get('school', None)

        # Start with all programs
        programs = Program.objects.all()

        # Filter by program_name if provided
        if program_name_filter:
            programs = programs.filter(program_name__icontains=program_name_filter)

        # Filter by institution.name if provided
        if institution_name_filter:
            programs = programs.filter(institution__name__icontains=institution_name_filter)

        # Apply pagination
        paginator = CustomPagination()
        paginated_programs = paginator.paginate_queryset(programs, request)

        # Serialize the paginated queryset
        serializer = ProgramSerializer(paginated_programs, many=True)

        # Return the response with pagination data
        return paginator.get_paginated_response({
            "success": True,
            "message": "Programs retrieved successfully.",
            "data": serializer.data
        })

    @swagger_auto_schema(
        operation_summary="Add a new academic program",
        operation_description="Create a new academic program with required details including program name, degree type, and institution.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["institution_id", "program_name", "degree_type"],
            properties={
                "institution_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the institution offering the program. This is a required field."
                ),
                "program_name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the academic program. This is a required field.",
                    maxLength=150
                ),
                "degree_type": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=[
                        "BSc", "BA", "BEng", "LLB", "MBBS", "BEd",
                        "MSc", "MA", "MEng", "LLM", "MBA", "PhD",
                        "PGD", "HND", "OND", "Other"
                    ],
                    description="Type of degree awarded for the program. This is a required field."
                ),
                "department": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Academic department responsible for the program. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "duration_years": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Number of years required to complete the program. Optional field.",
                    nullable=True,
                    minimum=1
                ),
                "tuition_fee": openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    format=openapi.FORMAT_DECIMAL,
                    description="Tuition fee for the entire program. Optional field.",
                    nullable=True
                ),
                "application_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the application portal for the program. Optional field.",
                    nullable=True,
                    maxLength=255
                ),
                "scholarship_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to available scholarships for the program. Optional field.",
                    nullable=True,
                    maxLength=255
                ),
                "program_info_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL for more information about the program. Optional field.",
                    nullable=True,
                    maxLength=255
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="Program created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "count": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "next": openapi.Schema(type=openapi.TYPE_STRING),
                        "previous": openapi.Schema(type=openapi.TYPE_STRING),
                        "results": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                "message": openapi.Schema(type=openapi.TYPE_STRING),
                                "data": openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "institution": openapi.Schema(
                                                type=openapi.TYPE_OBJECT,
                                                properties={
                                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                    "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                                }
                                            ),
                                            "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                            "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                            "department": openapi.Schema(type=openapi.TYPE_STRING),
                                            "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_FLOAT),
                                            "application_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "program_info_link": openapi.Schema(type=openapi.TYPE_STRING),
                                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        }
                                    )
                                )
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Invalid program data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Invalid data entered"),
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = ProgramSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response_message(True, "Program added successfully.", serializer.data, status.HTTP_201_CREATED)
        return response_message(False, "Invalid program data.", serializer.errors, status.HTTP_400_BAD_REQUEST)


class ProgramDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(Program, pk=pk)

    @swagger_auto_schema(
        operation_summary="Retrieve a specific academic program",
        operation_description="Get detailed information about a specific academic program by its ID.",
        responses={
            200: openapi.Response(
                description="Program retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "data": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "institution": openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                                        "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                    }
                                ),
                                "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                "department": openapi.Schema(type=openapi.TYPE_STRING),
                                "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_FLOAT),
                                "application_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "program_info_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            }
                        )
                    }
                )
            ),
            404: openapi.Response(description="Program not found")
        },
        security=[]
    )
    def get(self, request, pk):
        program = self.get_object(pk)
        serializer = ProgramSerializer(program)
        return response_message(True, "Program retrieved successfully.", serializer.data)

    @swagger_auto_schema(
        operation_summary="Update a specific academic program",
        operation_description="Update fields of a specific academic program. Accepts partial updates.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "institution_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the institution offering the program. Optional field."
                ),
                "program_name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the academic program. Optional field.",
                    maxLength=150
                ),
                "degree_type": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=[
                        "BSc", "BA", "BEng", "LLB", "MBBS", "BEd",
                        "MSc", "MA", "MEng", "LLM", "MBA", "PhD",
                        "PGD", "HND", "OND", "Other"
                    ],
                    description="Type of degree awarded for the program. Optional field."
                ),
                "department": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Academic department responsible for the program. Optional field.",
                    nullable=True,
                    maxLength=100
                ),
                "duration_years": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Number of years required to complete the program. Optional field.",
                    nullable=True,
                    minimum=1
                ),
                "tuition_fee": openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    format=openapi.FORMAT_DECIMAL,
                    description="Tuition fee for the entire program. Optional field.",
                    nullable=True
                ),
                "application_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to the application portal for the program. Optional field.",
                    nullable=True,
                    maxLength=255
                ),
                "scholarship_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL to available scholarships for the program. Optional field.",
                    nullable=True,
                    maxLength=255
                ),
                "program_info_link": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_URI,
                    description="URL for more information about the program. Optional field.",
                    nullable=True,
                    maxLength=255
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Program updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "data": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "institution": openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                                        "country": openapi.Schema(type=openapi.TYPE_STRING),
                                        "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                    }
                                ),
                                "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                "department": openapi.Schema(type=openapi.TYPE_STRING),
                                "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_FLOAT),
                                "application_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "program_info_link": openapi.Schema(type=openapi.TYPE_STRING),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Failed to update program. Invalid data.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Failed to update program. Invalid data."),
                    }
                )
            ),
            404: openapi.Response(description="Program not found")
        }
    )
    def put(self, request, pk):
        program = self.get_object(pk)
        serializer = ProgramSerializer(program, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response_message(True, "Program updated successfully.", serializer.data)
        return response_message(False, "Failed to update program. Invalid data.", serializer.errors, status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a specific academic program",
        operation_description="Delete a specific academic program by its ID.",
        security=[{'Bearer': []}],
        responses={
            204: openapi.Response(
                description="Program deleted successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "data": openapi.Schema(type=openapi.TYPE_OBJECT)
                    }
                )
            ),
            404: openapi.Response(description="Program not found")
        }
    )
    def delete(self, request, pk):
        program = self.get_object(pk)
        program.delete()
        return response_message(True, "Program deleted successfully.", status_code=status.HTTP_204_NO_CONTENT)


# --- Application Views ---

class ApplicationListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List User Applications",
        operation_description="Retrieve all applications submitted by the authenticated user.",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="Applications retrieved successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Applications retrieved successfully."),
                        "data": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                    "first_name": openapi.Schema(type=openapi.TYPE_STRING, example="Jane"),
                                    "last_name": openapi.Schema(type=openapi.TYPE_STRING, example="Shawn"),
                                    "program": openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "institution": openapi.Schema(
                                                type=openapi.TYPE_OBJECT,
                                                properties={
                                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                    "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                                }
                                            ),
                                            "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                            "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                            "department": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                            "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_DECIMAL, nullable=True),
                                            "application_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "program_info_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        }
                                    ),
                                    "status": openapi.Schema(type=openapi.TYPE_STRING, description="Status of application (eg: Draft, In Progress, Submitted, Admitted, etc)"),
                                    "start_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description="Application start date", nullable=True),
                                    "submitted_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description="Application submission date", nullable=True),
                                    "interview_scheduled_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "decision_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "accepted_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "rejected_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "notes": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                    "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                    "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                }
                            )
                        )
                    }
                )
            ),
            401: openapi.Response(
                description="Unauthorized request - user needs to be authenticated",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example='Unauthorized request - user needs to be authenticated'),
                    }
                )
            )
        }
    )
    def get(self, request):
        applications = Application.objects.filter(user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return response_message(True, "Applications retrieved successfully.", serializer.data)

    @swagger_auto_schema(
        operation_summary="Create New Application",
        operation_description="Create a new user school application.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["program_id"],
            properties={
                "program_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the program the user is applying to. This is a required field."
                ),
                "status": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=["Draft", "In Progress", "Submitted", "Interview", "Accepted", "Rejected"],
                    default="Draft",
                    description="The current status of the application. Defaults to 'Draft'."
                ),
                "start_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Planned start date of the program. Format: YYYY-MM-DD. Optional."
                ),
                "submitted_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date when the application was submitted. Optional."
                ),
                "interview_scheduled_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Scheduled date for interview. Optional."
                ),
                "decision_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the decision was made on the application. Optional."
                ),
                "accepted_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the user was accepted into the program. Optional."
                ),
                "rejected_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the application was rejected. Optional."
                ),
                "notes": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    nullable=True,
                    description="Additional notes or remarks about the application. Optional."
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="Application created successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Application created successfully."),
                        "data": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "first_name": openapi.Schema(type=openapi.TYPE_STRING, example="Jane"),
                                "last_name": openapi.Schema(type=openapi.TYPE_STRING, example="Shawn"),
                                "program": openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "institution": openapi.Schema(
                                            type=openapi.TYPE_OBJECT,
                                            properties={
                                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                            }
                                        ),
                                        "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                        "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                        "department": openapi.Schema(type=openapi.TYPE_STRING),
                                        "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, nullable=True),
                                        "application_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "program_info_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                    }
                                ),
                                "status": openapi.Schema(type=openapi.TYPE_STRING, example="Draft"),
                                "start_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "submitted_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "interview_scheduled_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "decision_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "accepted_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "rejected_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "notes": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Invalid application data.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Invalid application data."),
                        "data": openapi.Schema(type=openapi.TYPE_OBJECT, description="Validation errors")
                    }
                )
            )
        }
    )
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

    
    @swagger_auto_schema(
        operation_summary="Retrieve a specific user application",
        operation_description="Get detailed information about a specific user application by its ID.",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="Application retrieved successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Applications retrieved successfully."),
                        "data": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                    "first_name": openapi.Schema(type=openapi.TYPE_STRING, example="Jane"),
                                    "last_name": openapi.Schema(type=openapi.TYPE_STRING, example="Shawn"),
                                    "program": openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                            "institution": openapi.Schema(
                                                type=openapi.TYPE_OBJECT,
                                                properties={
                                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                    "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                                }
                                            ),
                                            "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                            "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                            "department": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                            "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, format=openapi.FORMAT_DECIMAL, nullable=True),
                                            "application_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "program_info_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                            "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        }
                                    ),
                                    "status": openapi.Schema(type=openapi.TYPE_STRING, description="Status of application (eg: Draft, In Progress, Submitted, Admitted, etc)"),
                                    "start_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description="Application start date", nullable=True),
                                    "submitted_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description="Application submission date", nullable=True),
                                    "interview_scheduled_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "decision_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "accepted_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "rejected_date": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, nullable=True),
                                    "notes": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                    "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                    "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                }
                            )
                        )
                    }
                )
            ),
            404: openapi.Response(description="Application not found")
        }
    )
    def get(self, request, pk):
        try:
            application = self.get_object(pk, request.user)
            serializer = ApplicationSerializer(application)
            return response_message(True, "Application retrieved successfully.", serializer.data)
        except PermissionDenied as e:
            return response_message(False, str(e), status_code=status.HTTP_403_FORBIDDEN)

    @swagger_auto_schema(
        operation_summary="Update a specific user application",
        operation_description="Update fields of a specific user application. Accepts partial updates.",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "program_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the program the user is applying to. Optional field."
                ),
                "status": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=["Draft", "In Progress", "Submitted", "Interview", "Accepted", "Rejected"],
                    default="Draft",
                    description="The current status of the application. Defaults to 'Draft'."
                ),
                "start_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Planned start date of the program. Format: YYYY-MM-DD. Optional."
                ),
                "submitted_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date when the application was submitted. Optional."
                ),
                "interview_scheduled_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Scheduled date for interview. Optional."
                ),
                "decision_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the decision was made on the application. Optional."
                ),
                "accepted_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the user was accepted into the program. Optional."
                ),
                "rejected_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    nullable=True,
                    description="Date the application was rejected. Optional."
                ),
                "notes": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    nullable=True,
                    description="Additional notes or remarks about the application. Optional."
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="Application updated successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Application updated successfully."),
                        "data": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "first_name": openapi.Schema(type=openapi.TYPE_STRING, example="Jane"),
                                "last_name": openapi.Schema(type=openapi.TYPE_STRING, example="Shawn"),
                                "program": openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "institution": openapi.Schema(
                                            type=openapi.TYPE_OBJECT,
                                            properties={
                                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                                "rank": openapi.Schema(type=openapi.TYPE_STRING),
                                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                                "country": openapi.Schema(type=openapi.TYPE_STRING),
                                                "overall_score": openapi.Schema(type=openapi.TYPE_STRING),
                                            }
                                        ),
                                        "program_name": openapi.Schema(type=openapi.TYPE_STRING),
                                        "degree_type": openapi.Schema(type=openapi.TYPE_STRING),
                                        "department": openapi.Schema(type=openapi.TYPE_STRING),
                                        "duration_years": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "tuition_fee": openapi.Schema(type=openapi.TYPE_NUMBER, nullable=True),
                                        "application_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "scholarship_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "program_info_link": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                        "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                    }
                                ),
                                "status": openapi.Schema(type=openapi.TYPE_STRING, example="Draft"),
                                "start_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "submitted_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "interview_scheduled_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "decision_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "accepted_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "rejected_date": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "notes": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                "updated_at": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Failed to update application. Invalid data.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Failed to update application. Invalid data."),
                    }
                )
            ),
            404: openapi.Response(description="Application not found")
        }
    )
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

    @swagger_auto_schema(
        operation_summary="Delete a specific user application",
        operation_description="Delete a specific user application by its ID.",
        security=[{'Bearer': []}],
        responses={
            204: openapi.Response(
                description="Application deleted successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "success": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Application deleted successfully"),
                        "data": openapi.Schema(type=openapi.TYPE_OBJECT)
                    }
                )
            ),
            404: openapi.Response(description="Application not found")
        }
    )
    def delete(self, request, pk):
        try:
            application = self.get_object(pk, request.user)
            application.delete()
            return response_message(True, "Application deleted successfully.", status_code=status.HTTP_204_NO_CONTENT)
        except PermissionDenied as e:
            return response_message(False, str(e), status_code=status.HTTP_403_FORBIDDEN)
