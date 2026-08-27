import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { tokenCSS, DEFAULT_THEME } from '../theme/tokens.js'
import { PATIENTS, APPOINTMENTS, PROFESSIONALS, ROOMS } from '../data/demo.js'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [view, setView] = useState('agenda') // agenda | pacientes | expediente
  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agora-theme')) || DEFAULT_THEME } catch { return DEFAULT_THEME }
  })
  const [specialty, setSpecialty] = useState('medicina')
  const [patients, setPatients] = useState(PATIENTS)
  const [appointments, setAppointments] = useState(APPOINTMENTS)
  const [professionals] = useState(PROFESSIONALS)
  const [rooms] = useState(ROOMS)
  // expediente
  const [openPatientId, setOpenPatientId] = useState(null)
  const [recordTab, setRecordTab] = useState('resumen')
  const [consultDraft, setConsultDraft] = useState(null)
  // quick view cita
  const [quickView, setQuickView] = useState(null)
  // toasts
  const [toasts, setToasts] = useState([])

  // Apply theme tokens
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    const tokens = tokenCSS[theme] || tokenCSS[DEFAULT_THEME]
    Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v))
    try { localStorage.setItem('agora-theme', JSON.stringify(theme)) } catch {}
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'magic-frames' ? '#0B1020' : theme === 'talenta' ? '#EEF2F7' : '#F4F5F7')
  }, [theme])

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const openExpediente = useCallback((patientId, tab = 'resumen', consult = null) => {
    setOpenPatientId(patientId)
    setRecordTab(tab)
    setConsultDraft(consult)
    setView('expediente')
  }, [])

  const patientById = useCallback((id) => patients.find((p) => p.id === id), [patients])

  return (
    <AppCtx.Provider value={{
      view, setView,
      theme, setTheme, specialty, setSpecialty,
      patients, setPatients, patientById,
      appointments, setAppointments,
      professionals, rooms,
      openPatientId, recordTab, setRecordTab, consultDraft, setConsultDraft,
      openExpediente,
      quickView, setQuickView,
      toasts, toast,
    }}>
      {children}
    </AppCtx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}