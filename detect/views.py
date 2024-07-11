from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from .models import Pest, PestDetection
from .utils import process_image
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError
import logging

logger = logging.getLogger(__name__)

@login_required
def upload_image_for_detection(request):
    if request.method == 'GET':
        return render(request, 'upload.html')

    if request.method != 'POST':
        raise ValidationError('Invalid request method. Only POST requests are allowed.')

    if not request.FILES.get('image'):
        raise ValidationError('No image uploaded.')

    try:
        # Handle file upload
        image_file = request.FILES['image']
        fs = FileSystemStorage()
        filename = fs.save(image_file.name, image_file)
        image_url = fs.url(filename)

        # Process the image to detect pests and get confidence level
        try:
            pest_id, confidence = process_image(image_file)
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise InternalServerError('Error processing image.', details=str(e))

        try:
            # Retrieve the detected pest's information using the correct field
            pest_info = Pest.objects.get(id=pest_id)
        except Pest.DoesNotExist:
            # Fallback to pest with id 1 if no pest is found
            try:
                pest_info = Pest.objects.get(id=1)
                confidence = 0.0
            except Pest.DoesNotExist:
                raise NotFoundError('Fallback pest not found. Please ensure pest with id=1 exists.')

        try:
            # Save the detection information in the database
            detection = PestDetection(
                user=request.user,
                pest=pest_info,
                image=image_file,
                detection_date=timezone.now(),
                confidence=confidence
            )
            detection.save()
        except Exception as e:
            logger.error(f"Error saving detection information: {str(e)}")
            raise InternalServerError('Error saving detection information.', details=str(e))

        # Prepare response data
        data = {
            'pest_name': pest_info.pest_name,
            'occurrence_environment': pest_info.occurrence_environment,
            'symptom_description': pest_info.symptom_description,
            'prevention_methods': pest_info.prevention_methods,
            'pesticide_name': pest_info.pesticide_name,
            'image_url': pest_info.image_url,
            'confidence': confidence
        }

        return JsonResponse(data, status=200)

    except Exception as e:
        # General exception handler for unexpected errors
        logger.error(f"Unhandled exception in upload_image_for_detection: {str(e)}")
        raise InternalServerError('An unexpected error occurred.', details=str(e))
