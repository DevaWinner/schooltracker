from django.db import models

class Institution(models.Model):
    """Educational institution details"""
    id = models.CharField(primary_key=True, max_length=100)
    rank = models.CharField(max_length=50, null=True, blank=True)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    overall_score = models.CharField(max_length=50, null=True, blank=True)
    web_links = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.country})"
    
    class Meta:
        db_table = 'institutions'
        ordering = ['rank']

class Classification(models.Model):
    """Institution classification details"""
    SIZE_CHOICES = [
        ('Extra Large', 'Extra Large'),
        ('Large', 'Large'),
        ('Medium', 'Medium'),
        ('Small', 'Small'),
    ]
    
    FOCUS_CHOICES = [
        ('Full comprehensive', 'Full comprehensive'),
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
    
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='classification')
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, null=True, blank=True)
    focus = models.CharField(max_length=20, choices=FOCUS_CHOICES, null=True, blank=True)
    research = models.CharField(max_length=20, choices=RESEARCH_CHOICES, null=True, blank=True)
    
    def __str__(self):
        return f"Classification for {self.institution.name}"
    
    class Meta:
        db_table = 'classification'

class AcademicReputation(models.Model):
    """Institution academic reputation metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='academic_reputation')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Academic Reputation for {self.institution.name}"
    
    class Meta:
        db_table = 'academic_reputation'

class EmployerReputation(models.Model):
    """Institution employer reputation metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='employer_reputation')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Employer Reputation for {self.institution.name}"
    
    class Meta:
        db_table = 'employer_reputation'

class FacultyStudent(models.Model):
    """Institution faculty/student ratio metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='faculty_student')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Faculty/Student Ratio for {self.institution.name}"
    
    class Meta:
        db_table = 'faculty_student'

class CitationsPerFaculty(models.Model):
    """Institution citations per faculty metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='citations_per_faculty')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Citations per Faculty for {self.institution.name}"
    
    class Meta:
        db_table = 'citations_per_faculty'

class InternationalFaculty(models.Model):
    """Institution international faculty metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_faculty')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Faculty for {self.institution.name}"
    
    class Meta:
        db_table = 'international_faculty'

class InternationalStudents(models.Model):
    """Institution international students metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_students')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Students for {self.institution.name}"
    
    class Meta:
        db_table = 'international_students'

class InternationalResearchNetwork(models.Model):
    """Institution international research network metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='international_research_network')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"International Research Network for {self.institution.name}"
    
    class Meta:
        db_table = 'international_research_network'

class EmploymentOutcomes(models.Model):
    """Institution employment outcomes metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='employment_outcomes')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Employment Outcomes for {self.institution.name}"
    
    class Meta:
        db_table = 'employment_outcomes'

class Sustainability(models.Model):
    """Institution sustainability metrics"""
    id = models.CharField(primary_key=True, max_length=100)
    institution = models.OneToOneField(Institution, on_delete=models.CASCADE, related_name='sustainability')
    score = models.CharField(max_length=50, null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"Sustainability for {self.institution.name}"
    
    class Meta:
        db_table = 'sustainability'
