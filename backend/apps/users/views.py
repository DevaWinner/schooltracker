import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .supabase_config import supabase_signup, supabase_signin,signin_with_google,upload_users_documents
from supabase import AuthApiError

from .serializers import UserProfileSerializer
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

            # Check if Supabase returned an error
            if "error" in result:
                error_message = str(result["error"])
                
                if "Email not confirmed" in error_message:
                    return JsonResponse(
                        {"error": "Your email is not confirmed. Please check your inbox for the verification email."}, 
                        status=403
                    )
                return JsonResponse({"error": error_message}, status=400)
            return JsonResponse(result)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data received."}, status=400)
        except AuthApiError as e:
            return JsonResponse({"error": f"Authentication failed: {str(e)}"}, status=401)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=400)


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
    

class UserProfileView(APIView):
    """
    API endpoint to retrieve and update user profiles.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve authenticated user's profile, including User and UserProfile fields."""
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update the authenticated user's profile, including first_name and last_name."""
        user_profile = request.user.user_profile
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "profile": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# View for the users documents inserted into the documents table 
@csrf_exempt
def upload_users_documents(request):
    if request.method == 'POST' and request.FILES.get('document'):
        uploaded_file = request.FILES['document']
        
        result = upload_users_documents(
            file=uploaded_file,
            document_type=request.POST.get('document_type', 'unknown'),
            file_name=uploaded_file.name,
            folder=request.POST.get('folder', 'documents')
        )
        
        if result['status'] == 'success':
            return JsonResponse({
                'success': True,
                'document_id': result['document_id'],
                'file_url': result['file_url']
            })
        else:
            return JsonResponse({
                'success': False,
                'error': result['message']
            }, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)