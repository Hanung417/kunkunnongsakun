from django.shortcuts import render, get_object_or_404, redirect
from aivle_big.decorators import login_required
from django.http import JsonResponse
from django.db import DatabaseError, IntegrityError
from django.db.models import Count
from .models import Post, Comment
from .forms import PostForm, CommentForm
from aivle_big.exceptions import ResourceAccessForbiddenError, ValidationError, NotFoundError, InternalServerError, InvalidRequestError, DuplicateResourceError
import logging
import json
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)

def post_list(request):
    try:
        post_type = request.GET.get('post_type')
        if post_type:
            posts = Post.objects.filter(post_type=post_type).annotate(comment_count=Count('comments')).values('id', 'title', 'content', 'user__username', 'creation_date', 'comment_count')
        else:
            posts = Post.objects.annotate(comment_count=Count('comments')).values('id', 'title', 'content', 'user__username', 'creation_date', 'comment_count')
        return JsonResponse(list(posts), safe=False)
    except DatabaseError as e:
        logger.error(f"Database error while fetching posts: {str(e)}")
        raise InternalServerError("Database error occurred while fetching posts.")

def post_detail(request, post_id):
    try:
        post = get_object_or_404(Post, pk=post_id)
        comments = list(post.comments.all().values(
            'id', 'content', 'user__username', 'user_id', 'created_at', 'parent_id'
        ))

        # Ensure the image URL is correctly handled
        if post.image and hasattr(post.image, 'url'):
            image_url = post.image.url
        else:
            image_url = None

        post_data = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'post_type': post.post_type,
            'user_id': post.user.username,
            'creation_date': post.creation_date,
            'image': image_url,
            'comments': comments,
        }
        return JsonResponse(post_data)
    except DatabaseError as e:
        logger.error(f"Database error on retrieving post details: {str(e)}")
        return JsonResponse({'error': 'Database error occurred while retrieving post details.'}, status=500)
    except Exception as e:
        logger.error(f"Unhandled exception on retrieving post details: {str(e)}")
        return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)



@csrf_exempt
@login_required
def post_create(request):
    if request.method != 'POST':
        raise InvalidRequestError("POST method only allowed")
    try:
        form = PostForm(request.POST, request.FILES)
        if not form.is_valid():
            raise ValidationError("Form validation failed", details=form.errors)
        post = form.save(commit=False)
        post.user = request.user
        post.post_type = request.POST.get('post_type')
        post.save()
        return JsonResponse({'id': post.pk, 'status': 'success'}, status=201)
    except IntegrityError as e:
        logger.error(f"Integrity error on creating post: {str(e)}")
        raise DuplicateResourceError("Duplicate post cannot be created.")
    except DatabaseError as e:
        logger.error(f"Database error on creating post: {str(e)}")
        raise InternalServerError("Database error occurred while creating post.")
    except Exception as e:
        logger.error(f"Unhandled exception in post creation: {str(e)}")
        raise InternalServerError("An unexpected error occurred while creating the post.")

@login_required
def post_edit(request, post_id):
    if request.method != 'POST':
        raise InvalidRequestError("POST method only allowed")
    try:
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)
        form = PostForm(data, instance=post)
        if not form.is_valid():
            raise ValidationError("Form validation failed", details=form.errors)
        form.save()
        return JsonResponse({'status': 'success'}, status=200)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")
    except Post.DoesNotExist:
        raise NotFoundError("Post not found")
    except IntegrityError as e:
        logger.error(f"Integrity error on editing post: {str(e)}")
        raise ValidationError("Duplicate data provided.")
    except Exception as e:
        logger.error(f"Error editing post: {str(e)}")
        raise InternalServerError("Failed to edit post")

@login_required
def post_delete(request, post_id):
    try:
        post = get_object_or_404(Post, pk=post_id)
        if request.method == 'POST':
            try:
                post.delete()
                return JsonResponse({'status': 'success'}, status=204)
            except Exception as e:
                logger.error(f"Error deleting post: {e}")
                raise InternalServerError("Error deleting post.")
        else:
            raise InvalidRequestError("GET method not allowed.")
    except Post.DoesNotExist:
        raise NotFoundError("Post not found.")
    except ResourceAccessForbiddenError as e:
        logger.error(f"Permission denied: {e}")
        raise ResourceAccessForbiddenError("Permission denied.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise InternalServerError("An unexpected error occurred.")

@csrf_exempt
@login_required
def comment_create(request, post_id):
    if request.method != 'POST':
        raise InvalidRequestError("POST method only allowed")
    try:
        data = json.loads(request.body)
        form = CommentForm(data)
        if not form.is_valid():
            raise ValidationError("Form validation failed", details=form.errors)
        comment = form.save(commit=False)
        comment.user = request.user
        comment.post = get_object_or_404(Post, pk=post_id)
        comment.parent_id = data.get('parent_id')
        comment.save()
        return JsonResponse({
            'id': comment.id,
            'content': comment.content,
            'user_id': comment.user.id,
            'user__username': comment.user.username,
            'created_at': comment.created_at,
            'parent_id': comment.parent_id
        }, status=201)
    except Post.DoesNotExist:
        raise NotFoundError("Post related to the comment not found")
    except IntegrityError as e:
        logger.error(f"Integrity error on creating comment: {str(e)}")
        raise DuplicateResourceError("Duplicate comment cannot be created.")
    except DatabaseError as e:
        logger.error(f"Database error on creating comment: {str(e)}")
        raise InternalServerError("Database error occurred while creating comment.")
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")
    except Exception as e:
        logger.error(f"Unhandled exception in comment creation: {str(e)}")
        raise InternalServerError("An unexpected error occurred while creating the comment")

@login_required
def comment_edit(request, comment_id):
    if request.method != 'POST':
        raise InvalidRequestError("POST method only allowed")
    try:
        comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
        data = json.loads(request.body)
        form = CommentForm(data, instance=comment)
        if not form.is_valid():
            raise ValidationError("Form validation failed", details=form.errors)
        form.save()
        return JsonResponse({
            'id': comment.id,
            'content': comment.content,
            'user_id': comment.user.id,
            'created_at': comment.created_at
        }, status=200)
    except Comment.DoesNotExist:
        raise NotFoundError("Comment not found")
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")
    except IntegrityError as e:
        logger.error(f"Integrity error on editing comment: {str(e)}")
        raise ValidationError("Duplicate data provided.")
    except Exception as e:
        logger.error(f"Error editing comment: {str(e)}")
        raise InternalServerError("Failed to edit comment")

@login_required
def comment_delete(request, comment_id):
    if request.method != 'POST':
        raise InvalidRequestError("POST method only allowed")
    try:
        comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
        comment.delete()
        return JsonResponse({'status': 'success'}, status=204)
    except Comment.DoesNotExist:
        raise NotFoundError("Comment not found")
    except Exception as e:
        logger.error(f"Error deleting comment: {str(e)}")
        raise InternalServerError("Failed to delete comment")

@csrf_exempt
@login_required
def my_post_list(request):
    try:
        posts = Post.objects.filter(user=request.user).values('id', 'title', 'content', 'user__username', 'creation_date')
        return JsonResponse(list(posts), safe=False)
    except DatabaseError as e:
        logger.error(f"Database error fetching user's posts: {str(e)}")
        raise InternalServerError("Database error occurred while fetching user's posts")

@csrf_exempt
@login_required
def my_commented_posts(request):
    try:
        comments = Comment.objects.filter(user=request.user).values('post').distinct()
        post_ids = [comment['post'] for comment in comments]
        posts = Post.objects.filter(id__in=post_ids).values('id', 'title', 'content', 'user__username', 'creation_date')
        return JsonResponse(list(posts), safe=False)
    except DatabaseError as e:
        logger.error(f"Database error fetching commented posts: {str(e)}")
        raise InternalServerError("Database error occurred while fetching posts commented by user")

