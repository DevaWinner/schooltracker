import json
from django.http import JsonResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model

from .supabase_auth import supabase_signup, supabase_signin,signin_with_google
from .models import UserProfile

User = get_user_model()

#function to register users
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            first_name = data.get("first_name")
            last_name = data.get("last_name")

            response = supabase_signup(email, password)

            if response.get("status") == "success" and "user" in response:
                user_data = response["user"]
                supabase_uid = user_data["id"]

                # Create or update user record in Django
                user, created = User.objects.update_or_create(
                    email=email,
                    defaults={
                        "username": email,
                        "supabase_uid": supabase_uid,
                        "first_name": first_name,
                        "last_name": last_name
                    }
                )

                if created:
                    user.set_password(password)
                    user.save()

                # Ensure UserProfile exists
                UserProfile.objects.get_or_create(user=user)

                # Return formatted response
                return JsonResponse(
                    {
                        "status": "User registered successfully",
                        "user": {
                            "id": user_data["id"],
                            "email": user_data["email"],
                            "created_at": user_data["created_at"],
                            "updated_at": user_data.get("updated_at", user_data["created_at"]),
                        },
                    },
                    status=201,  # HTTP 201 Created
                )
            else:
                return JsonResponse(
                    {"error": "Registration failed", "details": response},
                    status=400,  # HTTP 400 Bad Request
                )
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

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