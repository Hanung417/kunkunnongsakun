from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from .models import Pest, PestDetection
from .utils import process_image

@login_required  # Ensure only authenticated users can access this view
def upload_image_for_detection(request):
    if request.method != 'POST' or not request.FILES.get('image'):
        # If it's not a POST request or no image is uploaded, just render the upload form
        return render(request, 'upload.html')

    # Handle file upload
    image_file = request.FILES['image']
    fs = FileSystemStorage()
    filename = fs.save(image_file.name, image_file)
    image_url = fs.url(filename)

    # Process the image to detect pests and get confidence level
    pest_id, confidence = process_image(image_file)

    try:
        # Retrieve the detected pest's information
        pest_info = Pest.objects.get(id=pest_id)
    except Pest.DoesNotExist:
        # If no pest is found with the ID returned by process_image, show an error
        return render(request, 'result.html', {
            'error': 'Pest not found. Please try another image.'
        })

    # Save the detection information in the database
    detection = PestDetection(
        user=request.user,
        pest=pest_info,
        image=image_file,
        detection_date=timezone.now()
    )
    detection.save()

    # Prepare context data for the results page
    context = {
        'pest_name': pest_info.name,
        'threat_level': pest_info.threat_level,
        'prevention_methods': pest_info.prevention_methods,
        'confidence': confidence,
        'image_url': image_url
    }

    # Render the results page with the detection info
    return render(request, 'result.html', context)
