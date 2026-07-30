from fastapi import APIRouter, Depends, Query, Path, Response
from sqlalchemy.orm import Session
from typing import Optional, List

from ..database import get_db
from .. import schemas, crud
from ..core.responses import api_response
from ..core.exceptions import TaskNotFoundException

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
    responses={
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)


@router.post("/", status_code=201)
async def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    """Create a new task."""
    try:
        db_task = crud.task_crud.create_task(db, task)
        return api_response.created(data={
            "id": db_task.id,
            "title": db_task.title,
            "description": db_task.description,
            "status": db_task.status.value if hasattr(db_task.status, 'value') else db_task.status,
            "priority": db_task.priority.value if hasattr(db_task.priority, 'value') else db_task.priority,
            "due_date": str(db_task.due_date),
            "created_at": str(db_task.created_at),
            "updated_at": str(db_task.updated_at)
        })
    except Exception as e:
        raise e


@router.get("/")
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("created_at"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get all tasks with optional filtering, sorting, and pagination."""
    try:
        tasks = crud.task_crud.get_tasks(
            db=db,
            skip=skip,
            limit=limit,
            status=status,
            priority=priority,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        # Convert tasks to serializable format
        tasks_data = []
        for task in tasks:
            tasks_data.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status.value if hasattr(task.status, 'value') else task.status,
                "priority": task.priority.value if hasattr(task.priority, 'value') else task.priority,
                "due_date": str(task.due_date),
                "created_at": str(task.created_at),
                "updated_at": str(task.updated_at)
            })
        
        return api_response.success(
            message="Tasks retrieved successfully",
            data={
                "tasks": tasks_data,
                "total": len(tasks_data),
                "skip": skip,
                "limit": limit
            }
        )
    except Exception as e:
        raise e


@router.get("/{task_id}")
async def get_task(
    task_id: int = Path(..., gt=0),
    db: Session = Depends(get_db)
):
    """Get a single task by its ID."""
    try:
        task = crud.task_crud.get_task(db, task_id)
        return api_response.success(
            message="Task retrieved successfully",
            data={
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status.value if hasattr(task.status, 'value') else task.status,
                "priority": task.priority.value if hasattr(task.priority, 'value') else task.priority,
                "due_date": str(task.due_date),
                "created_at": str(task.created_at),
                "updated_at": str(task.updated_at)
            }
        )
    except TaskNotFoundException as e:
        raise e
    except Exception as e:
        raise e


@router.put("/{task_id}")
async def update_task(
    task_id: int = Path(..., gt=0),
    task_update: schemas.TaskUpdate = None,
    db: Session = Depends(get_db)
):
    """Update an existing task."""
    try:
        updated_task = crud.task_crud.update_task(db, task_id, task_update)
        return api_response.updated(data={
            "id": updated_task.id,
            "title": updated_task.title,
            "description": updated_task.description,
            "status": updated_task.status.value if hasattr(updated_task.status, 'value') else updated_task.status,
            "priority": updated_task.priority.value if hasattr(updated_task.priority, 'value') else updated_task.priority,
            "due_date": str(updated_task.due_date),
            "created_at": str(updated_task.created_at),
            "updated_at": str(updated_task.updated_at)
        })
    except TaskNotFoundException as e:
        raise e
    except Exception as e:
        raise e


@router.patch("/{task_id}/status")
async def update_task_status(
    task_id: int = Path(..., gt=0),
    status_update: schemas.TaskStatusUpdate = None,
    db: Session = Depends(get_db)
):
    """Update only the status of a task."""
    try:
        updated_task = crud.task_crud.update_task_status(db, task_id, status_update)
        return api_response.updated(data={
            "id": updated_task.id,
            "title": updated_task.title,
            "description": updated_task.description,
            "status": updated_task.status.value if hasattr(updated_task.status, 'value') else updated_task.status,
            "priority": updated_task.priority.value if hasattr(updated_task.priority, 'value') else updated_task.priority,
            "due_date": str(updated_task.due_date),
            "created_at": str(updated_task.created_at),
            "updated_at": str(updated_task.updated_at)
        })
    except TaskNotFoundException as e:
        raise e
    except Exception as e:
        raise e


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int = Path(..., gt=0),
    db: Session = Depends(get_db)
):
    """Delete a task by its ID."""
    try:
        crud.task_crud.delete_task(db, task_id)
        return Response(status_code=204)
    except TaskNotFoundException as e:
        raise e
    except Exception as e:
        raise e