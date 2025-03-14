from django.http import JsonResponse

# Testing the 'users' app
def register_user(request):
    return JsonResponse({"message": "User registration endpoint is working!"})
