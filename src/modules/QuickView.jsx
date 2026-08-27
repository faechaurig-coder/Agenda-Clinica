import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { consultTypeById } from '../data/specialties.js'
import { statusMeta, apptColor } from './appt.js'

export default function QuickView({ onEdit }) {
  const { quickView, setQuickView, patientById, openExpediente, setAppointments, toast } = useApp()
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  // Posiciona el panel de forma inteligente: siempre cabe dentro del viewport,
  // se despliega hacia arriba/izquierda según el espacio disponible y se
  // corrige al hacer scroll/resize (evita que quede cortado o "atascado").
  useEffect(() => {
    if (!quickView) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const place = () => {
      if (!ref.current) return
      const { offsetWidth: w, offsetHeight: h } = ref.current
      const vw = window.innerWidth, vh = window.innerHeight
      const margin = 10
      const { x, y } = quickView
      let left = Math.round(x)
      let top = Math.round(y)
      // Espacio a la derecha < ancho → flip hacia la izquierda
      if (left + w + margin > vw) left = Math.round(vw - w - margin)
      if (left < margin) left = margin
      // Espacio abajo < alto → flip hacia arriba
      if (top + h + margin > vh) top = Math.round(vh - h - margin)
      if (top < margin) top = margin
      setPos({ left, top })
    }
    raf = requestAnimationFrame(place)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    // Reclampa tras cargar fuentes/estados (altura real puede cambiar)
    const t = setTimeout(place, 200)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place) }
  }, [quickView])

  useEffect(() => {
    if (!quickView) return
    const onKey = (e) => e.key === 'Escape' && setQuickView(null)
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest('.appt-block')) setQuickView(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [quickView, setQuickView])

  if (!quickView) return null
  const { appt } = quickView
  const p = patientById(appt.patientId)
  const t = consultTypeById(appt.type)
  const sm = statusMeta(appt.status)
  const c = apptColor(appt) || t.color

  function startConsult() {
    // FLUJO CENTRAL: cita → paciente → expediente → nueva consulta
    openExpediente(appt.patientId, 'consultas', { date: `${appt.date} ${appt.time}`, type: appt.type, linked: appt.id })
    setQuickView(null)
    toast('Consulta iniciada y vinculada a la cita')
  }

  function changeStatus(next) {
    setAppointments((list) => list.map((a) => (a.id === appt.id ? { ...a, status: next } : a)))
    toast(`Cita → ${next}`)
  }

  function cancel() {
    changeStatus('Cancelada')
    setQuickView(null)
  }

  return (
    <div ref={ref} className="popover-panel" style={pos || { left: 10, top: 10, maxWidth: 370 }}>
      <div className="row" style={{ marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{p?.name}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>{t.label} · {appt.professional}</div>
        </div>
        <Icon name="x" size={18} className="muted" onClick={() => setQuickView(null)} style={{ cursor: 'pointer' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, marginBottom: 12 }}>
        <QuickRow icon="clock" label="Hora"><b style={{ color: c }}>{appt.time}</b> · {appt.duration} min</QuickRow>
        <QuickRow icon="phone" label="Teléfono">{p?.phone}</QuickRow>
        <QuickRow icon="calendar" label="Fecha">{new Date(appt.date + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })}</QuickRow>
        <QuickRow icon="pin" label="Consultorio">{appt.room}</QuickRow>
        {appt.notes && <QuickRow icon="doc" label="Notas">{appt.notes}</QuickRow>}
        <div className="row">
          <span className="ui-label" style={{ width: 90 }}>Estado</span>
          {statusList(appt.status).map((s) => (
            <span key={s}>
              <input
                type="radio" name="qv-status" id={`qv-${s}`} hidden
                onChange={() => changeStatus(s)}
                checked={appt.status === s} style={{ cursor: 'pointer' }}
              />
              <span onClick={() => changeStatus(s)} className="badge badge-plain" style={{ cursor: 'pointer', border: appt.status === s ? `1.5px solid var(--accent)` : undefined, color: appt.status === s ? undefined : 'var(--text-3)' }}>
                {s}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button className="btn btn-sm btn-ghost" onClick={() => openExpediente(appt.patientId, 'resumen')}><Icon name="user" size={14} />Paciente</button>
        <button className="btn btn-sm btn-ghost" onClick={() => openExpediente(appt.patientId, 'consultas')}><Icon name="doc" size={14} />Expediente</button>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }} onClick={startConsult}>
        <Icon name="activity" size={16} />Iniciar consulta
      </button>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <button className="btn btn-sm" onClick={() => onEdit(appt)}><Icon name="edit" size={14} />Editar</button>
        <button className="btn btn-sm btn-danger" onClick={cancel}><Icon name="x" size={14} />Cancelar</button>
      </div>
    </div>
  )
}

function statusList(current) {
  return ['Confirmada', 'Llegó', 'En consulta', 'Finalizada', 'No asistió']
}

function QuickRow({ icon, label, children }) {
  return (
    <div className="row">
      <span style={{ width: 20, color: 'var(--text-3)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={15} /></span>
      <span className="muted" style={{ width: 70, fontSize: 12 }}>{label}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  )
}