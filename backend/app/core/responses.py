from typing import Any, Dict

class APIResponse:
    """Standard API response formatter."""
    
    @staticmethod
    def success(
        message: str = "Operation successful",
        data: Any = None,
        status_code: int = 200
    ) -> Dict:
        """Format a success response."""
        # Convert SQLAlchemy model to dict if needed
        if data is not None and hasattr(data, '__dict__') and not isinstance(data, dict):
            if hasattr(data, '_asdict'):  # For SQLAlchemy results
                data = data._asdict()
            elif hasattr(data, '__table__'):  # For SQLAlchemy models
                data = {c.name: getattr(data, c.name) for c in data.__table__.columns}
        
        return {
            "success": True,
            "message": message,
            "status_code": status_code,
            "data": data if data is not None else {}
        }
    
    @staticmethod
    def error(
        message: str = "An error occurred",
        status_code: int = 500,
        data: Any = None
    ) -> Dict:
        """Format an error response."""
        return {
            "success": False,
            "message": message,
            "status_code": status_code,
            "data": data if data is not None else {}
        }
    
    @staticmethod
    def created(data: Any = None) -> Dict:
        """Format a created response (201)."""
        return APIResponse.success(
            message="Task created successfully",
            data=data,
            status_code=201
        )
    
    @staticmethod
    def updated(data: Any = None) -> Dict:
        """Format an updated response (200)."""
        return APIResponse.success(
            message="Task updated successfully",
            data=data,
            status_code=200
        )
    
    @staticmethod
    def deleted() -> Dict:
        """Format a deleted response (204)."""
        return {
            "success": True,
            "message": "Task deleted successfully",
            "status_code": 204,
            "data": {}
        }


# Create singleton instance
api_response = APIResponse()