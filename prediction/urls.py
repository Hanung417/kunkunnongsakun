# prediction/urls.py
from django.urls import path
from . import views

app_name = 'prediction'

urlpatterns = [
    path('predict/', views.predict_income, name='predict_income'),
    path('list_sessions/', views.list_prediction_sessions, name='list_prediction_sessions'),
    path('session_details/<str:session_id>/', views.prediction_session_details, name='prediction_session_details'),
    path('delete_session/<str:session_id>/', views.delete_prediction_session, name='delete_prediction_session'),
]

