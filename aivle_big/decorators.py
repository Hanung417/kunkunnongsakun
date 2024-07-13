from functools import wraps
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required as django_login_required

def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied
        return view_func(request, *args, **kwargs)
    return _wrapped_view
