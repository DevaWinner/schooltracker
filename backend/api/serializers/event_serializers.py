from rest_framework import serializers
from api.models.event_models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.

    Handles creation, updating, retrieval, and deletion of events. Ensures that
    created_at, updated_at, and user fields are read-only. Automatically links
    the event to the requesting user during creation.
    """

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)