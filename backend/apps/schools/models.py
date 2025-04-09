from django.db import models


class School(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Institution(models.Model):
    rank = models.CharField(max_length=10)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    overall_score = models.CharField(max_length=10)
    web_links = models.URLField()

    def __str__(self):
        return f"{self.name} ({self.country})"


class Classification(models.Model):
    SIZE_CHOICES = [
        ('Extra Large', 'Extra Large'),
        ('Large', 'Large'),
        ('Medium', 'Medium'),
        ('Small', 'Small'),
    ]

    FOCUS_CHOICES = [
        ('Full Comprehensive', 'Full Comprehensive'),
        ('Comprehensive', 'Comprehensive'),
        ('Focused', 'Focused'),
        ('Specialist', 'Specialist'),
    ]

    RESEARCH_CHOICES = [
        ('Very High', 'Very High'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='classification')
    size = models.CharField(max_length=20, choices=SIZE_CHOICES)
    focus = models.CharField(max_length=30, choices=FOCUS_CHOICES)
    research = models.CharField(max_length=20, choices=RESEARCH_CHOICES)

    def __str__(self):
        return f"{self.institution.name} - {self.size}, {self.focus}, {self.research}"


class AcademicReputation(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='academic_reputation')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Academic Reputation: {self.score}"


class EmployerReputation(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='employer_reputation')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Employer Reputation: {self.score}"


class FacultyStudent(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='faculty_student')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Faculty/Student: {self.score}"


class CitationsPerFaculty(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='citations_per_faculty')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Citations/Faculty: {self.score}"


class InternationalFaculty(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='international_faculty')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Intl. Faculty: {self.score}"


class InternationalStudents(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='international_students')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Intl. Students: {self.score}"


class InternationalResearchNetwork(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='international_research_network')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Intl. Research Network: {self.score}"


class EmploymentOutcomes(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='employment_outcomes')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Employment Outcomes: {self.score}"


class Sustainability(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='sustainability')
    score = models.CharField(max_length=10)
    rank = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.institution.name} - Sustainability: {self.score}"
