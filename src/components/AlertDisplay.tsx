'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { useAlert } from '@/context/AlertContext'
import { useEffect } from 'react'

export default function AlertDisplay() {
  const { alert, alertType, setAlert, setAlertType } = useAlert()

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null)
        setAlertType(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [alert, setAlert, setAlertType])

  if (!alert) return null

  return (
    <Alert
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-1/3 z-50 shadow-md bg-white text-center border-2 ${
        alertType === 'success'
          ? 'border-blue-500 text-blue-500'
          : 'border-red-500 text-red-500'
      }`}
    >
      <AlertTitle>{alert}</AlertTitle>
    </Alert>
  )
}
