from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from aivle_big.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import requests
import xml.etree.ElementTree as ET
import pandas as pd
import json
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, InvalidRequestError, BadRequestError, MissingPartError

@csrf_exempt
def get_crop_names(request):
    if request.method != 'GET':
        raise InvalidRequestError("Invalid request method. Only GET is allowed.", code=405)
    
    try:
        crop_names = crop_code['crop_name'].tolist()
        return JsonResponse({'crop_names': crop_names})
    except Exception as e:
        raise InternalServerError(f"An unexpected error occurred: {str(e)}", code=500)

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
        raise InvalidRequestError("Invalid request method. Only POST is allowed.", code=405)

    try:
        data = json.loads(request.body)
        crop_name = data.get('crop_name')
        address = data.get('address')
        
        if not crop_name or not address:
            raise ValidationError("Address and crop name are required", code=1001)

        b_code = get_b_code(address)
        if b_code is None:
            raise NotFoundError("B code could not be found for the given address", code=404)

        soil_data = get_soil_exam_data(b_code)
        if soil_data is None:
            raise NotFoundError("Soil examination data could not be found", code=404)

        result = {
            'crop_name': crop_name,
            'address': address,
            'soil_data': soil_data
        }
        return JsonResponse(result, status=200)

    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format.", code=400)
    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': str(e), 'code': e.error_code, 'status_code': e.status_code}, status=e.status_code)
    except NotFoundError as e:
        return JsonResponse({'status': 'error', 'message': str(e), 'code': e.error_code, 'status_code': e.status_code}, status=e.status_code)
    except InvalidRequestError as e:
        return JsonResponse({'status': 'error', 'message': str(e), 'code': e.error_code, 'status_code': e.status_code}, status=e.status_code)
    except Exception as e:
        raise InternalServerError(f"An unexpected error occurred: {str(e)}", code=500)


crop_code = pd.read_csv('soil/crop_code.csv')


def get_soil_fertilizer_info(request):
    if request.method != 'POST':
        raise InvalidRequestError("Invalid request method")

    url = 'http://apis.data.go.kr/1390802/SoilEnviron/FrtlzrUseExp/getSoilFrtlzrExprnInfo'

    def validate_and_convert(value, min_val, max_val):
        try:
            value = float(value)
        except (ValueError, TypeError):
            return str(min_val)
        return str(max(min_val, min(value, max_val)))

    try:
        data = json.loads(request.body)
        name = data.get('crop_code')

        if not name:
            raise MissingPartError("Missing crop code")

        crop_code_row = crop_code.loc[crop_code['crop_name'] == name]

        if crop_code_row.empty:
            raise ValidationError("Invalid crop name provided")

        crop_code_value = crop_code_row['crop_code'].values[0]
        crop_code_value = str(crop_code_value).zfill(5)

        params = {
            'serviceKey': '1/eYLkvnjZNKzzUpbpb+/VWWmZExnS0ave8VahtkI0X3CiletYaxBgBnlvunpx8tckfsXBogJJIQJayprpZbmA==',
            'crop_Code': crop_code_value,
            'acid': validate_and_convert(data.get('acid'), 4, 9),
            'om': validate_and_convert(data.get('om'), 5, 300),
            'vldpha': validate_and_convert(data.get('vldpha'), 5, 1700),
            'posifert_K': validate_and_convert(data.get('posifert_K'), 0.01, 9),
            'posifert_Ca': validate_and_convert(data.get('posifert_Ca'), 0.1, 30),
            'posifert_Mg': validate_and_convert(data.get('posifert_Mg'), 0.1, 20),
            'vldsia': validate_and_convert(data.get('vldsia'), 5, 1500),
            'selc': validate_and_convert(data.get('selc'), 0, 10),
        }

        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        response_content = response.content.decode('utf-8')
        root = ET.fromstring(response_content)
        body = root.find('body')
        if body is None:
            raise NotFoundError("No body element found in response")

        items = body.find('items')
        if items is None:
            raise NotFoundError("No items found in response")

        data = []
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

    except json.JSONDecodeError:
        raise BadRequestError("Invalid JSON")
    except ValidationError as e:
        raise ValidationError(str(e))
    except requests.exceptions.HTTPError as e:
        raise InternalServerError(f"HTTP error: {str(e)}")
    except Exception as e:
        raise InternalServerError(str(e))
