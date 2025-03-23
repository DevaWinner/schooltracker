from dotenv import load_dotenv
import os
from supabase import create_client, Client

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
        return response
    except Exception as e:
        return {"error ": e }


def supabase_signin(email, password):
    session = None 
    try:
        session = supabase.auth.sign_in_with_password
        ({
                "email": email,
                "password": password
            })
        return session
    except Exception as e :
        return {"error ": e }
    
