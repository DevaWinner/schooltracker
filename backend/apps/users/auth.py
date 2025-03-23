from dotenv import load_dotenv
import os
from supabase import create_client, Client
from supabase import AuthApiError

# loading the .env file for variables
load_dotenv()


# .env variables
SUPABASE_URL = os.environ.get('Supabase_Project_URL') 
SUPABASE_API_KEY =os.environ.get('Supabase_API_KEY')

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
        return {"error ": e}


def supabase_signin(email, password):
    session = None 
    try:
        session = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
        
        print("AuthResponse:", session)
        
        if hasattr(session, "user"):
            response_data = {
                "status": "success",
                "user": {
                    "id": session.user.id,
                    "email": session.user.email,
                }
            }
        else:
            # Handle cases where the response doesn't contain user
            response_data = {
                "status": "error",
                "message": "Invalid response from Supabase",
                "details": str(session)
            }

        return response_data
    except Exception as e :
        return {"error ": e }
    
