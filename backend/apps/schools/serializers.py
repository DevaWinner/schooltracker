# apps/schools/serializers.py
from rest_framework import serializers
from django_filters.rest_framework import FilterSet, CharFilter, NumberFilter
from apps.schools.models import (
    Institution, Classification,
    AcademicReputation, EmployerReputation, FacultyStudent, CitationsPerFaculty,
    InternationalFaculty, InternationalStudents, InternationalResearchNetwork,
    EmploymentOutcomes, Sustainability
)
from .models import School

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


class ClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classification
        fields = ['id', 'size', 'focus', 'research']


# Reusable metric serializer (score + rank)
class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicReputation
        fields = ['id', 'score', 'rank']


# Minimal institution info for list view
class InstitutionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'rank', 'name', 'country', 'overall_score']


# Full institution details for single record
class InstitutionDetailSerializer(serializers.ModelSerializer):
    classification = ClassificationSerializer(read_only=True)

    # All related metric scores
    academic_reputation = serializers.SerializerMethodField()
    employer_reputation = serializers.SerializerMethodField()
    faculty_student = serializers.SerializerMethodField()
    citations_per_faculty = serializers.SerializerMethodField()
    international_faculty = serializers.SerializerMethodField()
    international_students = serializers.SerializerMethodField()
    international_research_network = serializers.SerializerMethodField()
    employment_outcomes = serializers.SerializerMethodField()
    sustainability = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = [
            'id', 'rank', 'name', 'country', 'overall_score', 'web_links',
            'classification', 'academic_reputation', 'employer_reputation',
            'faculty_student', 'citations_per_faculty', 'international_faculty',
            'international_students', 'international_research_network',
            'employment_outcomes', 'sustainability'
        ]

    # Helper to fetch each metric if it exists
    def get_metric(self, model, institution):
        try:
            return MetricSerializer(model.objects.get(institution=institution)).data
        except model.DoesNotExist:
            return None

    def get_academic_reputation(self, obj): return self.get_metric(AcademicReputation, obj)
    def get_employer_reputation(self, obj): return self.get_metric(EmployerReputation, obj)
    def get_faculty_student(self, obj): return self.get_metric(FacultyStudent, obj)
    def get_citations_per_faculty(self, obj): return self.get_metric(CitationsPerFaculty, obj)
    def get_international_faculty(self, obj): return self.get_metric(InternationalFaculty, obj)
    def get_international_students(self, obj): return self.get_metric(InternationalStudents, obj)
    def get_international_research_network(self, obj): return self.get_metric(InternationalResearchNetwork, obj)
    def get_employment_outcomes(self, obj): return self.get_metric(EmploymentOutcomes, obj)
    def get_sustainability(self, obj): return self.get_metric(Sustainability, obj)


# --- FILTERING ---
class InstitutionFilter(FilterSet):
    # Simple filters
    name = CharFilter(field_name='name', lookup_expr='icontains')
    country = CharFilter(field_name='country', lookup_expr='iexact')
    research = CharFilter(field_name='classification__research', lookup_expr='iexact')
    size = CharFilter(field_name='classification__size', lookup_expr='iexact')
    focus = CharFilter(field_name='classification__focus', lookup_expr='iexact')

    # Custom filters for numeric range of string-based ranks
    rank_gte = NumberFilter(method='filter_rank_gte')
    rank_lte = NumberFilter(method='filter_rank_lte')

    class Meta:
        model = Institution
        fields = []

    def extract_numeric_rank(self, rank_str):
        """Turn rank like '701+' or '500-565' into an integer (e.g., 701, 500)"""
        try:
            return int(''.join(filter(str.isdigit, rank_str.split('-')[0].split('+')[0])))
        except:
            return None

    def filter_rank_gte(self, queryset, name, value):
        return queryset.filter(
            id__in=[i.id for i in queryset if (r := self.extract_numeric_rank(i.rank)) is not None and r >= value]
        )

    def filter_rank_lte(self, queryset, name, value):
        return queryset.filter(
            id__in=[i.id for i in queryset if (r := self.extract_numeric_rank(i.rank)) is not None and r <= value]
        )
