from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from .forms import UserRegistrationForm
from django.contrib.auth import authenticate, login as auth_login
from django.conf import settings
import random
import json
import logging
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.http import require_http_methods, require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import User
from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

logger = logging.getLogger(__name__)

def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save()
                auth_login(request, user)  # Log the user in immediately after registration
                return JsonResponse({'status': 'success', 'message': 'User registered and logged in.'})
            else:
                return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'GET method not allowed'}, status=405)

@require_GET
def check_username(request):
    username = request.GET.get('username', None)
    if username is None:
        return JsonResponse({'error': 'Username parameter is missing'}, status=400)

    is_taken = User.objects.filter(username=username).exists()
    return JsonResponse({'is_taken': is_taken})

from django.views.decorators.csrf import ensure_csrf_cookie

@csrf_exempt
@require_POST
@ensure_csrf_cookie  # Ensure CSRF cookie is sent to the client
def login(request):
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body.decode('utf-8'))
            else:
                data = request.POST

            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'status': 'error', 'message': 'Email and password are required.'}, status=400)
            
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
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
                return JsonResponse({'status': 'error', 'message': 'Invalid email or password'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid email or password'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'An error occurred: {str(e)}'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@require_POST
def send_verification_email(request):
    try:
        data = json.loads(request.body)
        email = data['email']

        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'This email is already in use.'}, status=400)

        verification_code = random.randint(1000, 9999)  # Generate a random 4-digit number
        send_mail(
            'Your Verification Code',
            f'Your verification code is {verification_code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        request.session['verification_code'] = str(verification_code)  # Store code in session
        return JsonResponse({'message': 'Verification code sent!'})
    except KeyError:
        return JsonResponse({'message': 'Email is required.'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON.'}, status=400)
    except Exception as e:
        logger.error(f"Error sending verification email: {e}")
        return JsonResponse({'message': 'An error occurred while sending the verification code.'}, status=500)
@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'User logged out successfully'})

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def auth_check(request):
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username,
    })
