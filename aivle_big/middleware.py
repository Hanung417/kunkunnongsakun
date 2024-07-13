from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from .exceptions import (
    ValidationError, BadRequestError, MissingPartError, DuplicateResourceError,
    UnauthorizedError, AccessDeniedError, ForbiddenError, ResourceAccessForbiddenError,
    NotFoundError, InternalServerError, InvalidRequestError
)

class CustomExceptionMiddleware:
    """Middleware to process exceptions thrown in Django applications."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        """Return JSON response for exceptions handled."""
        if isinstance(exception, ValidationError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, BadRequestError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, MissingPartError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, DuplicateResourceError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, UnauthorizedError) or isinstance(exception, PermissionDenied):
            response_data = {
                'status': 'error',
                'message': "Authentication failed" if isinstance(exception, PermissionDenied) else exception.message,
                'code': 1201 if isinstance(exception, PermissionDenied) else exception.error_code,
                'status_code': 401
            }
            return JsonResponse(response_data, status=401)
        elif isinstance(exception, AccessDeniedError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, ForbiddenError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, ResourceAccessForbiddenError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, NotFoundError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, InvalidRequestError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        elif isinstance(exception, InternalServerError):
            response_data = {
                'status': 'error',
                'message': exception.message,
                'code': exception.error_code,
                'status_code': exception.status_code
            }
            return JsonResponse(response_data, status=exception.status_code)
        else:
            response_data = {
                'status': 'error',
                'message': 'Unexpected error occurred',
                'code': 2000,
                'status_code': 500
            }
            return JsonResponse(response_data, status=500)
