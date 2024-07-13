from functools import wraps
from .exceptions import UnauthorizedError

def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise UnauthorizedError("User is not authenticated")
        return view_func(request, *args, **kwargs)
    return _wrapped_view