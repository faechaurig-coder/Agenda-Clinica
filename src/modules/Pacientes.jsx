import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../icons/Icons.jsx'
import { Avatar, Badge, EmptyState } from '../components/ui.jsx'
import NewPatientModal from './NewPatientModal.jsx'

const FILTERS = ['Todos', 'Activos', 'Inactivos', 'Nuevos', 'Con próxima cita', 'Sin próxima cita', 'Última atención']

export default function Pacientes() {
  const { patients, openExpediente } = useApp()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [newOpen, setNewOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = patients
    if (filter === 'Activos') list = list.filter((p) => p.status === 'Activo')
    if (filter === 'Inactivos') list = list.filter((p) => p.status !== 'Activo')
    if (filter === 'Nuevos') list = list.slice().sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 5)
    if (filter === 'Con próxima cita') list = list.filter((p) => p.nextAppointment)
    if (filter === 'Sin próxima cita') list = list.filter((p) => !p.nextAppointment)
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(s) ||
        p.phone.toLowerCase().includes(s) ||
        p.email.toLowerCase().includes(s) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(s))
      )
    }
    return list
  }, [patients, q, filter])

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1>Pacientes</h1>
          <div className="sub">{patients.length} en tu base · motor configurable por especialidad</div>
        </div>
        <div className="header-actions">
          <div className="topbar-search" style={{ maxWidth: 340 }}>
            <Icon name="search" size={17} />
            <input placeholder="Buscar nombre, teléfono, etiqueta…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar paciente" />
            {q && <Icon name="x" size={15} onClick={() => setQ('')} style={{ cursor: 'pointer' }} />}
          </div>
          <button className="btn btn-primary" onClick={() => setNewOpen(true)}><Icon name="plus" size={17} />Nuevo paciente</button>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'Con próxima cita' && <Icon name="calendar" size={13} />}
            {f === 'Sin próxima cita' && <Icon name="clock" size={13} />}
            {f === 'Última atención' && <Icon name="activity" size={13} />}
            {f}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Última consulta</th>
                <th>Próxima cita</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7}><EmptyState icon="users" title="Sin resultados" sub={q ? `Nada encontrado para «${q}» con filtro ${filter}.` : 'No hay pacientes en esta vista.'} /></td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => openExpediente(p.id, 'resumen')}>
                  <td>
                    <div className="row">
                      <Avatar name={p.name} size={42} />
                      <div>
                        <div className="td-strong">{p.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {p.tags?.map((t) => <span key={t} style={{ color: 'var(--accent)', marginRight: 6 }}>#{t}</span>)}
                          {p.sex}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Edad">{p.age}</td>
                  <td data-label="Teléfono">{p.phone}</td>
                  <td data-label="Última consulta">{fmtDay(p.lastConsult)}</td>
                  <td data-label="Próxima cita">{p.nextAppointment ? fmtDay(p.nextAppointment) : <span className="muted">—</span>}</td>
                  <td data-label="Estado"><Badge tone={p.alerts?.length ? 'danger' : 'ok'}>{p.alerts?.length ? `⚠ ${p.alerts.length}` : 'Activo'}</Badge></td>
                  <td className="muted"><Icon name="chevR" size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {newOpen && <NewPatientModal open onClose={() => setNewOpen(false)} />}
    </div>
  )
}

function fmtDay(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T00:00')
  return dt.toLocaleDateString('es', { day: '2-digit', month: 'short' }).toUpperCase()
}