from pydantic import BaseModel, Field, validator, ConfigDict
from datetime import date, datetime
from typing import Optional, Any, Dict
from .models import TaskStatus, TaskPriority


class TaskBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Task description")
    status: TaskStatus = Field(default=TaskStatus.TODO, description="Task status")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    due_date: date = Field(..., description="Task due date")
    
    @validator('due_date')
    def validate_due_date(cls, v):
        if v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v
    
    model_config = ConfigDict(use_enum_values=True)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None
    
    @validator('due_date')
    def validate_due_date(cls, v):
        if v and v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v
    
    model_config = ConfigDict(use_enum_values=True)


class TaskStatusUpdate(BaseModel):
    status: TaskStatus = Field(..., description="New task status")
    
    model_config = ConfigDict(use_enum_values=True)


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: date
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class StandardResponse(BaseModel):
    success: bool
    message: str
    status_code: int
    data: Any = {}
    
    model_config = ConfigDict(arbitrary_types_allowed=True)