import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider, useApp } from './context/AppContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AppShell from './components/AppShell.jsx'
import Agenda from './modules/Agenda.jsx'
import Pacientes from './modules/Pacientes.jsx'
import Expediente from './modules/Expediente.jsx'
import Icon from './icons/Icons.jsx'
import './styles/global.css'

function Router() {
  const { view, toasts } = useApp()
  return (
    <AppShell>
      {view === 'agenda' && <Agenda />}
      {view === 'pacientes' && <Pacientes />}
      {view === 'expediente' && <Expediente />}

      {/* Toasts */}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>
            <span className="t-ico">{t.kind === 'danger' ? <Icon name="alert" size={16} /> : <Icon name="checkCircle" size={16} />}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </AppShell>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <Router />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
)