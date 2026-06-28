import React, { useEffect, useState } from 'react';
import {
  getVehicles, createVehicle, updateVehicle, deleteVehicle,
  getVehicleLogs, createVehicleLog, deleteVehicleLog, getActiveVehicles,
} from '../api/services';
import { toArray, formatCurrency, formatDate, VEHICLE_TYPES, VEHICLE_STATUSES, VEHICLE_LOG_TYPES, today } from '../utils/helpers';

const EMPTY_VEHICLE = { name: '', registrationNumber: '', type: 'TRUCK', model: '', year: '', status: 'ACTIVE', notes: '' };
const EMPTY_LOG = { vehicle: { id: '' }, type: 'FUEL', amount: '', date: today(), litres: '', odometer: '', maintenanceType: '', notes: '' };

export default function Vehicles() {
  const [tab, setTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_VEHICLE);
  const [logForm, setLogForm] = useState(EMPTY_LOG);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = () => {
    setLoading(true);
    Promise.all([getVehicles(), getActiveVehicles()])
      .then(([vRes, aRes]) => {
        setVehicles(toArray(vRes.data));
        setActiveVehicles(Array.isArray(aRes.data) ? aRes.data : []);
      })
      .catch(() => setError('Failed to load vehicles'))
      .finally(() => setLoading(false));
  };

  const fetchLogs = () => {
    setLoading(true);
    getVehicleLogs()
      .then((res) => setLogs(toArray(res.data)))
      .catch(() => setError('Failed to load logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVehicles(); }, []);
  useEffect(() => { if (tab === 'logs') fetchLogs(); }, [tab]);

  const handleVehicleSubmit = async () => {
    if (!form.name || !form.registrationNumber) { setError('Name and registration are required'); return; }
    try {
      if (editId) { await updateVehicle(editId, form); }
      else { await createVehicle(form); }
      setShowModal(false); setError(''); fetchVehicles();
    } catch { setError('Failed to save vehicle'); }
  };

  const handleLogSubmit = async () => {
    if (!logForm.vehicle.id || !logForm.amount || !logForm.date) { setError('Vehicle, amount, and date are required'); return; }
    try {
      await createVehicleLog({ ...logForm, vehicle: { id: parseInt(logForm.vehicle.id) } });
      setShowLogModal(false); setError(''); fetchLogs();
    } catch { setError('Failed to save log'); }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteVehicle(id); fetchVehicles(); }
    catch { setError('Failed to delete'); }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this log?')) return;
    try { await deleteVehicleLog(id); fetchLogs(); }
    catch { setError('Failed to delete'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-cyan">🚛 Vehicles & Fuel</h4>
        <div>
          {tab === 'vehicles'
            ? <button className="btn btn-primary" onClick={() => { setForm(EMPTY_VEHICLE); setEditId(null); setShowModal(true); }}>+ Add Vehicle</button>
            : <button className="btn btn-primary" onClick={() => { setLogForm(EMPTY_LOG); setShowLogModal(true); }}>+ Add Log</button>}
        </div>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}<button className="btn-close" onClick={() => setError('')} /></div>}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab === 'vehicles' ? 'active' : ''}`} onClick={() => setTab('vehicles')}>Vehicles</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === 'logs' ? 'active' : ''}`} onClick={() => setTab('logs')}>Fuel & Maintenance Logs</button></li>
      </ul>

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : tab === 'vehicles' ? (
        <div className="row g-3">
          {vehicles.length === 0
            ? <p className="text-muted">No vehicles found</p>
            : vehicles.map((v) => (
              <div className="col-md-4" key={v.id}>
                <div className={`card border-${v.status === 'ACTIVE' ? 'success' : v.status === 'MAINTENANCE' ? 'warning' : 'secondary'} shadow-sm h-100`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="fw-bold mb-0 text-cyan">{v.name}</h6>
                      <span className={`badge bg-${v.status === 'ACTIVE' ? 'success' : v.status === 'MAINTENANCE' ? 'warning' : 'secondary'}`}>{v.status}</span>
                    </div>
                    <p className="text-muted small mb-1">Reg: {v.registrationNumber}</p>
                    <p className="text-muted small mb-1">Type: {v.type} | {v.model} {v.year}</p>
                    {v.notes && <p className="text-muted small mt-2">{v.notes}</p>}
                  </div>
                  <div className="card-footer d-flex gap-2 bg-transparent border-0 pt-0 pb-3">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => { setForm({ ...v, year: v.year?.toString() || '' }); setEditId(v.id); setShowModal(true); }}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteVehicle(v.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>Date</th><th>Vehicle</th><th>Type</th><th className="text-end">Amount</th><th>Litres</th><th>KM</th><th>Notes</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {logs.length === 0
                  ? <tr><td colSpan={8} className="text-center text-muted py-4">No logs found</td></tr>
                  : logs.map((l) => (
                    <tr key={l.id}>
                      <td>{formatDate(l.date)}</td>
                      <td>{l.vehicle?.name}</td>
                      <td><span className="badge bg-secondary">{l.type}</span></td>
                      <td className="text-end fw-bold text-pink">{formatCurrency(l.amount)}</td>
                      <td>{l.litres || '-'}</td>
                      <td>{l.odometer || '-'}</td>
                      <td className="small text-muted">{l.notes || '-'}</td>
                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLog(l.id)}>Delete</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {[
                  { label: 'Vehicle Name *', key: 'name', type: 'text' },
                  { label: 'Registration Number *', key: 'registrationNumber', type: 'text' },
                  { label: 'Model', key: 'model', type: 'text' },
                  { label: 'Year', key: 'year', type: 'number' },
                  { label: 'Notes', key: 'notes', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {VEHICLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleVehicleSubmit}>{editId ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Vehicle Log</h5>
                <button className="btn-close" onClick={() => setShowLogModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Vehicle *</label>
                  <select className="form-select" value={logForm.vehicle.id}
                    onChange={(e) => setLogForm({ ...logForm, vehicle: { id: e.target.value } })}>
                    <option value="">-- Select Vehicle --</option>
                    {activeVehicles.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Type *</label>
                  <select className="form-select" value={logForm.type}
                    onChange={(e) => setLogForm({ ...logForm, type: e.target.value })}>
                    {VEHICLE_LOG_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {[
                  { label: 'Amount (₹) *', key: 'amount', type: 'number' },
                  { label: 'Date *', key: 'date', type: 'date' },
                  { label: 'Litres (fuel only)', key: 'litres', type: 'number' },
                  { label: 'Odometer (KM)', key: 'odometer', type: 'number' },
                  { label: 'Notes', key: 'notes', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={logForm[key]}
                      onChange={(e) => setLogForm({ ...logForm, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleLogSubmit}>Save Log</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
