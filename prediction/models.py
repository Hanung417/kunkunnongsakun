from django.db import models
from django.conf import settings

class CropData(models.Model):
    crop_name = models.CharField(max_length=100)
    land_area = models.FloatField()
    ratio = models.FloatField()
    income = models.FloatField()
    latest_year = models.IntegerField()

    def __str__(self):
        return self.crop_name

class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    land_area = models.FloatField()
    region = models.CharField(max_length=100)
    total_income = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Prediction by {self.user} on {self.timestamp}'

class CropResult(models.Model):
    prediction = models.ForeignKey(Prediction, related_name='crop_results', on_delete=models.CASCADE)
    crop_name = models.CharField(max_length=100)
    latest_year = models.IntegerField()
    adjusted_data = models.JSONField()
    price = models.IntegerField()

    def __str__(self):
        return f'Result for {self.crop_name}'
