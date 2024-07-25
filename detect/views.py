import os
import tempfile
import cv2
import torch
from ultralytics import YOLO
from django.http import JsonResponse
from django.utils import timezone
from django.core.files.base import ContentFile
from .models import Pest, PestDetection
from aivle_big.decorators import login_required
from django.views.decorators.http import require_http_methods
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, InvalidRequestError
import logging
from io import BytesIO
from PIL import Image

logger = logging.getLogger(__name__)

model = YOLO('best.pt')

def process_image(image_path):
    """Process the image and return predictions along with annotated image content."""
    results = model(image_path)
    pest_id = 10
    confidence = 0.0
    result_image_content = None

    if results and len(results) > 0:
        best_result = results[0] 
        if best_result.boxes and len(best_result.boxes) > 0:
            for box in best_result.boxes:
                if box.conf >= 0.6:
                    pest_id = int(box.cls.item())
                    confidence = float(box.conf.item()) * 100 

                    annotated_image = best_result.plot()
                    is_success, buffer = cv2.imencode(".jpg", annotated_image)
                    result_image_content = ContentFile(buffer.tobytes(), name=os.path.basename(image_path))
                    break 

    if not result_image_content:
        with open(image_path, 'rb') as original_file:
            result_image_content = ContentFile(original_file.read(), name=os.path.basename(image_path))

    return pest_id, confidence, result_image_content


@login_required
def upload_image_for_detection(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method. Only POST requests are allowed'}, status=405)
    
    image_file = request.FILES.get('image')
    if not image_file:
        raise ValidationError('No image uploaded.')

    if not image_file.content_type.startswith('image/'):
        raise ValidationError('Invalid file type, expected an image.')

    try:
        file_extension = image_file.name.split('.')[-1]
        with tempfile.NamedTemporaryFile(suffix=f'.{file_extension}', delete=False) as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_image_path = temp_file.name

        pest_id, confidence, result_image_content = process_image(temp_image_path)

        try:
            pest_info = Pest.objects.get(id=pest_id)
        except Pest.DoesNotExist:
            pest_info = Pest.objects.get(id=13)
            confidence = 0.0


        detection = PestDetection(
            user=request.user,
            pest=pest_info,
            image=result_image_content,
            detection_date=timezone.now(),
            confidence=confidence
        )
        detection.save()

        data = {
            'pest_name': pest_info.pest_name,
            'occurrence_environment': pest_info.occurrence_environment,
            'symptom_description': pest_info.symptom_description,
            'prevention_methods': pest_info.prevention_methods,
            'pesticide_name': pest_info.pesticide_name,
            'confidence': confidence,
            'user_image_url': detection.image.url, 
            'db_image_url': detection.pest.image_url,  
            'detection_date': detection.detection_date.now().strftime('%Y-%m-%d %H:%M')
        }

        # Clean up temporary image file
        os.remove(temp_image_path)

        return JsonResponse(data, status=200)

    except Exception as e:
        logger.error(f"Unhandled exception during image processing: {str(e)}")
        raise InternalServerError('An unexpected error occurred.')





@login_required
def list_detection_sessions(request):
    try:
        sessions = PestDetection.objects.filter(user=request.user).order_by('-detection_date')
        session_list = [{
            'session_id': session.id,
            'pest_name': session.pest.pest_name,
            'detection_date': timezone.localtime(session.detection_date).strftime('%Y-%m-%d %H:%M'),
            'confidence': session.confidence,
            'user_image_url': session.image.url
        } for session in sessions]
        return JsonResponse(session_list, safe=False)
    except Exception as e:
        logger.error(f"Error retrieving sessions: {str(e)}")
        raise InternalServerError('An unexpected error occurred while retrieving detection sessions.')
    
@login_required
def detection_session_details(request, session_id):
    try:
        session = PestDetection.objects.get(id=session_id, user=request.user)
        details = {
            'session_id': session.id,
            'pest_name': session.pest.pest_name,
            'occurrence_environment': session.pest.occurrence_environment,
            'symptom_description': session.pest.symptom_description,
            'prevention_methods': session.pest.prevention_methods,
            'pesticide_name': session.pest.pesticide_name,
            'detection_date': session.detection_date.now().strftime('%Y-%m-%d %H:%M'),
            'confidence': session.confidence,
            'user_image_url': session.image.url,
            'db_image_url': session.pest.image_url
        }
        return JsonResponse(details)
    except PestDetection.DoesNotExist:
        raise NotFoundError('Detection session not found')
    except Exception as e:
        logger.error(f"Unhandled exception in session details: {str(e)}")
        raise InternalServerError('An unexpected error occurred while fetching session details.')
    
@login_required
@require_http_methods(["DELETE"])
def delete_detection_session(request, session_id):
    try:
        session = PestDetection.objects.get(id=session_id, user=request.user)
        session.delete()
        return JsonResponse({'success': 'Detection session deleted successfully'}, status=200)
    except PestDetection.DoesNotExist:
        raise NotFoundError('Detection session not found')
    except Exception as e:
        logger.error(f"Error deleting detection session: {str(e)}")
        raise InternalServerError('An unexpected error occurred while deleting the detection session.')