class ValidationError(Exception):
    """Exception raised for input validation errors."""
    status_code = 400
    error_code = 1001
    def __init__(self, message="Validation failed for request", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class BadRequestError(Exception):
    """Exception raised for bad request errors."""
    status_code = 400
    error_code = 1002
    def __init__(self, message="Wrong request transmission", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class MissingPartError(Exception):
    """Exception raised for missing essential elements."""
    status_code = 400
    error_code = 1003
    def __init__(self, message="Missing essential parts", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class DuplicateResourceError(Exception):
    """Exception raised for attempting to create a duplicate resource."""
    status_code = 400
    error_code = 1004
    def __init__(self, message="Delivery of duplicate resources", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class UnauthorizedError(Exception):
    """Exception for authentication failures."""
    status_code = 401
    error_code = 1201
    def __init__(self, message="Authentication failed", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class AccessDeniedError(Exception):
    """Exception for denied access errors."""
    status_code = 401
    error_code = 1202
    def __init__(self, message="Access denied", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class ForbiddenError(Exception):
    """Exception for access being forbidden."""
    status_code = 403
    error_code = 1101
    def __init__(self, message="Role-based access control error", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class ResourceAccessForbiddenError(Exception):
    """Exception for forbidden resource access."""
    status_code = 403
    error_code = 1102
    def __init__(self, message="Resource access permission error", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class NotFoundError(Exception):
    """Exception raised for not found resources."""
    status_code = 404
    error_code = 1301
    def __init__(self, message="Attempting to access a non-existent resource", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class InternalServerError(Exception):
    """Exception for internal server errors."""
    status_code = 500
    error_code = 2000
    def __init__(self, message="Server internal error", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)

class InvalidRequestError(Exception):
    """Exception for invalid request method errors."""
    status_code = 405
    error_code = 1002
    def __init__(self, message="Invalid request method", code=None):
        self.message = message
        self.error_code = code if code is not None else self.__class__.error_code
        super().__init__(self.message)
