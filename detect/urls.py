from django.urls import path
from . import views

app_name = 'detect'

urlpatterns = [
    path('upload/', views.upload_image_for_detection, name='upload_image'),
    path('list_detection_sessions/', views.list_detection_sessions, name='list_detection_sessions'),
    path('detection_session_details', views.detection_session_details, name='detection_session_details'),
    path('delete_detection_session/<str:session_id>/', views.delete_detection_session, name='delete_detection_session'),
]