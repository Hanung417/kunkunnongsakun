from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import requests
import xml.etree.ElementTree as ET
import pandas as pd
import json
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError

def index(request):
    return render(request, 'soil.html')

def get_b_code(address):
    url = 'https://dapi.kakao.com/v2/local/search/address.json'
    headers = {'Authorization': 'KakaoAK c3899565939c467eee249e97805d28c1'}
    response = requests.get(url, headers=headers, params={'query': address})
    if response.status_code == 200:
        data = response.json()
        for document in data['documents']:
            b_code = document.get('address', {}).get('b_code')
            if b_code:
                return b_code
        raise NotFoundError("No valid address information found.", code=404)
    else:
        raise InternalServerError(f"API request failed: {response.status_code}", code=response.status_code)

def get_soil_exam_data(b_code):
    url = 'http://apis.data.go.kr/1390802/SoilEnviron/SoilExam/getSoilExamList'
    response = requests.get(url, params={
        'serviceKey': 'XMihbktoJgeXAASWbeYTDZaWDPRL08q/i+1Sml2083f1m3gcyPJ2T1YwIrbry0Fe+HA1R4EU0S+zNL4LjuGBbQ==', 'Page_Size': '200', 'Page_No': '1', 'BJD_Code': b_code
    })
    if response.status_code == 200:
        try:
            root = ET.fromstring(response.content)
            items = root.find('.//items')
            if items is not None:
                return [{child.tag: child.text for child in item} for item in items.findall('item')]
            else:
                raise NotFoundError("No data available for this BJD Code.", code=404)
        except ET.ParseError:
            raise InternalServerError("Failed to parse XML response.", code=500)
    else:
        raise InternalServerError("Failed to retrieve soil examination data.", code=response.status_code)

@login_required
@csrf_exempt
def soil_exam_result(request):
    if request.method != 'POST':
        raise ValidationError("Only POST method is allowed.", code=405)
    try:
        data = json.loads(request.body)
        crop_name = data.get('crop_name')
        address = data.get('address')
        if not crop_name or not address:
            raise ValidationError("Both address and crop name are required.", code=400)
        b_code = get_b_code(address)
        soil_data = get_soil_exam_data(b_code)
        return JsonResponse({'crop_name': crop_name, 'address': address, 'soil_data': soil_data})
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON input.", code=400)

crop_code = pd.read_csv('soil/crop_code.csv')

@login_required
@csrf_exempt
def get_soil_fertilizer_info(request):
    if request.method != 'POST':
        raise ValidationError("Only POST method is allowed.", code=405)
    try:
        data = json.loads(request.body)
        crop_code_value = crop_code.loc[crop_code['crop_name'] == data['crop_code'], 'crop_code'].iat[0]
        params = {'serviceKey': 'XMihbktoJgeXAASWbeYTDZaWDPRL08q/i+1Sml2083f1m3gcyPJ2T1YwIrbry0Fe+HA1R4EU0S+zNL4LjuGBbQ==', 'crop_Code': str(crop_code_value).zfill(5), 'acid': data['acid']}
        response = requests.get('http://apis.data.go.kr/1390802/SoilEnviron/FrtlzrUseExp/getSoilFrtlzrExprnInfo', params=params)
        if response.status_code == 200:
            items = ET.fromstring(response.content).find('.//items')
            if items is not None:
                return JsonResponse({'data': [{child.tag: child.text for child in item} for item in items.findall('item')]})
            else:
                raise NotFoundError("No fertilizer data found.", code=404)
        else:
            raise InternalServerError("Failed to retrieve fertilizer data.", code=response.status_code)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON input.", code=400)