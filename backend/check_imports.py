import os
import re
from pathlib import Path

def check_imports():
    """
    Scan the codebase for any imports from old module paths that need to be updated.
    """
    base_dir = Path(__file__).resolve().parent
    problematic_imports = [
        r'from\s+api\.models\s+import',
        r'from\s+api\.views\s+import',
        r'from\s+api\.serializers\s+import',
        r'import\s+api\.models',
        r'import\s+api\.views',
        r'import\s+api\.serializers',
    ]
    
    ignore_files = [
        'api/models.py',
        'api/views.py',
        'api/serializers.py',
        'check_imports.py'
    ]
    
    problematic_files = []
    
    # Walk through all Python files in the project
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.py'):
                rel_path = os.path.relpath(os.path.join(root, file), base_dir)
                if rel_path in ignore_files:
                    continue
                    
                try:
                    # Try to read with UTF-8 encoding first (most common)
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    try:
                        # Fall back to Latin-1 which can read any byte sequence
                        with open(os.path.join(root, file), 'r', encoding='latin-1') as f:
                            content = f.read()
                    except Exception as e:
                        print(f"Warning: Could not read file {rel_path}: {e}")
                        continue
                
                for pattern in problematic_imports:
                    matches = re.search(pattern, content)
                    if matches:
                        problematic_files.append((rel_path, matches.group(0)))
    
    if problematic_files:
        print("Found problematic imports that need to be updated to use the new modular structure:")
        for file_path, import_stmt in problematic_files:
            print(f"  • {file_path}: {import_stmt}")
        
        print("\nUpdate guide:")
        print("  - Replace 'from api.models import X' with 'from api.models.user_models import X' or 'from api.models.institution_models import X'")
        print("  - Replace 'from api.views import X' with 'from api.views.auth_views import X', 'from api.views.user_views import X', or 'from api.views.institution_views import X'")
        print("  - Replace 'from api.serializers import X' with appropriate modular import")
        return False
    else:
        print("No problematic imports found. Your codebase is ready for full modularization!")
        return True

if __name__ == "__main__":
    check_imports()
