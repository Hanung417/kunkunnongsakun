from django.db import models
from django.conf import settings

class Pest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    threat_level = models.CharField(max_length=50)
    prevention_methods = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PestDetection(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pest_detections'
    )
    pest = models.ForeignKey('Pest', on_delete=models.CASCADE, related_name='detections')
    image = models.ImageField(upload_to='pest_detections/')
    detection_date = models.DateTimeField(auto_now_add=True)
    confidence = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.pest.name} detected by {self.user.username} on {self.detection_date.strftime('%Y-%m-%d %H:%M')} with {self.confidence}% confidence"
