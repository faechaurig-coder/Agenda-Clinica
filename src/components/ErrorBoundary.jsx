import React from 'react'
import Icon from '../icons/Icons.jsx'

// Una app clínica no debe quedarse en blanco por un error puntual.
// Este límite captura errores de render, los muestra con acción clara
// de recarga y permite continuar sin perder el resto de la aplicación.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err && err.message ? err.message : String(err) }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary capturado:', error, info)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, message: '' })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page" style={{ maxWidth: 520, textAlign: 'center', paddingTop: 80 }}>
          <div className="card" style={{ padding: 40 }}>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <div className="brand-mark" style={{ marginBottom: 18 }}><Icon name="alert" size={26} /></div>
            </div>
            <h2 style={{ marginBottom: 10 }}>Algo salió mal</h2>
            <p className="muted" style={{ fontSize: 14, marginBottom: 22 }}>
              Ocurrió un error inesperado en esta pantalla. Recarga para continuar.
            </p>
            {this.state.message && (
              <div className="card" style={{ background: 'var(--bg-surface-sunk)', fontSize: 12.5, fontFamily: 'var(--font-mono)', wordBreak: 'break-word', color: 'var(--text-2)', marginBottom: 20 }}>
                {this.state.message}
              </div>
            )}
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <Icon name="refresh" size={16} />Recargar aplicación
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}