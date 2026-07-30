from fastapi import HTTPException, status


class TaskNotFoundException(HTTPException):
    """Exception raised when a task is not found."""
    def __init__(self, detail: str = "Task not found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": detail,
                "status_code": status.HTTP_404_NOT_FOUND,
                "data": {}
            }
        )


class ValidationException(HTTPException):
    """Exception raised for validation errors."""
    def __init__(self, detail: str = "Validation error"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "success": False,
                "message": detail,
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "data": {}
            }
        )


class BadRequestException(HTTPException):
    """Exception raised for bad requests."""
    def __init__(self, detail: str = "Bad request"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "message": detail,
                "status_code": status.HTTP_400_BAD_REQUEST,
                "data": {}
            }
        )