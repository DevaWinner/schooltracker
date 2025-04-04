import os
import django
import sys
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'schooltracker_backend.settings')
django.setup()

from django.conf import settings
from django.db import connection, transaction

def reset_migrations():
    """Delete all migration files except __init__.py"""
    migrations_dir = Path(__file__).resolve().parent / 'api' / 'migrations'
    print(f"Resetting migrations in {migrations_dir}...")
    
    # Delete all migration files except __init__.py
    for file in os.listdir(migrations_dir):
        file_path = os.path.join(migrations_dir, file)
        if os.path.isfile(file_path) and file != '__init__.py':
            os.unlink(file_path)
            print(f"Deleted: {file}")
    
    # Ensure __init__.py exists
    init_path = os.path.join(migrations_dir, '__init__.py')
    if not os.path.exists(init_path):
        with open(init_path, 'w') as f:
            pass
        print("Created __init__.py")

def complete_db_reset():
    """Complete database reset including migration history."""
    print("Performing complete database reset...")
    
    # Connect to the default database
    with connection.cursor() as cursor:
        # PostgreSQL specific commands
        cursor.execute("SELECT current_database();")
        db_name = cursor.fetchone()[0]
        print(f"Connected to database: {db_name}")
        
        # Get a list of all tables
        cursor.execute("""
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(tables)} tables: {', '.join(tables)}")
        
        # Disable foreign key checks temporarily (PostgreSQL)
        try:
            with transaction.atomic():
                # Drop all tables
                cursor.execute("SET session_replication_role = 'replica';")
                for table in tables:
                    print(f"Dropping table: {table}")
                    cursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')
                cursor.execute("SET session_replication_role = 'origin';")
                print("All tables dropped successfully.")
        except Exception as e:
            print(f"Error: {e}")
            cursor.execute("SET session_replication_role = 'origin';")
            return False
        
        # Delete any Django migrations records (in case the migrations table wasn't dropped)
        try:
            cursor.execute(f'DROP TABLE IF EXISTS "django_migrations" CASCADE;')
            print("Migration records cleared.")
        except Exception as e:
            print(f"Error clearing migration records: {e}")
    
    return True

def create_static_dir():
    """Create the static directory if it doesn't exist."""
    static_dir = Path(__file__).resolve().parent / 'static'
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
        print(f"Created static directory at {static_dir}")
    else:
        print(f"Static directory already exists at {static_dir}")

if __name__ == "__main__":
    print("This script will completely reset your database and migrations.")
    confirm = input("Are you sure you want to proceed? (yes/no): ")
    
    if confirm.lower() != "yes":
        print("Operation cancelled.")
        sys.exit(0)
    
    # Step 1: Reset the database
    if complete_db_reset():
        print("Database reset successful.")
    else:
        print("Database reset failed.")
        sys.exit(1)
    
    # Step 2: Reset migrations
    reset_migrations()
    print("Migrations reset successful.")
    
    # Step 3: Create static directory
    create_static_dir()
    
    print("\nComplete reset finished successfully.")
    print("\nNext steps:")
    print("1. Run: python manage.py makemigrations api")
    print("2. Run: python manage.py migrate")
    print("3. Run: python manage.py createsuperuser")
