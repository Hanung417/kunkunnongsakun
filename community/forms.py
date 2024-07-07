from django import forms
from .models import Post,Comment

class PostForm(forms.ModelForm):
    POST_TYPE_CHOICES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('exchange', 'Exchange')
    ]
    post_type = forms.ChoiceField(choices=POST_TYPE_CHOICES, required=True, widget=forms.Select)

    class Meta:
        model = Post
        fields = ['title', 'content', 'post_type']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']