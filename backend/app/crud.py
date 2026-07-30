from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List
from datetime import datetime

from . import models, schemas
from .core.exceptions import TaskNotFoundException


class TaskCRUD:
    """CRUD operations for Task model"""
    
    @staticmethod
    def get_tasks(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc"
    ) -> List[models.Task]:
        """
        Get all tasks with optional filtering, sorting, and pagination.
        """
        query = db.query(models.Task)
        
        # Apply filters
        if status:
            query = query.filter(models.Task.status == status)
        
        if priority:
            query = query.filter(models.Task.priority == priority)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (models.Task.title.ilike(search_term)) | 
                (models.Task.description.ilike(search_term))
            )
        
        # Apply sorting
        if sort_by and hasattr(models.Task, sort_by):
            sort_column = getattr(models.Task, sort_by)
            if sort_order == "asc":
                query = query.order_by(sort_column.asc())
            else:
                query = query.order_by(sort_column.desc())
        
        # Apply pagination
        tasks = query.offset(skip).limit(limit).all()
        return tasks
    
    @staticmethod
    def get_task(db: Session, task_id: int) -> models.Task:
        """
        Get a single task by ID.
        Raises TaskNotFoundException if task doesn't exist.
        """
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not task:
            raise TaskNotFoundException(f"Task with id {task_id} not found")
        return task
    
    @staticmethod
    def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
        """
        Create a new task.
        """
        db_task = models.Task(**task.model_dump())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate) -> models.Task:
        """
        Update an existing task with partial updates.
        """
        db_task = TaskCRUD.get_task(db, task_id)
        
        # Update only provided fields
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_task_status(db: Session, task_id: int, status_update: schemas.TaskStatusUpdate) -> models.Task:
        """
        Update only the status of a task.
        """
        db_task = TaskCRUD.get_task(db, task_id)
        db_task.status = status_update.status
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete_task(db: Session, task_id: int) -> None:
        """
        Delete a task by ID.
        """
        db_task = TaskCRUD.get_task(db, task_id)
        db.delete(db_task)
        db.commit()
        return None


# Create singleton instance
task_crud = TaskCRUD()