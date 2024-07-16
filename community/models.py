# community/models.py
from django.db import models
from django.conf import settings
from aivle_big.storage_backends import PostBoardStorage

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    post_type = models.CharField(max_length=10)
    image = models.ImageField(
        upload_to='post/', 
        storage=PostBoardStorage(),  # Using custom storage backend
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'post'

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE) #대댓글 기능 추가

    class Meta:
        db_table = 'comment'

    def __str__(self):
        return self.content[:20]