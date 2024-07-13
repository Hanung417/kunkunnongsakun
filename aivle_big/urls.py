from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
    path('prediction/', include('prediction.urls')), # predict 병합
    path('detect/', include('detect.urls')),
    path('soil/', include('soil.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
