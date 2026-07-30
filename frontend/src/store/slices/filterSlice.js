// src/store/slices/filterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: '',
  priority: '',
  search: '',
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload }
    },
    setStatusFilter: (state, action) => {
      state.status = action.payload
    },
    setPriorityFilter: (state, action) => {
      state.priority = action.payload
    },
    setSearchFilter: (state, action) => {
      state.search = action.payload
    },
    clearFilters: (state) => {
      return initialState
    },
    resetFilters: (state) => {
      state.status = ''
      state.priority = ''
      state.search = ''
    },
  },
})

export const {
  setFilters,
  setStatusFilter,
  setPriorityFilter,
  setSearchFilter,
  clearFilters,
  resetFilters,
} = filterSlice.actions

export default filterSlice.reducer