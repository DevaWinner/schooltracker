import os
import pandas as pd
from django.db import transaction
from django.core.management.base import BaseCommand
from apps.schools.models import (
    Institution, Classification, AcademicReputation, EmployerReputation,
    FacultyStudent, CitationsPerFaculty, InternationalFaculty,
    InternationalStudents, InternationalResearchNetwork, EmploymentOutcomes, Sustainability
)

class Command(BaseCommand):
    help = "Import university data from CSV and populate the database"

    def add_arguments(self, parser):
        parser.add_argument('--path', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['path']

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"❌ File not found: {file_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"📥 Reading CSV file: {file_path}"))

        # Read with multi-index header and flatten columns
        df = pd.read_csv(file_path, header=[0, 1], encoding='latin1')
        df.columns = [' '.join(col).strip() for col in df.columns.values]

        # Print columns for debugging purposes
        self.stdout.write(f"📋 Columns in CSV file: {df.columns.tolist()}")

        total = len(df)
        self.stdout.write(self.style.NOTICE(f"📊 Total records to process: {total}"))

        for i, row in df.iterrows():
            name = row['Institution Name Unnamed: 2_level_1'].strip()  # Adjusted header name

            # Check if the institution already exists
            if Institution.objects.filter(name=name).exists():
                self.stdout.write(f"🔁 [{i+1}/{total}] Skipping existing institution: {name}")
                continue

            try:
                with transaction.atomic():  # Use transaction.atomic to ensure atomic operations
                    self.stdout.write(self.style.NOTICE(f"🚀 [{i+1}/{total}] Creating institution: {name}"))
                    rank = str(row['Rank Unnamed: 1_level_1']).strip()
                    overall_score = str(row['Overall Score Unnamed: 25_level_1']).strip()

                    # Create institution
                    institution = Institution.objects.create(
                        rank=rank,
                        name=name,
                        country=row['Country Unnamed: 3_level_1'],
                        overall_score=overall_score,
                        web_links=row['Web Links Unnamed: 26_level_1']
                    )
                    self.stdout.write("✅ Institution created.")

                    # Create Classification
                    Classification.objects.create(
                        institution=institution,
                        size=row['Classification SIZE'],
                        focus=row['Unnamed: 5_level_0 FOCUS'],
                        research=row['Unnamed: 6_level_0 RESEARCH INTENSITY']
                    )
                    self.stdout.write("🧩 Classification added.")

                    # Helper function to create metrics for different categories
                    def create_metric(model, label, score_field, rank_field):
                        score = str(row[score_field]).strip()
                        rank = str(row[rank_field]).strip()

                        if pd.isna(score) or pd.isna(rank):
                            self.stdout.write(f"❗ Skipping incomplete metric data for {label} - {institution.name}")
                            return

                        # Create the metric record
                        model.objects.create(
                            institution=institution,
                            score=score,
                            rank=rank
                        )
                        self.stdout.write(f"📈 {label} added.")

                    # Adding metrics for different categories
                    create_metric(AcademicReputation, "Academic Reputation", 'Academic Reputation SCORE', 'Unnamed: 8_level_0 RANK')
                    create_metric(EmployerReputation, "Employer Reputation", 'Employer Reputation SCORE', 'Unnamed: 10_level_0 RANK')
                    create_metric(FacultyStudent, "Faculty Student", 'Faculty Student SCORE', 'Unnamed: 12_level_0 RANK')
                    create_metric(CitationsPerFaculty, "Citations per Faculty", 'Citations per Faculty SCORE', 'Unnamed: 14_level_0 RANK')
                    create_metric(InternationalFaculty, "International Faculty", 'International Faculty SCORE', 'Unnamed: 16_level_0 RANK')
                    create_metric(InternationalStudents, "International Students", 'International Students SCORE', 'Unnamed: 18_level_0 RANK')
                    create_metric(InternationalResearchNetwork, "International Research Network", 'International Research Network SCORE', 'Unnamed: 20_level_0 RANK')
                    create_metric(EmploymentOutcomes, "Employment Outcomes", 'Employment Outcomes SCORE', 'Unnamed: 22_level_0 RANK')
                    create_metric(Sustainability, "Sustainability", 'Sustainability Score', 'Unnamed: 24_level_0 Rank')

                    self.stdout.write(self.style.SUCCESS(f"🎉 [{i+1}/{total}] {name} - All data saved.\n"))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"❗ Error processing {name}: {e}"))

        self.stdout.write(self.style.SUCCESS("✅ Import completed successfully!"))
