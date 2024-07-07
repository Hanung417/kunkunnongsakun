
from django.db import models
class Chatbot(models.Model):
    question_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    session_id = models.CharField(max_length=36, default=None, null=True, blank=True)
    question_content = models.TextField()
    answer_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
#Vector DB문서 내용
class Database(models.Model):
    question = models.TextField('question')
    answer = models.TextField('answer')
    