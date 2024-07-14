from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from django.utils import timezone
from .models import Pest, PestDetection
from .utils import process_image
from aivle_big.decorators import login_required
from django.views.decorators.http import require_http_methods
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, InvalidRequestError
import logging

logger = logging.getLogger(__name__)

@login_required
def upload_image_for_detection(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method. Only POST requests are allowed'}, status=405)
    
    image_file = request.FILES.get('image')
    if not image_file:
        raise ValidationError('No image uploaded.')

    # Check if the uploaded file is an image
    if not image_file.content_type.startswith('image/'):
        raise ValidationError('Invalid file type, expected an image.')

    try:
        # Instead of reading the image data, directly save it to the model using Django's storage system
        pest_id, confidence = process_image(image_file)  # Assume this function is designed to handle file like objects directly

        try:
            pest_info = Pest.objects.get(id=pest_id)
        except Pest.DoesNotExist:
            pest_info = Pest.objects.get(id=13)
            confidence = 0.0
            # raise NotFoundError("Pest not found.")

        # Create a new detection instance
        detection = PestDetection(
            user=request.user,
            pest=pest_info,
            image=image_file,  # Directly save the ImageField without reading the file
            detection_date=timezone.now(),
            confidence=confidence
        )
        detection.save()

        # Prepare and return the response data
        data = {
            'pest_name': pest_info.pest_name,
            'occurrence_environment': pest_info.occurrence_environment,
            'symptom_description': pest_info.symptom_description,
            'prevention_methods': pest_info.prevention_methods,
            'pesticide_name': pest_info.pesticide_name,
            'confidence': confidence,
            'image_url': detection.image.url  # Return the URL of the image in S3
        }
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
            'detection_date': timezone.localtime(session.detection_date).strftime('%Y-%m-%d %H:%M:%S'),
            'confidence': session.confidence
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
            'detection_date': session.detection_date.strftime('%Y-%m-%d %H:%M'),
            'confidence': session.confidence,
            'image_url': session.image.url
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