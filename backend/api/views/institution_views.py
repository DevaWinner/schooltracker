from rest_framework import status, filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from api.models import Institution
from api.serializers import InstitutionListSerializer, InstitutionDetailSerializer

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
    | page | number | Page number for pagination |
    | page_size | number | Number of results per page |
    
    ## Response
    
    ```json
    {
        "count": 1000,
        "next": "http://example.com/api/institutions/?page=2",
        "previous": null,
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
    queryset = Institution.objects.all()
    serializer_class = InstitutionListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'country': ['exact'],
        'rank': ['exact', 'lt', 'gt', 'lte', 'gte'],
    }
    search_fields = ['name', 'country']
    ordering_fields = ['rank', 'name', 'country', 'overall_score']
    ordering = ['rank']
    pagination_class = PageNumberPagination
    
    def get_queryset(self):
        queryset = Institution.objects.all()
        
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
