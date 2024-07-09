from django.db import models
from django.conf import settings

class Pest(models.Model):
    pest_name = models.CharField(max_length=100)
    occurrence_environment = models.TextField(blank=True, null=True)
    symptom_description = models.TextField(blank=True, null=True)
    prevention_methods = models.TextField(blank=True, null=True)
    pesticide_name = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(max_length=200, blank=True, null=True)  # Ensure this field is here

    def __str__(self):
        return self.pest_name

class PestDetection(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pest_detections'
    )
    pest = models.ForeignKey('Pest', on_delete=models.CASCADE, related_name='detections')
    image = models.ImageField(upload_to='pest_detections/', blank=True, null=True)
    detection_date = models.DateTimeField(auto_now_add=True)
    confidence = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.pest.pest_name} detected by {self.user.username} on {self.detection_date.strftime('%Y-%m-%d %H:%M')} with {self.confidence}% confidence"
