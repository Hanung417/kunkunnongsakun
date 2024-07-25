from django.db import models
from django.conf import settings


class Chatbot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    question_id = models.AutoField(primary_key=True)
    session_id = models.CharField(max_length=36, default=None, null=True, blank=True)
    session_name = models.CharField(max_length=255, default=None, null=True, blank=True)
    question_content = models.TextField()
    answer_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
class Database(models.Model):
    question = models.TextField('question')
    answer = models.TextField('answer')
    