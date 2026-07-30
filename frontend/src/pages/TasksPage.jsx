// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import TaskFilter from '../components/TaskFilter'
import { fetchTasks } from '../store/slices/tasksSlice'

function TasksPage() {
  const dispatch = useDispatch()
  
  // ✅ State for modal
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  // Get tasks and filters from Redux
  const { items: tasks, loading, error } = useSelector((state) => state.tasks)
  const filters = useSelector((state) => state.filters) || { status: '', priority: '', search: '' }

  // Fetch tasks when component mounts or filters change
  useEffect(() => {
    console.log('🔄 TasksPage: Fetching tasks with filters:', filters)
    dispatch(fetchTasks(filters))
  }, [dispatch, filters])

  // ✅ Open modal for new task
  const handleOpenCreateModal = () => {
    console.log('🟢 Opening Create Task Modal')
    setEditingTask(null)
    setShowModal(true)
  }

  // ✅ Open modal for editing task
  const handleEditTask = (task) => {
    console.log('✏️ Opening Edit Task Modal:', task)
    setEditingTask(task)
    setShowModal(true)
  }

  // ✅ Close modal
  const handleCloseModal = () => {
    console.log('🔴 Closing Modal')
    setShowModal(false)
    setEditingTask(null)
  }

  // ✅ Handle form success
  const handleFormSuccess = () => {
    console.log('✅ Task saved, refreshing list...')
    dispatch(fetchTasks(filters))
    handleCloseModal()
  }

  console.log('📊 TasksPage render - Tasks:', tasks?.length || 0, 'Modal open:', showModal)

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="display-4 mb-0">📋 Task Management</h1>
          {tasks && <p className="text-muted">{tasks.length} tasks total</p>}
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={handleOpenCreateModal}  // ✅ Fixed: Using the function
            className="px-4"
            size="lg"
          >
            <FaPlus className="me-2" />
            New Task
          </Button>
        </Col>
      </Row>

      {/* Task Filter */}
      <TaskFilter />

      {/* Task List - Pass onEdit handler */}
      <TaskList onEdit={handleEditTask} />

      {/* ✅ Task Form Modal - Always render but control visibility with show prop */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTask ? '✏️ Edit Task' : '📝 Create New Task'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm 
            task={editingTask}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default TasksPage