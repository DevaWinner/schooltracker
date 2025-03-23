from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .auth import supabase_signup, supabase_signin

# Testing the 'users' app
def register_user(request):
    return JsonResponse({"message": "User registration endpoint is working!"})

#function to register users
""" def register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            result = supabase_signup(email, password)
            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({"error "+ e}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)
 """

""" def signin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            result = supabase_signin(email, password)
            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({"error "+ e}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)
 """
