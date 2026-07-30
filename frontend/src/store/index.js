// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/tasksSlice'
import filterReducer from './slices/filterSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filterReducer,  // ← Make sure this is included
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

// Export everything
export * from './slices/tasksSlice'
export * from './slices/filterSlice'
export * from './slices/uiSlice'

export default store