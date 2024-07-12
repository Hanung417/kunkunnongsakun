
from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

app_name = 'login'
# Update your urlpatterns to include this new view
urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('check_username/', views.check_username, name='check_username'),
    path('send_verification_email/', views.send_verification_email, name='send_verification_email'),
    path('password_reset/', views.password_reset_request, name='password_reset_request'),#password_reset
    path('password_reset_done/', views.password_reset, name='password_reset'),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),
    path('signup/', views.signup, name='signup'),
    path('auth_check/', views.auth_check, name='auth_check'),
    path('change_password/', views.change_password, name='change_password'),
    path('change_username/', views.change_username, name='change_username'),
    path('delete_account/', views.delete_account, name='delete_account'),
]
