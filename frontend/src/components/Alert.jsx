import React, { useEffect } from 'react'
import { Alert as BSAlert } from 'react-bootstrap'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { clearAlert } from '../store/slices/uiSlice'

const Alert = () => {
  const dispatch = useDispatch()
  const alert = useSelector(state => state.ui.alert)

  useEffect(() => {
    if (alert?.message) {
      const timer = setTimeout(() => {
        dispatch(clearAlert())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert, dispatch])

  if (!alert || !alert.message) return null

  const variant = alert.type === 'success' ? 'success' : 'danger'
  const Icon = alert.type === 'success' ? FaCheckCircle : FaExclamationCircle

  return (
    <BSAlert 
      variant={variant} 
      className="fade-in-up d-flex align-items-center justify-content-between"
      onClose={() => dispatch(clearAlert())}
      dismissible
    >
      <div className="d-flex align-items-center">
        <Icon className="me-2" />
        <span>{alert.message}</span>
      </div>
    </BSAlert>
  )
}

export default Alert