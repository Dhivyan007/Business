import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Vehicles from './pages/Vehicles';
import Reports from './pages/Reports';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/expenses', label: '💸 Expenses' },
    { to: '/products', label: '📦 Products' },
    { to: '/sales', label: '🧾 Sales' },
    { to: '/vehicles', label: '🚛 Vehicles' },
    { to: '/reports', label: '📊 Reports' },
  ];

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-dark bg-primary px-3">
          <span className="navbar-brand fw-bold">📦 Export Business Manager</span>
          <button
            className="navbar-toggler border-white"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div
              className="w-100 mt-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.3)' }}
            >
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `d-block py-2 px-3 text-decoration-none fw-semibold ${isActive
                      ? 'bg-white text-primary rounded'
                      : 'text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Desktop horizontal nav (hidden on mobile) */}
        <div className="bg-primary d-none d-lg-flex px-3 pb-2 gap-2">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link px-3 py-1 rounded ${isActive ? 'bg-white text-primary fw-bold' : 'text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-grow-1 bg-light p-3">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

        <footer className="text-center text-muted py-2 border-top bg-white small">
          Export Business Manager © {new Date().getFullYear()}
        </footer>
      </div>
    </Router>
  );
}

export default App;