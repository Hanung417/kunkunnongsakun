from django.db import models
from django.conf import settings
from django.utils import timezone

class PredictionSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=36, default=None, null=True, blank=True)
    session_name = models.CharField(max_length=255, default=None, null=True, blank=True)
    crop_names = models.CharField(max_length=100, default='default_crop')
    land_area = models.FloatField(default=1.0)
    region = models.CharField(max_length=100, default='default_region')
    total_income = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f'{self.session_name} ({self.created_at}) - {self.user.username}'

class PredictionResult(models.Model):
    session = models.ForeignKey(PredictionSession, related_name='results', on_delete=models.CASCADE)
    crop_name = models.CharField(max_length=100)
    predicted_income = models.FloatField(default=0.0)
    adjusted_data = models.JSONField(default=dict)
    price = models.FloatField(default=0.0)
    latest_year = models.IntegerField(default=timezone.now().year)
    r2_score = models.FloatField(default=0.0)
    rmse = models.FloatField(default=0.0)

    def __str__(self):
        return f'{self.crop_name} - {self.session.session_name}'
