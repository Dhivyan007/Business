import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Vehicles from './pages/Vehicles';
import Reports from './pages/Reports';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/expenses', label: '💸 Expenses' },
    { to: '/products', label: '📦 Products' },
    { to: '/sales', label: '🧾 Sales' },
    { to: '/vehicles', label: '🚛 Vehicles' },
    { to: '/reports', label: '📊 Reports' },
  ];

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Mobile Navbar Header */}
      <header className="navbar navbar-dark bg-dark border-bottom border-secondary d-lg-none px-3 fixed-top" style={{ height: '60px', zIndex: 1010 }}>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <span className="navbar-brand fw-bold fs-6 ms-2">📦 Export Command</span>
        <div className="ms-auto d-flex align-items-center">
          <span className="cyber-glow-indicator active" />
          <span className="text-success small fw-semibold d-none d-sm-inline">ONLINE</span>
        </div>
      </header>

      {/* Sidebar Nav */}
      <div className={`cyber-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="d-flex align-items-center mb-4 px-2">
          <span className="fs-4 me-2">⚙️</span>
          <div>
            <div className="fw-bold text-white small" style={{ letterSpacing: '1px' }}>EXPORT CONTROL</div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>SYSTEM DESK v1.0</div>
          </div>
        </div>
        
        <div className="text-muted small fw-bold mb-2 px-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>NAVIGATION</div>
        
        <nav className="flex-grow-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto border-top border-secondary pt-3 px-2">
          <div className="d-flex align-items-center text-muted small mb-2">
            <span className="cyber-glow-indicator active" />
            <span style={{ fontSize: '0.75rem' }}>Command Console Secure</span>
          </div>
          <button 
            onClick={logout}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center py-2"
            style={{ 
              borderColor: 'rgba(244, 63, 94, 0.3)',
              color: '#f43f5e', 
              backgroundColor: 'rgba(244, 63, 94, 0.05)',
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            🔓 TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* Overlay for mobile drawer */}
      {menuOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="cyber-main-content flex-grow-1">
        <main className="container-fluid p-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="text-center text-muted mt-5 pt-3 border-top border-secondary small">
          Export Business Manager © {new Date().getFullYear()} — Secure Command Terminal
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;