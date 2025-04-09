from drf_yasg import openapi

def filter_parameters():
    # Define the manual filter parameters
    filter_parameters = [
        openapi.Parameter(
            'search', openapi.IN_QUERY, type=openapi.TYPE_STRING,
            description="Search term for filtering institutions by name or other fields (case-insensitive)."
        ),
        openapi.Parameter(
            'country', openapi.IN_QUERY, type=openapi.TYPE_STRING,
            description="Filter institutions by country (exact match)."
        ),
        openapi.Parameter(
            'rank_gte', openapi.IN_QUERY, type=openapi.TYPE_INTEGER,
            description="Filter institutions with rank greater than or equal to the specified value."
        ),
        openapi.Parameter(
            'rank_lte', openapi.IN_QUERY, type=openapi.TYPE_INTEGER,
            description="Filter institutions with rank less than or equal to the specified value."
        ),
        openapi.Parameter(
            'ordering', openapi.IN_QUERY, type=openapi.TYPE_STRING,
            enum=['rank', 'name'],
            description="Specify the field by which to order the results. Options: 'rank', 'name'."
        ),
        openapi.Parameter(
            'page', openapi.IN_QUERY, type=openapi.TYPE_INTEGER,
            description="Page number for pagination."
        ),
        openapi.Parameter(
            'page_size', openapi.IN_QUERY, type=openapi.TYPE_INTEGER,
            description="Number of items per page (up to 100)."
        )
    ]
    
    return filter_parameters