import pandas as pd
from django.core.management.base import BaseCommand
from apps.schools.models import School
import os

class Command(BaseCommand):
    help = 'Seed the database with universities from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to the CSV file',
            required=True
        )

    def handle(self, *args, **options):
        file_path = options['file']
        
        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Seeding data from {file_path}..."))

        try:
            df = pd.read_csv(file_path)

            # Clean up web_pages
            def clean_url(val):
                try:
                    return val.strip("[]").replace("'", "").split(",")[0].strip()
                except:
                    return None

            df['cleaned_url'] = df['web_pages'].apply(clean_url)

            # Drop rows with missing critical data
            df = df.dropna(subset=['name', 'country', 'cleaned_url'])

            # Optional: sort alphabetically
            # df = df.sort_values(by='name')

            existing_names = set(School.objects.values_list('name', flat=True))
            new_entries = 0
            skipped = 0

            for _, row in df.iterrows():
                name = row['name']
                if name in existing_names:
                    skipped += 1
                    continue

                School.objects.create(
                    name=name,
                    country=row['country'],
                    state_province=row.get('state-province'),
                    website=row['cleaned_url']
                )
                new_entries += 1

            self.stdout.write(self.style.SUCCESS(
                f"Seeding complete: {new_entries} new schools added, {skipped} skipped (already exist)."
            ))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error occurred: {str(e)}"))
