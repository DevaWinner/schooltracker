from django.http import JsonResponse

# Testing the 'schools' app
def schools(request):
    return JsonResponse({"message": "A dropdown containing a list of schools!"})
