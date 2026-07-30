// src/store/slices/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

console.log('🔧 API_BASE_URL:', API_BASE_URL)

// ✅ CORRECT: Fetch Tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)
      
      const url = `${API_BASE_URL}/tasks/${params.toString() ? `?${params.toString()}` : ''}`
      console.log('📡 Fetching from:', url)
      
      const response = await axios.get(url)
      console.log('📦 Full Response:', response.data)
      
      // ✅ Extract tasks from data.tasks
      if (response.data && response.data.data && response.data.data.tasks) {
        console.log('✅ Found', response.data.data.tasks.length, 'tasks')
        return response.data.data.tasks  // Return just the tasks array
      } else {
        console.error('❌ Unexpected response structure:', response.data)
        return []  // Return empty array if structure is wrong
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ✅ CORRECT: Create Task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/tasks/`
      console.log('📝 Creating task at:', url)
      
      const response = await axios.post(url, taskData)
      console.log('📦 Create Response:', response.data)
      
      // ✅ Extract the created task
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error) {
      console.error('❌ Create Error:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ✅ CORRECT: Update Task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/tasks/${taskId}`
      console.log('✏️ Updating task at:', url)
      
      const response = await axios.put(url, taskData)
      console.log('📦 Update Response:', response.data)
      
      // ✅ Extract the updated task
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error) {
      console.error('❌ Update Error:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ✅ CORRECT: Update Task Status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/tasks/${taskId}/status`
      console.log('🔄 Updating status at:', url)
      
      const response = await axios.patch(url, { status })
      console.log('📦 Status Update Response:', response.data)
      
      // ✅ Extract the updated task
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error) {
      console.error('❌ Status Update Error:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ✅ CORRECT: Delete Task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/tasks/${taskId}`
      console.log('🗑️ Deleting task at:', url)
      
      await axios.delete(url)
      console.log('✅ Task deleted:', taskId)
      return taskId
    } catch (error) {
      console.error('❌ Delete Error:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    stats: {
      total: 0,
      todo: 0,
      inProgress: 0,
      completed: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
        console.log('⏳ Loading tasks...')
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        // ✅ action.payload is already the tasks array
        state.items = action.payload || []
        console.log('✅ Loaded', state.items.length, 'tasks')
        
        // Calculate stats
        const total = state.items.length
        const completed = state.items.filter(t => t.status === 'Completed').length
        const inProgress = state.items.filter(t => t.status === 'In Progress').length
        const todo = state.items.filter(t => t.status === 'To Do').length
        state.stats = { total, completed, inProgress, todo }
        console.log('📊 Stats:', state.stats)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch tasks'
        console.error('❌ Fetch rejected:', state.error)
      })
      
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload
        state.items.push(newTask)
        state.stats.total += 1
        if (newTask.status === 'To Do') state.stats.todo += 1
        else if (newTask.status === 'In Progress') state.stats.inProgress += 1
        else if (newTask.status === 'Completed') state.stats.completed += 1
        console.log('✅ Task created:', newTask.title)
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload
        const index = state.items.findIndex(t => t.id === updatedTask.id)
        if (index !== -1) {
          const oldTask = state.items[index]
          state.items[index] = updatedTask
          
          if (oldTask.status !== updatedTask.status) {
            if (oldTask.status === 'To Do') state.stats.todo -= 1
            else if (oldTask.status === 'In Progress') state.stats.inProgress -= 1
            else if (oldTask.status === 'Completed') state.stats.completed -= 1
            
            if (updatedTask.status === 'To Do') state.stats.todo += 1
            else if (updatedTask.status === 'In Progress') state.stats.inProgress += 1
            else if (updatedTask.status === 'Completed') state.stats.completed += 1
          }
          console.log('✅ Task updated:', updatedTask.title)
        }
      })
      
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload
        const index = state.items.findIndex(t => t.id === updatedTask.id)
        if (index !== -1) {
          const oldTask = state.items[index]
          state.items[index] = updatedTask
          
          if (oldTask.status === 'To Do') state.stats.todo -= 1
          else if (oldTask.status === 'In Progress') state.stats.inProgress -= 1
          else if (oldTask.status === 'Completed') state.stats.completed -= 1
          
          if (updatedTask.status === 'To Do') state.stats.todo += 1
          else if (updatedTask.status === 'In Progress') state.stats.inProgress += 1
          else if (updatedTask.status === 'Completed') state.stats.completed += 1
          
          console.log(`✅ Status updated: ${oldTask.status} → ${updatedTask.status}`)
        }
      })
      
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload
        const deletedTask = state.items.find(t => t.id === taskId)
        if (deletedTask) {
          state.items = state.items.filter(t => t.id !== taskId)
          state.stats.total -= 1
          if (deletedTask.status === 'To Do') state.stats.todo -= 1
          else if (deletedTask.status === 'In Progress') state.stats.inProgress -= 1
          else if (deletedTask.status === 'Completed') state.stats.completed -= 1
          console.log('🗑️ Task deleted:', deletedTask.title)
        }
      })
  }
})

export const { clearError } = tasksSlice.actions
export default tasksSlice.reducer