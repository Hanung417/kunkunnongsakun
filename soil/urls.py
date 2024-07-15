# soil/urls.py

from django.urls import path
from . import views


app_name = 'soil'

urlpatterns = [
    path('soil_exam/', views.soil_exam_result, name='soil_exam_result'),
    path('get-soil-fertilizer-info/', views.get_soil_fertilizer_info, name='get_soil_fertilizer_info'),
    path('get-crop-names/', views.get_crop_names, name='get_crop_names'),
    path('crop_data/', views.get_crop_data_by_user, name='get_crop_data_by_user'),
    path('delete_soil_data/<str:session_id>/', views.delete_soil_data_by_session, name='delete_soil_data_by_session'),
]

