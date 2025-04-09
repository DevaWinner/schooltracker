from rest_framework.pagination import PageNumberPagination

# Custom Pagination Class
class CustomPagination(PageNumberPagination):
    page_size = 10  # Default number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100  # Max limit