import React, { useEffect, useState } from 'react';
import {
  getExpenses, createExpense, updateExpense, deleteExpense,
} from '../api/services';
import { toArray, formatCurrency, formatDate, EXPENSE_CATEGORIES, today } from '../utils/helpers';

const EMPTY = { description: '', amount: '', date: today(), category: 'OTHER', notes: '' };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchExpenses = (p = 0) => {
    setLoading(true);
    getExpenses(p)
      .then((res) => {
        setExpenses(toArray(res.data));
        setTotalPages(res.data?.totalPages || 1);
        setPage(p);
      })
      .catch(() => setError('Failed to load expenses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExpenses(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (exp) => {
    setForm({ ...exp, amount: exp.amount.toString() });
    setEditId(exp.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.date || !form.category) {
      setError('Please fill all required fields');
      return;
    }
    try {
      if (editId) {
        await updateExpense(editId, form);
      } else {
        await createExpense(form);
      }
      setShowModal(false);
      setError('');
      fetchExpenses(page);
    } catch (e) {
      setError('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchExpenses(page);
    } catch {
      setError('Failed to delete');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-cyan">💸 Expenses</h4>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Expense</button>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">
        {error} <button className="btn-close" onClick={() => setError('')} />
      </div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th><th>Description</th><th>Category</th>
                  <th className="text-end">Amount</th><th>Notes</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No expenses found</td></tr>
                ) : expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td><span className="badge bg-secondary">{exp.category}</span></td>
                    <td className="text-end text-pink fw-bold">{formatCurrency(exp.amount)}</td>
                    <td className="text-muted small">{exp.notes || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(exp)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => fetchExpenses(page - 1)}>Prev</button>
              <span className="align-self-center small">Page {page + 1} of {totalPages}</span>
              <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => fetchExpenses(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit Expense' : 'Add Expense'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {[
                  { label: 'Description *', key: 'description', type: 'text' },
                  { label: 'Amount (₹) *', key: 'amount', type: 'number' },
                  { label: 'Date *', key: 'date', type: 'date' },
                ].map(({ label, key, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={2} value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
