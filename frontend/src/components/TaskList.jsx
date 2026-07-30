// src/components/TaskList.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button, Badge, Row, Col, Spinner, Alert, Form } from 'react-bootstrap'
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaSpinner, FaCircle, FaSearch } from 'react-icons/fa'
import { format } from 'date-fns'

// ✅ CORRECT IMPORT - tasksSlice is in store/slices/
import { fetchTasks, deleteTask, updateTaskStatus, clearError } from '../store/slices/tasksSlice'

function TaskList({ onEdit }) {
  const dispatch = useDispatch()
  const { items: tasks, loading, error, stats } = useSelector((state) => state.tasks)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    console.log('🔄 TaskList: Fetching tasks with filters:', filters)
    dispatch(fetchTasks(filters))
  }, [dispatch, filters])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log('🗑️ Deleting task:', taskId)
      dispatch(deleteTask(taskId))
    }
  }

  const handleStatusChange = (taskId, newStatus) => {
    console.log('🔄 Updating status:', taskId, '→', newStatus)
    dispatch(updateTaskStatus({ taskId, status: newStatus }))
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ status: '', priority: '', search: '' })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle className="text-success" />
      case 'In Progress':
        return <FaSpinner className="text-warning fa-spin" />
      default:
        return <FaCircle className="text-secondary" />
    }
  }

  const getPriorityVariant = (priority) => {
    const variants = {
      Urgent: 'danger',
      High: 'warning',
      Medium: 'info',
      Low: 'success',
    }
    return variants[priority] || 'secondary'
  }

  const getStatusVariant = (status) => {
    const variants = {
      Completed: 'success',
      'In Progress': 'warning',
      'To Do': 'secondary',
    }
    return variants[status] || 'secondary'
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading tasks...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center justify-content-between">
        <div>
          <strong>Error loading tasks:</strong>{' '}
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
        <Button variant="outline-danger" size="sm" onClick={() => dispatch(fetchTasks(filters))}>
          Retry
        </Button>
      </Alert>
    )
  }

  // Stats Banner
  const StatsBanner = () => (
    <Row className="g-3 mb-4">
      <Col xs={6} md={3}>
        <Card className="text-center bg-primary text-white">
          <Card.Body>
            <h3>{stats.total}</h3>
            <div>Total Tasks</div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3}>
        <Card className="text-center bg-secondary text-white">
          <Card.Body>
            <h3>{stats.todo}</h3>
            <div>To Do</div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3}>
        <Card className="text-center bg-warning text-dark">
          <Card.Body>
            <h3>{stats.inProgress}</h3>
            <div>In Progress</div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3}>
        <Card className="text-center bg-success text-white">
          <Card.Body>
            <h3>{stats.completed}</h3>
            <div>Completed</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )

  // Filters Section
  const FilterSection = () => (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <FaSearch className="me-2" />
            Filters
          </h5>
          <div>
            <Button variant="outline-secondary" size="sm" onClick={clearFilters} className="me-2">
              Clear All
            </Button>
            <Button variant="outline-primary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  )

  // Empty state
  if (tasks.length === 0) {
    return (
      <>
        <StatsBanner />
        <FilterSection />
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <div className="display-1 mb-3">📋</div>
          <h3 className="text-secondary">No tasks found</h3>
          <p className="text-muted">
            {filters.status || filters.priority || filters.search
              ? 'Try adjusting your filters'
              : 'Create a new task to get started'}
          </p>
          {(filters.status || filters.priority || filters.search) && (
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <StatsBanner />
      <FilterSection />

      <Row className="g-4">
        {tasks.map((task) => (
          <Col key={task.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm hover-shadow transition">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {getStatusIcon(task.status)}
                    <Card.Title className="mb-0 h5">{task.title}</Card.Title>
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit && onEdit(task)}
                      className="border-0"
                      title="Edit task"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="border-0"
                      title="Delete task"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-2">
                  <Badge bg={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  <Badge bg={getStatusVariant(task.status)}>{task.status}</Badge>
                </div>

                {task.description && (
                  <Card.Text className="text-muted flex-grow-1">
                    {task.description.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description}
                  </Card.Text>
                )}

                <div className="mt-auto pt-2">
                  <div className="d-flex flex-column gap-1 text-muted small">
                    {task.due_date && (
                      <div className="d-flex align-items-center gap-1">
                        <FaClock />
                        <span>Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    <div>Created: {format(new Date(task.created_at), 'MMM dd, yyyy')}</div>
                  </div>

                  {/* Status Update Dropdown */}
                  <div className="mt-2">
                    <Form.Select
                      size="sm"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="bg-light"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Show total count */}
      <div className="text-center mt-4 text-muted">
        Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </div>
    </>
  )
}

export default TaskList