// src/components/TaskForm.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { createTask, updateTask } from '../store/slices/tasksSlice'

function TaskForm({ task, onSuccess, onCancel }) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Populate form when editing
  useEffect(() => {
    if (task) {
      console.log('📝 Editing task:', task)
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        due_date: task.due_date || ''
      })
    } else {
      // Set default due date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        due_date: tomorrow.toISOString().split('T')[0]
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('📤 Submitting form:', formData)
      
      if (task) {
        // Update existing task
        await dispatch(updateTask({ 
          taskId: task.id, 
          taskData: formData 
        })).unwrap()
        console.log('✅ Task updated successfully')
      } else {
        // Create new task
        await dispatch(createTask(formData)).unwrap()
        console.log('✅ Task created successfully')
      }
      
      onSuccess()
    } catch (err) {
      console.error('❌ Form error:', err)
      setError(err.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          maxLength={100}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={3}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Due Date *</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </Form>
  )
}

export default TaskForm