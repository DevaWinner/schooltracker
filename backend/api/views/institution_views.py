from rest_framework import status, filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from django.db.models import IntegerField, Value, F, Func, Expression
from django.db.models.functions import Cast, Substr, StrIndex, Replace, Length
from rest_framework.response import Response
from rest_framework.views import APIView
import re

from api.models.institution_models import Institution
from api.serializers.institution_serializers import InstitutionListSerializer, InstitutionDetailSerializer

class CustomPageNumberPagination(PageNumberPagination):
    """Custom pagination class that allows client to specify page size"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
    def get_paginated_response(self, data):
        """Add additional metadata to the paginated response"""
        response = super().get_paginated_response(data)
        response.data['page'] = self.request.query_params.get('page', 1)
        response.data['page_size'] = self.get_page_size(self.request)
        response.data['resultsLength'] = len(data)
        return response

class InstitutionListView(generics.ListAPIView):
    """
    List all institutions with pagination, search, and filters
    
    Get a list of educational institutions with various filtering and search options.
    
    ---
    ## Query Parameters
    
    | Parameter | Type | Description |
    | --------- | ---- | ----------- |
    | search | string | Search by institution name |
    | country | string | Filter by country |
    | rank_lte | number | Filter by rank less than or equal to value |
    | rank_gte | number | Filter by rank greater than or equal to value |
    | research | string | Filter by research level (from classification) |
    | size | string | Filter by institution size (from classification) |
    | focus | string | Filter by institution focus (from classification) |
    | page | number | Page number for pagination (default: 1) |
    | page_size | number | Number of results per page (default: 20, max: 1000) |
    
    ## Response
    
    ```json
    {
        "count": 1503,
        "next": "http://example.com/api/institutions/?page=2&page_size=20",
        "previous": null,
        "page": "1",
        "page_size": 20,
        "resultsLength": 20,
        "results": [
            {
                "id": "123",
                "rank": "1",
                "name": "Harvard University",
                "country": "United States",
                "overall_score": "95.8"
            },
            ...
        ]
    }
    ```
    """
    serializer_class = InstitutionListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'country': ['exact'],
    }
    search_fields = ['name', 'country']
    ordering_fields = ['numeric_rank', 'name', 'country', 'overall_score']
    ordering = ['numeric_rank']
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        """
        Get the queryset with proper filtering and numeric rank processing.
        Handle special rank formats like "621-630" by extracting the first number.
        """
        # Start with all institutions
        queryset = Institution.objects.all()
        
        # Extract first numeric part from rank (for ranges like "621-630")
        queryset = queryset.annotate(
            numeric_rank=self.extract_numeric_rank_annotation()
        )
        
        # Handle rank filtering numerically
        rank_gte = self.request.query_params.get('rank_gte')
        rank_lte = self.request.query_params.get('rank_lte')
        rank = self.request.query_params.get('rank')
        
        if rank_gte:
            try:
                rank_gte_int = int(rank_gte)
                queryset = queryset.filter(numeric_rank__gte=rank_gte_int)
            except (ValueError, TypeError):
                pass
                
        if rank_lte:
            try:
                rank_lte_int = int(rank_lte)
                queryset = queryset.filter(numeric_rank__lte=rank_lte_int)
            except (ValueError, TypeError):
                pass
                
        if rank:
            try:
                rank_int = int(rank)
                queryset = queryset.filter(numeric_rank=rank_int)
            except (ValueError, TypeError):
                pass
        
        # Advanced filtering for related models
        research = self.request.query_params.get('research')
        size = self.request.query_params.get('size')
        focus = self.request.query_params.get('focus')
        
        if research:
            queryset = queryset.filter(classification__research=research)
        
        if size:
            queryset = queryset.filter(classification__size=size)
        
        if focus:
            queryset = queryset.filter(classification__focus=focus)
            
        return queryset
    
    def extract_numeric_rank_annotation(self):
        """
        Creates a database annotation that safely extracts a numeric rank from various formats.
        Handles:
        - Pure integers: "1", "2", "3"
        - Ranges: "621-630", "801-1000"
        - Plus formats: "601+"
        - Other special cases
        
        We use a simpler approach by handling each case separately and then try to cast safely.
        """
        from django.db.models import Case, When, Value
        
        # We need a more robust implementation that can handle various rank formats
        return Case(
            # Regular integer ranks ("1", "2", "3")
            When(
                rank__regex=r'^[0-9]+$',
                then=Cast('rank', output_field=IntegerField())
            ),
            
            # For ranks with a dash ("621-630") - extract initial number
            When(
                rank__contains='-',
                then=Cast(
                    Func(F('rank'), Value('-'), Value(1), function='split_part'),
                    output_field=IntegerField()
                )
            ),
            
            # For ranks ending with + ("601+")
            When(
                rank__endswith='+',
                then=Cast(
                    Replace('rank', Value('+'), Value('')),
                    output_field=IntegerField()
                )
            ),
            
            # Default case - if all else fails, return a very high number to sort at the end
            default=Value(999999),
            output_field=IntegerField()
        )
    
    def filter_queryset(self, queryset):
        """Override to ensure proper handling of numeric rank ordering"""
        queryset = super().filter_queryset(queryset)
        
        # Get the ordering parameter
        ordering = self.request.query_params.get('ordering')
        
        # Map rank to numeric_rank for proper sorting
        if ordering == 'rank':
            return queryset.order_by('numeric_rank')
        elif ordering == '-rank':
            return queryset.order_by('-numeric_rank')
        
        return queryset

class InstitutionDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific institution by ID
    
    Get detailed information about a specific educational institution.
    
    ---
    ## Path Parameters
    
    | Parameter | Type | Description |
    | --------- | ---- | ----------- |
    | id | string | The unique identifier of the institution |
    
    ## Response
    
    ```json
    {
        "id": "123",
        "rank": "1",
        "name": "Harvard University",
        "country": "United States",
        "overall_score": "95.8",
        "web_links": "https://www.harvard.edu",
        "classification": {
            "id": "class_123",
            "size": "Large",
            "focus": "Full comprehensive",
            "research": "Very High"
        },
        "academic_reputation": {
            "id": "ar_123",
            "score": "100",
            "rank": "1"
        },
        ...
    }
    ```
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionDetailSerializer
    lookup_field = 'id'

class InstitutionCountriesView(APIView):
    """
    List All Available Countries
    
    **GET /api/institutions/countries/**
    
    Retrieve a list of all countries that have institutions in the database.
    Countries are returned in alphabetical order.
    
    ## Response Format
    ```json
    {
        "countries": [
            "Argentina",
            "Australia",
            "Austria",
            "Belgium",
            "Brazil",
            "Canada",
            "China",
            ...
        ]
    }
    ```
    """
    
    def get(self, request):
        # Get distinct countries from the database
        countries = Institution.objects.values_list('country', flat=True).distinct().order_by('country')
        
        # Filter out None/empty values
        countries = [country for country in countries if country]
        
        return Response({"countries": countries})
