from django.db import models

# Create your models here.
class crop_data(models.Model):
    user_id = models.IntegerField()
    session_id = models.CharField(max_length=255, default=None, null=True, blank=True)
    crop_name = models.CharField(max_length=255, default=None, null=True, blank=True)
    address = models.CharField(max_length=255, default=None, null=True, blank=True)
    detailed_address = models.CharField(max_length=255, default=None, null=True, blank=True)