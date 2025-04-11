from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from api.models.event_models import Event
from api.serializers.event_serializers import EventSerializer
from django.shortcuts import get_object_or_404


class EventListAPIView(ListAPIView):
    """
    List All Events

    **GET /api/events/**

    Retrieve a list of all calendar events created by the authenticated user.  
    Typically used for academic or application-related reminders such as deadlines, interviews, and scholarship dates.

    ### Example Response:
    ```json
    {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
            {
                "id": 1,
                "application": 5,
                "event_title": "University of Ibadan Screening",
                "event_color": "primary",
                "event_date": "2025-05-10",
                "notes": "Go with JAMB result and birth certificate.",
                "created_at": "2025-04-08T13:00:00Z",
                "updated_at": "2025-04-08T13:00:00Z"
            },
            {
                "id": 2,
                "application": 7,
                "event_title": "Scholarship Form Closing Date",
                "event_color": "danger",
                "event_date": "2025-06-01",
                "notes": "Submit before midnight to avoid disqualification.",
                "created_at": "2025-04-09T10:30:00Z",
                "updated_at": "2025-04-09T10:30:00Z"
            }
        ]
    }
    ```
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)


class EventCreateAPIView(APIView):
    """
    Create New Event

    **POST /api/events/create/**

    Allows an authenticated user to create a new calendar event related to an application process.

    ### Example Request:
    ```json
    {
        "application": 7,
        "event_title": "ABSU Admission Exam",
        "event_color": "warning",
        "event_date": "2025-05-22",
        "notes": "Venue: School Auditorium. Bring two passport photos."
    }
    ```

    ### Example Response:
    ```json
    {
        "id": 3,
        "application": 7,
        "event_title": "ABSU Admission Exam",
        "event_color": "warning",
        "event_date": "2025-05-22",
        "notes": "Venue: School Auditorium. Bring two passport photos.",
        "created_at": "2025-04-10T11:15:00Z",
        "updated_at": "2025-04-10T11:15:00Z"
    }
    ```
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            event = serializer.save()
            return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventRetrievePatchAPIView(APIView):
    """
    Retrieve or Partially Update an Event
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Event, pk=pk, user=self.request.user)

    def get(self, request, pk):
        """
        Retrieve or Partially Update an Event

        **GET /api/events/<int:event_id>/**

        Fetch a specific event's full details.

        ### Example Response:
        ```json
        {
            "id": 2,
            "application": 7,
            "event_title": "Scholarship Form Closing Date",
            "event_color": "success",
            "event_date": "2025-06-01",
            "notes": "You passed the screening. Congrats!",
            "created_at": "2025-04-09T10:30:00Z",
            "updated_at": "2025-04-10T12:00:00Z"
        }
        ```
        """
        event = self.get_object(pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def patch(self, request, pk):
        """
        Retrieve or Partially Update an Event

        **PATCH /api/events/<int:event_id>/**

        Update selected fields of an event (e.g. change date or color) without affecting the rest.

        ### Example PATCH Request:
        ```json
        {
            "event_color": "success",
            "notes": "You passed the screening. Congrats!"
        }
        ```

        ### Example Response:
        ```json
        {
            "id": 2,
            "application": 7,
            "event_title": "Scholarship Form Closing Date",
            "event_color": "success",
            "event_date": "2025-06-01",
            "notes": "You passed the screening. Congrats!",
            "created_at": "2025-04-09T10:30:00Z",
            "updated_at": "2025-04-10T12:00:00Z"
        }
        ```
        """
        event = self.get_object(pk)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            event = serializer.save()
            return Response(EventSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventUpdateAPIView(APIView):
    """
    Fully Update an Event

    **PUT /api/events/<int:event_id>/update/**

    Overwrites all fields of a specific event.  
    The user must provide complete data in the request.

    ### Example Request:
    ```json
    {
        "application": 7,
        "event_title": "Scholarship Final List Announcement",
        "event_color": "success",
        "event_date": "2025-06-15",
        "notes": "Check official email for final decisions."
    }
    ```
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        event = get_object_or_404(Event, pk=pk, user=request.user)
        serializer = EventSerializer(event, data=request.data, context={'request': request})
        if serializer.is_valid():
            event = serializer.save()
            return Response(EventSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDeleteAPIView(APIView):
    """
    Delete an Event

    **DELETE /api/events/<int:event_id>/delete/**

    Permanently removes the event if it belongs to the authenticated user.

    ### Example Response:
    ```
    204 No Content
    ```
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk, user=request.user)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EventsByApplicationAPIView(APIView):
    """
    List Events by Application

    **GET /api/events/applications/<int:application_id>/**

    Retrieve all events linked to a specific application owned by the authenticated user.

    ### Example Response:
    ```json
    [
        {
            "id": 4,
            "application": 8,
            "event_title": "UNN Direct Entry Screening",
            "event_color": "primary",
            "event_date": "2025-06-05",
            "notes": "Bring direct entry form, transcript, and birth certificate.",
            "created_at": "2025-04-10T14:00:00Z",
            "updated_at": "2025-04-10T14:00:00Z"
        },
        {
            "id": 5,
            "application": 8,
            "event_title": "UNN Admission List Release",
            "event_color": "success",
            "event_date": "2025-07-01",
            "notes": "Log in to school portal to check status.",
            "created_at": "2025-04-11T08:30:00Z",
            "updated_at": "2025-04-11T08:30:00Z"
        }
    ]
    ```
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, application_id):
        events = Event.objects.filter(application__id=application_id, user=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
