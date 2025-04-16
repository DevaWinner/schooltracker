import os
from pathlib import Path

# Ensure the static directory exists
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / 'static'

if not os.path.exists(static_dir):
    os.makedirs(static_dir)
    print(f"Created static directory at {static_dir}")
else:
    print(f"Static directory already exists at {static_dir}")
