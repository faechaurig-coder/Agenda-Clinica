import { consultTypeById } from '../data/specialties.js'

export const APPT_STATUS_META = {
  'Pendiente': { tone: 'muted', dot: '#9CA3AF' },
  'Confirmada': { tone: 'accent', dot: '#6EA8FF' },
  'Llegó': { tone: 'warn', dot: '#FFC24B' },
  'En consulta': { tone: 'ok', dot: '#2EE6A8' },
  'Finalizada': { tone: 'plain', dot: '#7C83A6' },
  'Cancelada': { tone: 'danger', dot: '#FF6B7A' },
  'No asistió': { tone: 'danger', dot: '#FF6B7A' },
}

export function statusMeta(status) {
  return APPT_STATUS_META[status] || APPT_STATUS_META['Pendiente']
}

export function apptColor(a) {
  return a.overrideColor || (consultTypeById(a.type)?.color)
}

export function apptStartHour(a) {
  return parseInt(a.time.split(':')[0], 10)
}
export function apptEndHour(a) {
  return apptStartHour(a) + Math.ceil(a.duration / 60)
}
export function nowIso() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}