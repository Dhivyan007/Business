import React, { useEffect, useState } from 'react';
import { getSales, createSale, deleteSale, getProducts } from '../api/services';
import { toArray, formatCurrency, formatDate, today, SALE_STATUSES } from '../utils/helpers';

const EMPTY = { product: { id: '' }, customerName: '', customerContact: '', quantity: '', unitPrice: '', saleDate: today(), status: 'COMPLETED', notes: '' };

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSales = (p = 0) => {
    setLoading(true);
    getSales(p)
      .then((res) => { setSales(toArray(res.data)); setTotalPages(res.data?.totalPages || 1); setPage(p); })
      .catch(() => setError('Failed to load sales'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
    getProducts(0, 100).then((res) => setProducts(toArray(res.data)));
  }, []);

  // Auto-fill unit price when product is selected
  const handleProductChange = (productId) => {
    const selected = products.find((p) => p.id.toString() === productId);
    setForm((f) => ({
      ...f,
      product: { id: productId },
      unitPrice: selected ? selected.sellPrice.toString() : '',
    }));
  };

  const handleSubmit = async () => {
    if (!form.product.id || !form.customerName || !form.quantity || !form.unitPrice) {
      setError('Please fill all required fields'); return;
    }
    try {
      await createSale({ ...form, product: { id: parseInt(form.product.id) } });
      setShowModal(false); setError(''); fetchSales(page);
    } catch (e) {
      setError(e.response?.data || 'Failed to save sale');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale?')) return;
    try { await deleteSale(id); fetchSales(page); }
    catch { setError('Failed to delete'); }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">🧾 Sales Records</h4>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setShowModal(true); }}>+ New Sale</button>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}
        <button className="btn-close" onClick={() => setError('')} /></div>}

      <div className="alert alert-info py-2 mb-3">
        Total Revenue (this page): <strong>{formatCurrency(totalRevenue)}</strong>
      </div>

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th><th>Customer</th><th>Product</th>
                  <th className="text-end">Qty</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Total</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0
                  ? <tr><td colSpan={8} className="text-center text-muted py-4">No sales found</td></tr>
                  : sales.map((s) => (
                    <tr key={s.id}>
                      <td>{formatDate(s.saleDate)}</td>
                      <td>{s.customerName}</td>
                      <td>{s.product?.name}</td>
                      <td className="text-end">{s.quantity} {s.product?.unit}</td>
                      <td className="text-end">{formatCurrency(s.unitPrice)}</td>
                      <td className="text-end fw-bold text-success">{formatCurrency(s.totalAmount)}</td>
                      <td><span className={`badge bg-${s.status === 'COMPLETED' ? 'success' : s.status === 'PENDING' ? 'warning' : 'danger'}`}>{s.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => fetchSales(page - 1)}>Prev</button>
              <span className="align-self-center small">Page {page + 1} of {totalPages}</span>
              <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => fetchSales(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Sale</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Product *</label>
                  <select className="form-select" value={form.product.id}
                    onChange={(e) => handleProductChange(e.target.value)}>
                    <option value="">-- Select Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity} {p.unit})</option>
                    ))}
                  </select>
                </div>
                {[
                  { label: 'Customer Name *', key: 'customerName', type: 'text' },
                  { label: 'Customer Contact', key: 'customerContact', type: 'text' },
                  { label: 'Quantity *', key: 'quantity', type: 'number' },
                  { label: 'Unit Price (₹) *', key: 'unitPrice', type: 'number' },
                  { label: 'Sale Date *', key: 'saleDate', type: 'date' },
                ].map(({ label, key, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {SALE_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {form.quantity && form.unitPrice && (
                  <div className="alert alert-success py-2">
                    Total: <strong>{formatCurrency(form.quantity * form.unitPrice)}</strong>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Save Sale</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
