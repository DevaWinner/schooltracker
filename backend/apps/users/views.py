from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .auth import supabase_signup, supabase_signin,signin_with_google

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


# New supporting views
def google_login_view(request):
    """
    Uses your signin_with_google() function
    Returns JSON with auth URL or error
    """
    try:
        result = signin_with_google()
        # If result is a tuple (error case), unpack it
        if isinstance(result, tuple) and 'error' in result[0]:
            error_data, status_code = result
            return JsonResponse(error_data, status=status_code)
        # Successful case
        if 'url' in result:
            return JsonResponse({"auth_url": result['url']})
        # Fallback error if neither case matches
        return JsonResponse(
            {"error": "Unexpected response from authentication service"},
            status=500
        )
    except Exception as e:
        return JsonResponse(
            {"error": f"Internal server error: {str(e)}"},
            status=500
        )