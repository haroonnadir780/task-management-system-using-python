// src/components/TaskFilter.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { setFilters, clearFilters } from '../store/slices/filterSlice'

function TaskFilter() {
  const dispatch = useDispatch()
  
  // ✅ Add safety check - ensure filters exists
  const filters = useSelector((state) => state.filters) || { status: '', priority: '', search: '' }
  
  // Also get the filters from state with safe defaults
  const { status = '', priority = '', search = '' } = filters

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    dispatch(setFilters({ [name]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Form>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={priority}
                  onChange={handleFilterChange}
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
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Button
                variant="outline-secondary"
                onClick={handleClearFilters}
                className="w-100"
                disabled={!status && !priority && !search}
              >
                <FaTimes className="me-1" />
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default TaskFilter