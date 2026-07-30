// src/services/taskApi.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle the custom response format
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url)
    
    // ✅ If the response has the custom format, extract the data
    if (response.data && response.data.data) {
      return response.data.data
    }
    return response.data
  },
  (error) => {
    if (error.response) {
      console.error('Server Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No Response - Check if backend is running')
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const getTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    const url = queryString ? `/tasks/?${queryString}` : '/tasks/'
    
    const response = await api.get(url)
    // ✅ Now response.data is already the data object
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks/', taskData)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    return response.data
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error)
    throw error
  }
}

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating task ${taskId} status:`, error)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}`)
    return { success: true, id: taskId }
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error)
    throw error
  }
}

export default api