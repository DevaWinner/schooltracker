import requests
import logging
import os
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from dotenv import load_dotenv
from supabase import create_client, Client
from django.contrib.auth import get_user_model

User = get_user_model()
# Set up logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.environ.get("Supabase_Project_URL")
SUPABASE_KEY = os.environ.get("Supabase_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class SupabaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return None  # No authentication credentials provided

        token = auth_header.split("Bearer ")[1]

        # Verify token with Supabase
        user_info = self.verify_token(token)

        if not user_info:
            logger.error("Supabase authentication failed: No user info returned.")
            raise AuthenticationFailed("Invalid or expired JWT token")

        logger.info(f"Supabase response: {user_info}")

        # Ensure 'sub' exists, checking multiple possible locations
        user_id = (
            user_info.get('sub') or
            user_info.get('user_metadata', {}).get('sub') or
            (user_info.get('identities', [{}])[0].get('identity_data', {}).get('sub'))
        )

        if not user_id:
            logger.error(f"Supabase response missing 'sub': {user_info}")
            raise AuthenticationFailed("Invalid Supabase response: Missing 'sub'")

        try:
            user = User.objects.get(supabase_uid=user_id)
            return (user, None)

        except User.DoesNotExist:
            logger.error(f"User with supabase_id {user_id} not found in database.")
            raise AuthenticationFailed("User not found in the database")
