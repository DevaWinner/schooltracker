import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# loading the .env file for variables
load_dotenv()

# .env variables
SUPABASE_URL = os.environ.get('Supabase_Project_URL') 
SUPABASE_API_KEY = os.environ.get('Supabase_API_KEY')
SUPABASE_BUCKET = os.environ.get('SUPABASE_BUCKET')

# Initialize Supabase new client/user
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

def supabase_signup(email, password):
    try:
        response = supabase.auth.sign_up( {
            "email":email,
            "password":password
        })
        response_data = {
            "status": "success",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at,
                "updated_at": response.user.updated_at,
            }
        }
        return response_data
    except Exception as e:
        return {"error ": str(e)}


def supabase_signin(email, password):
    session = None 
    try:
        session = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
        
        if hasattr(session, "user"):
            return {
                "status": "success",
                "user": {
                    "id": session.user.id,
                    "email": session.user.email,
                },
                "access_token": session.session.access_token,
                "refresh_token": session.session.refresh_token
            }
        else:
            return {"status": "error", "message": "Invalid response from Supabase"}
    except Exception as e:
        return {"error": str(e)}
    

def signin_with_google():
    try:
        response = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": 'http://localhost:8000/api/auth/google/callback/',
                "scopes": "openid profile email",  
                "skip_browser_redirect": True,
                "query_params": {
                    "prompt": "select_account",
                    "access_type": "offline",
                    "include_granted_scopes": "true"
                }
            }
        })
        
        if not response.url:
            print("Error: No URL returned from Supabase")
            return{"error": "Authentication service unavailable"}, 503
            
        print(f"Generated Google OAuth URL: {response.url}")
        return {"url": response.url}
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return {"error": str(e)}, 500


def upload_file(file, folder):
    """
    Uploads a file to Supabase Storage under the specified folder.

    Args:
        file: The file object (Byte File).
        folder: Folder name in the Supabase bucket (e.g., "profile_pictures", "documents").

    Returns:
        dict: A dictionary containing the status and URL or an error message.
    """
    if not folder:
        return {"status": "error", "message": "Folder name is required."}

    try:
        # Generate a unique filename
        ext = file.name.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{ext}"
        file_path = f"{folder}/{unique_filename}"

        # Read the file contents as bytes
        file.seek(0)
        file_content = file.read()

        # Upload file to Supabase Storage
        response = supabase.storage.from_(SUPABASE_BUCKET).upload(file_path, file_content)

        # Check if the response contains an error
        if hasattr(response, "error") and response.error:
            return {"status": "error", "message": response.error.message}

        # Generate the public URL for the uploaded file
        file_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{file_path}"

        return {"status": "success", "url": file_url}
    except Exception as e:
        return {"status": "error", "message": str(e)}