import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Vehicles from './pages/Vehicles';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
          <span className="navbar-brand fw-bold">📦 Export Business Manager</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-1">
              {[
                { to: '/', label: '🏠 Dashboard' },
                { to: '/expenses', label: '💸 Expenses' },
                { to: '/products', label: '📦 Products' },
                { to: '/sales', label: '🧾 Sales' },
                { to: '/vehicles', label: '🚛 Vehicles' },
                { to: '/reports', label: '📊 Reports' },
              ].map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `nav-link px-3 rounded ${isActive ? 'bg-white text-primary fw-bold' : 'text-white'}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-grow-1 bg-light p-4">
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
