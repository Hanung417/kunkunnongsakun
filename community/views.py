from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Post, Comment
from .forms import PostForm, CommentForm
import logging
import json
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)

def post_list(request):
    posts = Post.objects.all().values('id', 'title', 'content', 'user_id', 'creation_date')
    return JsonResponse(list(posts), safe=False)

def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    comments = list(post.comments.all().values('id', 'content', 'user_id', 'created_at'))
    post_data = {
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'user_id': post.user_id,
        'creation_date': post.creation_date,
        'comments': comments
    }
    return JsonResponse(post_data)

@login_required
def post_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = PostForm(data)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return JsonResponse({'id': post.pk, 'status': 'success'}, status=201)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)

@login_required
def post_edit(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.method == 'POST':
        data = json.loads(request.body)
        form = PostForm(data, instance=post)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'}, status=200)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)

@login_required
def post_delete(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.method == 'POST':
        post.delete()
        return JsonResponse({'status': 'success'}, status=204)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)

@csrf_exempt
@login_required
def comment_create(request, post_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = CommentForm(data)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.post = get_object_or_404(Post, pk=post_id)
            comment.save()
            return JsonResponse({
                'id': comment.id,
                'content': comment.content,
                'user_id': comment.user.id,
                'created_at': comment.created_at
            }, status=201)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)

@login_required
def comment_edit(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
    if request.method == 'POST':
        data = json.loads(request.body)
        form = CommentForm(data, instance=comment)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'id': comment.id,
                'content': comment.content,
                'user_id': comment.user.id,
                'created_at': comment.created_at
            }, status=200)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)

@login_required
def comment_delete(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
    if request.method == 'POST':
        comment.delete()
        return JsonResponse({'status': 'success'}, status=204)
    return JsonResponse({'error': 'GET method not allowed'}, status=405)
