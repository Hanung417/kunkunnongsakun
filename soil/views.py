from django.shortcuts import render
import requests
import xml.etree.ElementTree as ET
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import pandas as pd
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'soil.html')

def get_b_code(address):
    url = 'https://dapi.kakao.com/v2/local/search/address.json'
    params = {
        'query': address
    }
    headers = {
        'Authorization': 'KakaoAK c3899565939c467eee249e97805d28c1'
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        for document in data['documents']:
            address_info = document.get('address')
            if address_info:
                return address_info.get('b_code')
        print("유효한 주소 정보를 찾을 수 없습니다.")
        return None
    else:
        print(f"API 요청 실패: {response.status_code}")
        print(response.text)
        return None
    
def get_soil_exam_data(b_code):
    url = 'http://apis.data.go.kr/1390802/SoilEnviron/SoilExam/getSoilExamList'
    params = {
        'serviceKey': 'XMihbktoJgeXAASWbeYTDZaWDPRL08q/i+1Sml2083f1m3gcyPJ2T1YwIrbry0Fe+HA1R4EU0S+zNL4LjuGBbQ==',
        'Page_Size': '200',
        'Page_No': '1',
        'BJD_Code': b_code
    }
    response = requests.get(url, params=params)
    response_str = response.content
    root = ET.fromstring(response_str)
    data = []
    items = root.find('body').find('items')
    if items is not None:
        for item in items.findall('item'):
            item_data = {
                'No': item.find('No').text,
                'BJD_Code': item.find('BJD_Code').text,
                'Any_Year': item.find('Any_Year').text,
                'Exam_Day': item.find('Exam_Day').text,
                'Exam_Type': item.find('Exam_Type').text,
                'PNU_Nm': item.find('PNU_Nm').text,
                'ACID': item.find('ACID').text,
                'VLDPHA': item.find('VLDPHA').text if item.find('VLDPHA') is not None else None,
                'VLDSIA': item.find('VLDSIA').text if item.find('VLDSIA') is not None else None,
                'OM': item.find('OM').text,
                'POSIFERT_MG': item.find('POSIFERT_MG').text if item.find('POSIFERT_MG') is not None else None,
                'POSIFERT_K': item.find('POSIFERT_K').text,
                'POSIFERT_CA': item.find('POSIFERT_CA').text if item.find('POSIFERT_CA') is not None else None,
                'SELC': item.find('SELC').text if item.find('SELC') is not None else None,
            }
            data.append(item_data)
    else:
        print("데이터가 없습니다.")
    return data

@login_required
@csrf_exempt
def soil_exam_result(request):
    if request.method == 'POST':
        crop_name = request.POST.get('crop_name')
        address = request.POST.get('address')
        if crop_name and address:
            b_code = get_b_code(address)
            soil_data = get_soil_exam_data(b_code)
            result = {
                'crop_name': crop_name,
                'address': address,
                'soil_data': soil_data
            }
            return JsonResponse(result)
        else:
            return JsonResponse({'error': 'Address and crop name are required'}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

crop_code = pd.read_csv('soil/crop_code.csv')

@login_required
@csrf_exempt
def get_soil_fertilizer_info(request):
    if request.method == 'POST':
        url = 'http://apis.data.go.kr/1390802/SoilEnviron/FrtlzrUseExp/getSoilFrtlzrExprnInfo'
        
        def validate_and_convert(value, min_val, max_val):
            try:
                value = float(value)
            except (ValueError, TypeError):
                return str(min_val)
            return str(max(min_val, min(value, max_val)))
        
        name = request.POST.get('crop_code')
        crop_code_value = crop_code.loc[crop_code['crop_name'] == name, 'crop_code'].values[0]
        crop_code_value = str(crop_code_value).zfill(5)
        
        params = {
            'serviceKey': '1/eYLkvnjZNKzzUpbpb+/VWWmZExnS0ave8VahtkI0X3CiletYaxBgBnlvunpx8tckfsXBogJJIQJayprpZbmA==',
            'crop_Code': crop_code_value,
            'acid': validate_and_convert(request.POST.get('acid'), 4, 9),
            'om': validate_and_convert(request.POST.get('om'), 5, 300),
            'vldpha': validate_and_convert(request.POST.get('vldpha'), 5, 1700),
            'posifert_K': validate_and_convert(request.POST.get('posifert_k'), 0.01, 9),
            'posifert_Ca': validate_and_convert(request.POST.get('posifert_ca'), 0.1, 30),
            'posifert_Mg': validate_and_convert(request.POST.get('posifert_mg'), 0.1, 20),
            'vldsia': validate_and_convert(request.POST.get('vldsia'), 5, 1500),
            'selc': validate_and_convert(request.POST.get('selc'), 0, 10),
        }
        
        response = requests.get(url, params=params)
        response_content = response.content.decode('utf-8')
        root = ET.fromstring(response_content)
        body = root.find('body')
        if body is None:
            return JsonResponse({'error': 'No body element found in response.'}, status=404)
        items = body.find('items')
        data = []
        if items is not None:
            for item in items.findall('item'):
                item_data = {
                    'crop_Code': item.find('crop_Code').text if item.find('crop_Code') is not None else None,
                    'crop_Nm': item.find('crop_Nm').text if item.find('crop_Nm') is not None else None,
                    'pre_Fert_N': item.find('pre_Fert_N').text if item.find('pre_Fert_N') is not None else None,
                    'pre_Fert_P': item.find('pre_Fert_P').text if item.find('pre_Fert_P') is not None else None,
                    'pre_Fert_K': item.find('pre_Fert_K').text if item.find('pre_Fert_K') is not None else None,
                    'post_Fert_N': item.find('post_Fert_N').text if item.find('post_Fert_N') is not None else None,
                    'post_Fert_P': item.find('post_Fert_P').text if item.find('post_Fert_P') is not None else None,
                    'post_Fert_K': item.find('post_Fert_K').text if item.find('post_Fert_K') is not None else None,
                    'pre_Compost_Cattl': item.find('pre_Compost_Cattl').text if item.find('pre_Compost_Cattl') is not None else None,
                    'pre_Compost_Pig': item.find('pre_Compost_Pig').text if item.find('pre_Compost_Pig') is not None else None,
                    'pre_Compost_Chick': item.find('pre_Compost_Chick').text if item.find('pre_Compost_Chick') is not None else None,
                    'pre_Compost_Mix': item.find('pre_Compost_Mix').text if item.find('pre_Compost_Mix') is not None else None,
                }
                data.append(item_data)
            return JsonResponse({'data': data})
        else:
            return JsonResponse({'error': 'No items found in response.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)