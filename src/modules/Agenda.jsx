import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { consultTypeById } from '../data/specialties.js'
import QuickView from './QuickView.jsx'
import AppointmentModal from './AppointmentModal.jsx'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 07:00 → 20:00
const DAYS_PT = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function startOfWeek(d) {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Lunes = 0
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function pad(n) { return String(n).padStart(2, '0') }
function iso(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

export default function Agenda() {
  const { appointments, patientById, setQuickView, openExpediente, professionals } = useApp()
  const [today] = useState(() => new Date())
  const [anchor, setAnchor] = useState(new Date())
  const [viewType, setViewType] = useState('week') // week | day | month
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const weekStart = startOfWeek(anchor)
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const byDay = useMemo(() => {
    const map = {}
    appointments.forEach((a) => {
      const key = a.date
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.time.localeCompare(b.time)))
    return map
  }, [appointments])

  const todayIso = iso(today)

  function move(dir) { setAnchor(addDays(weekStart, dir * 7)) }
  function goToday() { setAnchor(new Date()) }
  function openQuick(e, appt) {
    const rect = e.currentTarget.getBoundingClientRect()
    setQuickView({ appt, x: Math.min(rect.right - 180, window.innerWidth - 400), y: rect.bottom + 8 })
  }

  const dateLabel = viewType === 'week'
    ? `${weekDays[0].toLocaleDateString('es', { day: 'numeric', month: 'short' })} — ${weekDays[6].toLocaleDateString('es', { day: 'numeric', month: 'long' })}`
    : anchor.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1>Agenda</h1>
          <div className="sub row" style={{ marginTop: 4 }}>
            <Icon name="calendar" size={15} />
            <span style={{ textTransform: 'capitalize' }}>{dateLabel}</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="seg" aria-label="Vista">
            <button className={viewType === 'week' ? 'active' : ''} onClick={() => setViewType('week')}>Semana</button>
            <button className={viewType === 'day' ? 'active' : ''} onClick={() => setViewType('day')}>Día</button>
            <button className={viewType === 'month' ? 'active' : ''} onClick={() => setViewType('month')}>Mes</button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={goToday}><Icon name="refresh" size={15} />Hoy</button>
          <div className="seg">
            <button onClick={() => move(-1)} aria-label="Semana anterior"><Icon name="chevL" size={16} /></button>
            <button onClick={() => move(1)} aria-label="Semana siguiente"><Icon name="chevR" size={16} /></button>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setCreateOpen(true) }}>
            <Icon name="plus" size={17} />Nueva cita
          </button>
        </div>
      </div>

      {viewType === 'week' && (
        <WeekGrid days={weekDays} byDay={byDay} patientById={patientById} onOpen={openQuick} todayIso={todayIso} />
      )}
      {viewType === 'day' && (
        <DayGrid day={anchor} byDay={byDay} patientById={patientById} onOpen={openQuick} todayIso={todayIso} />
      )}
      {viewType === 'month' && (
        <MonthGrid anchor={anchor} byDay={byDay} patientById={patientById} onOpen={(a) => setQuickView({ appt: a, x: 120, y: 160 })} setAnchor={setAnchor} setViewType={setViewType} todayIso={todayIso} />
      )}

      <QuickView onEdit={(a) => { setEditing(a); setQuickView(null); setCreateOpen(true) }} />

      {createOpen && (
        <AppointmentModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          editing={editing}
          defaultDate={viewType === 'day' ? iso(anchor) : iso(today)}
          professionals={professionals}
        />
      )}
    </div>
  )
}

/* ===================== WEEK ===================== */
function WeekGrid({ days, byDay, patientById, onOpen, todayIso }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="week-grid" style={{
        display: 'grid',
        gridTemplateColumns: '64px repeat(7, 1fr)',
        maxHeight: 'calc(100vh - 220px)', overflowY: 'auto',
      }}>
        {/* header */}
        <div />
        {days.map((d) => {
          const isToday = iso(d) === todayIso
          return (
            <div key={iso(d)} style={{ textAlign: 'center', padding: '14px 4px 10px', borderBottom: '1px solid var(--border)' }}>
              <div className="ui-label">{DAYS_PT[d.getDay()]}</div>
              <div style={{
                width: 34, height: 34, margin: '4px auto 0', borderRadius: '50%', display: 'grid', placeItems: 'center',
                fontWeight: 700, fontSize: 15,
                background: isToday ? 'var(--accent)' : 'transparent',
                color: isToday ? 'var(--text-on-accent)' : 'var(--text-1)',
                boxShadow: isToday ? 'var(--accent-glow)' : 'none',
              }}>{d.getDate()}</div>
            </div>
          )
        })}

        {/* time column + slots */}
        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div className="mono" style={{
              padding: '8px 10px 0 0', textAlign: 'right', fontSize: 11, color: 'var(--text-3)',
              transform: 'translateY(-8px)',
            }}>{pad(h)}:00</div>
            {days.map((d) => {
              const dateIso = iso(d)
              const isToday = dateIso === todayIso
              const appts = (byDay[dateIso] || []).filter((a) => h >= usedStart(a) && h < usedEnd(a))
              return (
                <div key={dateIso + h} style={{
                  borderLeft: '1px solid var(--border)',
                  borderTop: '1px solid var(--border)',
                  minHeight: 56,
                  background: isToday ? 'var(--bg-surface-sunk)' : 'transparent',
                  position: 'relative',
                }}>
                  {appts.map((a) => (
                    <ApptBlock key={a.id} a={a} patient={patientById(a.patientId)} onOpen={(e) => onOpen(e, a)} />
                  ))}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function usedStart(a) { return parseInt(a.time.split(':')[0], 10) }
function usedEnd(a) { return usedStart(a) + Math.ceil(a.duration / 60) }

function ApptBlock({ a, patient, onOpen }) {
  const t = consultTypeById(a.type)
  const c = a.overrideColor || t.color
  return (
    <button
      className="appt-block"
      onClick={onOpen}
      style={{
        position: 'absolute', left: 3, right: 3, top: 3,
        borderRadius: 10, padding: '6px 8px', textAlign: 'left', cursor: 'pointer',
        background: `linear-gradient(135deg, ${c}30, ${c}18)`,
        border: `1px solid ${c}66`,
        borderLeft: `3px solid ${c}`,
        color: 'var(--text-1)',
        minHeight: 44,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)' }}>{a.time}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {patient ? patient.name : 'Paciente'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
        <span style={{ fontSize: 10.5, color: 'var(--text-2)' }}>{t.label}</span>
      </div>
    </button>
  )
}

/* ===================== DAY ===================== */
function DayGrid({ day, byDay, patientById, onOpen, todayIso }) {
  const dateIso = iso(day)
  const appts = (byDay[dateIso] || []).slice()
  appts.sort((a, b) => a.time.localeCompare(b.time))
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {appts.length === 0 && (
          <div className="muted" style={{ textAlign: 'center', padding: 40 }}>Sin citas este día.</div>
        )}
        {appts.map((a) => {
          const p = patientById(a.patientId)
          const t = consultTypeById(a.type)
          const c = a.overrideColor || t.color
          return (
            <button key={a.id} className="btn" onClick={(e) => onOpen(e, a)} style={{ justifyContent: 'flex-start', padding: 14, borderLeft: `4px solid ${c}` }}>
              <span className="mono bold" style={{ color: c, minWidth: 44 }}>{a.time}</span>
              <span className="bold">{p?.name}</span>
              <span className="muted" style={{ fontSize: 13 }}>· {t.label}</span>
              <span style={{ marginLeft: 'auto' }}><Badge2 status={a.status} /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Badge2({ status }) {
  const tones = {
    'Pendiente': 'muted', 'Confirmada': 'accent', 'Llegó': 'warn',
    'En consulta': 'ok', 'Finalizada': 'plain', 'Cancelada': 'danger', 'No asistió': 'danger',
  }
  const tone = tones[status] || 'plain'
  return <span className={`badge badge-${tone}`}><span className="seed" />{status}</span>
}

/* ===================== MONTH ===================== */
function MonthGrid({ anchor, byDay, patientById, onOpen, setAnchor, setViewType, todayIso }) {
  const mStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const firstDow = (mStart.getDay() + 6) % 7
  const start = addDays(mStart, -firstDow)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const mLabel = anchor.toLocaleDateString('es', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="row between" style={{ marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'capitalize' }}>{mLabel}</h2>
        <div className="seg">
          <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}><Icon name="chevL" size={16} /></button>
          <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}><Icon name="chevR" size={16} /></button>
        </div>
      </div>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
            <div key={d} className="ui-label" style={{ textAlign: 'center', padding: 6 }}>{d}</div>
          ))}
          {cells.map((d) => {
            const iso = dStr(d)
            const inMonth = d.getMonth() === anchor.getMonth()
            const isToday = iso === todayIso
            const list = byDay[iso] || []
            return (
              <button
                key={iso}
                onClick={() => { setAnchor(d); setViewType('day') }}
                style={{
                  minHeight: 78, borderRadius: 12, padding: 6, textAlign: 'left', cursor: 'pointer',
                  border: isToday ? '1.5px solid var(--accent)' : '1px solid transparent',
                  background: inMonth ? 'var(--bg-surface-sunk)' : 'transparent',
                  opacity: inMonth ? 1 : 0.4,
                  display: 'flex', flexDirection: 'column', gap: 3,
                }}
              >
                <div className="mono bold" style={{ color: inMonth ? 'var(--text-1)' : 'var(--text-3)', marginLeft: 2 }}>{d.getDate()}</div>
                {list.slice(0, 3).map((a) => {
                  const t = consultTypeById(a.type)
                  return (
                    <div key={a.id} style={{ fontSize: 10, padding: '2px 5px', borderRadius: 5, background: `color-mix(in srgb, ${t.color} 25%, transparent)`, color: t.color, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {a.time} {patientById(a.patientId)?.name.split(' ')[0]}
                    </div>
                  )
                })}
                {list.length > 3 && <div className="muted" style={{ fontSize: 10 }}>+{list.length - 3} más</div>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
function dStr(d) { return iso(d) }