from django.shortcuts import render, redirect
from .forms import UserRegistrationForm
from django.contrib.auth import authenticate, login as auth_login, logout, update_session_auth_hash
from django.conf import settings
import random
import json
import logging
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.http import require_http_methods, require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import get_user_model
from .models import User
from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, UnauthorizedError, InvalidRequestError, DuplicateResourceError
from django.db import DatabaseError, IntegrityError

logger = logging.getLogger(__name__)

@csrf_exempt
def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save()
                auth_login(request, user)
                return JsonResponse({'status': 'success', 'message': 'User registered and logged in.'})
            else:
                raise ValidationError("Form validation failed", details=form.errors)
        except json.JSONDecodeError:
            raise ValidationError("Invalid JSON format")
        except IntegrityError:
            raise DuplicateResourceError("A user with similar details already exists.")
        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            raise InternalServerError("An error occurred during user registration")
    else:
        raise InvalidRequestError("Only GET and POST methods are allowed")

@require_GET
def check_username(request):
    try:
        username = request.GET.get('username', None)
        if username is None:
            raise ValidationError("Username parameter is missing")
        is_taken = User.objects.filter(username=username).exists()
        return JsonResponse({'is_taken': is_taken})
    except DatabaseError as e:
        logger.error(f"Database error during username check: {str(e)}")
        raise InternalServerError("Failed to check if username is taken")

@csrf_exempt
@require_http_methods(["GET", "POST"])
@ensure_csrf_cookie
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                raise ValidationError("Email and password are required")

            user = authenticate(request, email=email, password=password)

            if user:
                auth_login(request, user)
                response = JsonResponse({
                    'status': 'success',
                    'message': 'User authenticated and logged in.',
                    'username': user.username,
                    'user_id': user.id,
                    'is_authenticated': user.is_authenticated
                })
                response.set_cookie('sessionid', request.session.session_key)
                return response
            else:
                raise UnauthorizedError("Invalid email or password")

        except json.JSONDecodeError:
            raise ValidationError("Invalid JSON format")
        except UnauthorizedError as e:
            logger.error(f"Authentication error: {str(e)}")
            raise UnauthorizedError("Invalid email or password")
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise InternalServerError("An error occurred during login")
    else:
        raise InvalidRequestError("Method not allowed")

@csrf_exempt
@require_POST
def send_verification_email(request):
    try:
        data = json.loads(request.body)
        email = data['email']
        if User.objects.filter(email=email).exists():
            raise DuplicateResourceError("This email is already in use")
        verification_code = random.randint(1000, 9999)
        send_mail(
            'Your Verification Code',
            f'Your verification code is {verification_code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        request.session['verification_code'] = str(verification_code)
        return JsonResponse({'message': 'Verification code sent!'})
    except KeyError:
        raise ValidationError("Email field is required")
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")
    except Exception as e:
        logger.error(f"Error sending verification email: {str(e)}")
        raise InternalServerError("Failed to send verification email")

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'User logged out successfully'})

@login_required
def auth_check(request):
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username,
    })

@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = PasswordChangeForm(user=request.user, data=data)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)
                return JsonResponse({'status': 'success', 'message': 'Password changed successfully'})
            else:
                raise ValidationError("Form validation failed", details=form.errors)
        except json.JSONDecodeError:
            raise ValidationError("Invalid JSON format")
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            raise InternalServerError("Failed to change password")
    else:
        raise InvalidRequestError("POST method only allowed")

@csrf_exempt
@login_required
def delete_account(request):
    if request.method == 'POST':
        try:
            user = request.user
            user.delete()
            return JsonResponse({'status': 'success', 'message': 'Account deleted successfully'})
        except Exception as e:
            logger.error(f"Error deleting account: {str(e)}")
            raise InternalServerError("Failed to delete account")
    else:
        raise InvalidRequestError("POST method only allowed")
