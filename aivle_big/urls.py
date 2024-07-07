"""
URL configuration for aivle_big project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.contrib.auth import views as auth_views

def index(request):
    return render(request,'index.html')

urlpatterns = [
    path('', index),
    path("admin/", admin.site.urls),
    path('login/', include('login.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('community/', include('community.urls')),
    path('selfchatbot/', include('selfchatbot.urls', namespace='selfchatbot')),
]
