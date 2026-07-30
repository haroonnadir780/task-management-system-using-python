import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showForm: false,
    editingTask: null,
    alert: null
  },
  reducers: {
    showForm: (state, action) => {
      state.showForm = true
      state.editingTask = action.payload || null
    },
    hideForm: (state) => {
      state.showForm = false
      state.editingTask = null
    },
    setAlert: (state, action) => {
      state.alert = action.payload
    },
    clearAlert: (state) => {
      state.alert = null
    }
  }
})

export const { showForm, hideForm, setAlert, clearAlert } = uiSlice.actions
export default uiSlice.reducer