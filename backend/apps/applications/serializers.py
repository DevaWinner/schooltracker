from datetime import date
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.schools.serializers import SchoolSerializer
from .models import Program, Application
from apps.schools.models import School

class ProgramSerializer(serializers.ModelSerializer):
    school = SchoolSerializer(read_only=True)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(),
        source='school',
        write_only=True,
    )
    
    class Meta:
        model = Program
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


class ApplicationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    program = ProgramSerializer(read_only=True)
    program_id = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(),
        source='program',
        write_only=True,
    )
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'first_name', 'last_name', 'program_name']

    def validate(self, data):
        # Get the instance if updating an existing application
        instance = self.instance

        # Check the submitted_date logic
        status = data.get('status', instance.status if instance else None)
        submitted_date = data.get('submitted_date', instance.submitted_date if instance else None)
        decision_date = data.get('decision_date', instance.decision_date if instance else None)

        # Ensure that submitted_date is only set if status is 'Submitted' or later
        if submitted_date and status not in ['Submitted', 'Interview', 'Accepted', 'Rejected']:
            raise ValidationError("submitted_date can only be set if the status is 'Submitted' or later.")

        # Ensure that decision_date is after the submitted_date
        if submitted_date and decision_date and decision_date <= submitted_date:
            raise ValidationError("decision_date must be after the submitted_date.")

        return data