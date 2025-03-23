from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .auth import supabase_signup, supabase_signin

# Testing the 'users' app
# def register_user(request):
#     return JsonResponse({"message": "User registration endpoint is working!"})

#function to register users
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            response = supabase_signup(email, password)
            print("Supabase response:", response)  # Debug: Print the response from supabase_signup

            return JsonResponse(response)
        except json.JSONDecodeError as e:
            print("JSON decode error:", e)  # Debug: Print JSON decode errors
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            print("Internal error:", e)  # Debug: Print unexpected errors
            return JsonResponse({"error": e}, status=500)

    return JsonResponse({"error": "Invalid request method"}, safe=False, status=405)

@csrf_exempt
def signin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            result = supabase_signin(email, password)

            print("Supabase response:" , result)

            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({"error ", e}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)

