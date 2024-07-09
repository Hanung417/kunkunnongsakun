# prediction/urls.py
from django.urls import path
from . import views

app_name = 'prediction'

urlpatterns = [
    path('predict/', views.predict_income, name='predict_income'),
    path('history/', views.session_history, name='session_history'),
]
