from rest_framework import serializers
from api.models.event_models import Event
import datetime

class DateField(serializers.Field):
    """
    Custom field to ensure proper handling of date objects for event_date.
    Explicitly converts datetime to date to avoid timezone information loss.
    """
    def to_representation(self, value):
        if isinstance(value, datetime.datetime):
            return value.date().isoformat()
        if isinstance(value, datetime.date):
            return value.isoformat()
        return value

    def to_internal_value(self, data):
        try:
            return datetime.date.fromisoformat(data)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Invalid date format. Use YYYY-MM-DD.")

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.

    Handles creation, updating, retrieval, and deletion of events. Ensures that
    created_at, updated_at, and user fields are read-only. Automatically links
    the event to the requesting user during creation.
    """
    event_date = DateField()

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)