'use client'

import { createContext, useContext, useState } from 'react'

type AlertType = 'success' | 'error' | null

type AlertContextType = {
  alert: string | null
  alertType: AlertType
  setAlert: (msg: string | null) => void
  setAlertType: (type: AlertType) => void
}

const AlertContext = createContext<AlertContextType | null>(null)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<AlertType>(null)

  return (
    <AlertContext.Provider value={{ alert, alertType, setAlert, setAlertType }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within AlertProvider')
  return context
}
