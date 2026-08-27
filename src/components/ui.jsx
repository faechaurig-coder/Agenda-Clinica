import React, { useEffect } from 'react'
import Icon from '../icons/Icons.jsx'

export function Avatar({ name, size = 40, color, initials }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) }
  if (color) style.background = color
  let ini = initials
  if (!ini) {
    ini = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  }
  return (
    <div className="p-avatar" style={style} aria-hidden="true">
      <span className="initials">{ini}</span>
    </div>
  )
}

export function Badge({ color, tone = 'plain', className = '', children }) {
  const style = color ? { color, backgroundColor: null, border: `1px solid ${color}55`, background: `${color}22` } : {}
  let cls = 'badge badge-' + tone
  return (
    <span className={`${cls} ${className}`} style={style}>
      <span className="seed" />
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children, wide, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={`modal-overlay open`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { maxWidth: 860 } : {}} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {title}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, req, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}{req && <span className="req"> *</span>}</label>
      {children}
    </div>
  )
}

// Mini SVG line chart
export function Spark({ points, width = 260, height = 64, stroke, fill, label }) {
  if (!points || points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)
  const coords = points.map((p, i) => [i * step, height - ((p - min) / range) * (height - 8) - 4])
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  return (
    <svg className="spark" width="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: width }} role="img" aria-label={label} preserveAspectRatio="none">
      {fill && <path d={area} fill={fill} />}
      <path d={line} fill="none" stroke={stroke || 'var(--accent)'} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {coords.slice(1, -1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={stroke || 'var(--accent)'} />
      ))}
    </svg>
  )
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-3)' }}>
      <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}>
        <div className="card" style={{ padding: 16, borderRadius: 18, display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={30} />
        </div>
      </div>
      <div style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: 16 }}>{title}</div>
      <div style={{ fontSize: 13.5, marginTop: 6, marginBottom: 16, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>{sub}</div>
      {action}
    </div>
  )
}