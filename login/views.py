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
from aivle_big.decorators import login_required
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
            # 이메일 인증번호 확인
            submitted_verification_code = data.get('verification_code')
            session_verification_code = request.session.get('verification_code')

            if submitted_verification_code != session_verification_code:
                return JsonResponse({'status': 'error', 'message': 'Invalid verification code.'}, status=400)

            if form.is_valid():
                user = form.save()
                auth_login(request, user)
                # 성공적으로 회원가입 후 세션에서 인증번호 제거
                #del request.session['verification_code']
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

            # Check if a user with this email exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise UnauthorizedError("존재하지 않는 이메일입니다.")

            # Now authenticate the user with the password
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
                raise UnauthorizedError("비밀번호가 일치하지 않습니다.")

        except json.JSONDecodeError:
            raise ValidationError("Invalid JSON format")
        except UnauthorizedError as e:
            logger.error(f"Authentication error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=403)
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
            raise DuplicateResourceError("이미 사용중인 이메일입니다.")
        verification_code = random.randint(1000, 9999)
        html_message = f'''
        <html>
        <body>
            <p style="font-size: 18px;">Your verification code is:</p>
            <p style="font-size: 24px; font-weight: bold;">{verification_code}</p>
        </body>
        </html>
        '''
        send_mail(
            'Your Verification Code',
            '',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
            html_message=html_message,
        )
        request.session['verification_code'] = str(verification_code)
        return JsonResponse({'message': '이메일로 인증번호가 발송되었습니다.'})
    except KeyError:
        raise ValidationError("Email field is required")
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")
    except DuplicateResourceError as e:
        return JsonResponse({'message': str(e)}, status=409)
    except Exception as e:
        logger.error(f"Error sending verification email: {str(e)}")
        raise InternalServerError("Failed to send verification email")

# @csrf_exempt
# def logout_view(request):
#     logout(request)
#     return JsonResponse({'status': 'success', 'message': 'User logged out successfully'})

@csrf_exempt
def logout_view(request):
    try:
        if request.method == 'POST':
            logout(request)
            return JsonResponse({'status': 'success', 'message': 'User logged out successfully'})
        else:
            raise InvalidRequestError("Method not allowed")
    except InvalidRequestError as e:
        return JsonResponse({
            'status': 'error',
            'message': e.message,
            'code': e.error_code,
            'status_code': e.status_code
        }, status=e.status_code)
    except UnauthorizedError as e:
        return JsonResponse({
            'status': 'error',
            'message': e.message,
            'code': e.error_code,
            'status_code': e.status_code
        }, status=e.status_code)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': "Unexpected error occurred",
            'code': 2000,
            'status_code': 500
        }, status=500)
        

def auth_check(request):
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username,
    })

@csrf_exempt
@login_required
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            old_password = data.get('old_password')
            new_password1 = data.get('new_password1')
            new_password2 = data.get('new_password2')

            # Check if the old password is correct
            if not request.user.check_password(old_password):
                return JsonResponse({'status': 'error', 'message': "현재 비밀번호가 일치하지 않습니다."}, status=400)

            if new_password1 == old_password:
                return JsonResponse({'status': 'error', 'message': "새 비밀번호는 기존 비밀번호와 달라야 합니다."}, status=400)
            
            if new_password1 != new_password2:
                return JsonResponse({'status': 'error', 'message': "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."}, status=400)
            
            form = PasswordChangeForm(user=request.user, data=data)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)
                logout(request)
                return JsonResponse({'status': 'success', 'message': 'Password changed successfully'})
            else:
                return JsonResponse({'status': 'error', 'message': "Form validation failed", 'details': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': "Invalid JSON format"}, status=400)
        except ValidationError as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            return JsonResponse({'status': 'error', 'message': "Failed to change password"}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': "POST method only allowed"}, status=405)

@csrf_exempt
@login_required
def delete_account(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            password = data.get('password')

            if not password:
                return JsonResponse({'status': 'error', 'message': '비밀번호를 입력해주세요.'}, status=400)

            user = request.user

            if not user.check_password(password):
                return JsonResponse({'status': 'error', 'message': '비밀번호가 일치하지 않습니다.'}, status=400)

            user.delete()
            return JsonResponse({'status': 'success', 'message': 'Account deleted successfully'})
        except Exception as e:
            logger.error(f"Error deleting account: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Failed to delete account'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

    
# username 변경 API
@csrf_exempt
@login_required
def change_username(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_username = data.get('new_username')
            if not new_username:
                return JsonResponse({'status': 'error', 'message': 'New username is required', 'code': 1000, 'status_code': 400}, status=400)

            user = request.user
            if User.objects.filter(username=new_username).exists():
                return JsonResponse({'status': 'error', 'message': '이미 사용중인 이름입니다.', 'code': 2000, 'status_code': 400}, status=400)

            user.username = new_username
            user.save()
            return JsonResponse({'status': 'success', 'message': 'Username changed successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format', 'code': 1001, 'status_code': 400}, status=400)
        except Exception as e:
            logger.error(f"Error changing username: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Failed to change username', 'code': 2001, 'status_code': 500}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'POST method only allowed', 'code': 1002, 'status_code': 405}, status=405)

# 비밀번호 재설정 API
@csrf_exempt
def password_reset_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                raise ValueError('이메일 주소가 필요합니다.')

            # 여기서 비밀번호 재설정 메일 전송 로직을 추가합니다.
            user = User.objects.filter(email=email).first()
            if user is not None:
                # 임시 비밀번호 생성
                temporary_password = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', k=10))
                user.set_password(temporary_password)
                user.save()

                # 이메일 전송
                send_mail(
                    '비밀번호 재설정',
                    f'임시 비밀번호는 {temporary_password} 입니다.',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                return JsonResponse({'message': '이메일로 임시 비밀번호가 전송되었습니다.'})
            else:
                raise ValueError('해당 이메일 주소로 등록된 사용자가 없습니다.')

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    else:
        return JsonResponse({'error': 'POST 요청만 지원됩니다.'}, status=405)
    
@csrf_exempt
def password_reset(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            temporary_password = data.get('temporary_password')
            new_password = data.get('new_password')

            if not email or not temporary_password or not new_password:
                raise ValueError('이메일, 임시 비밀번호, 새로운 비밀번호가 필요합니다.')

            user = User.objects.filter(email=email).first()
            if user is not None and user.check_password(temporary_password):
                user.set_password(new_password)
                user.save()
                return JsonResponse({'message': '새로운 비밀번호로 변경되었습니다.'})
            else:
                raise ValueError('잘못된 이메일 또는 임시 비밀번호입니다.')

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    else:
        return JsonResponse({'error': 'POST 요청만 지원됩니다.'}, status=405)
    
