import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/services';
import { toArray, formatCurrency, UNITS } from '../utils/helpers';

const EMPTY = { name: '', description: '', unit: 'KG', buyPrice: '', sellPrice: '', stockQuantity: '', category: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = (p = 0) => {
    setLoading(true);
    getProducts(p)
      .then((res) => {
        setProducts(toArray(res.data));
        setTotalPages(res.data?.totalPages || 1);
        setPage(p);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, buyPrice: p.buyPrice.toString(), sellPrice: p.sellPrice.toString(), stockQuantity: p.stockQuantity.toString() });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.buyPrice || !form.sellPrice || !form.stockQuantity) {
      setError('Please fill all required fields'); return;
    }
    try {
      if (editId) { await updateProduct(editId, form); }
      else { await createProduct(form); }
      setShowModal(false); setError(''); fetchProducts(page);
    } catch { setError('Failed to save product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); fetchProducts(page); }
    catch { setError('Failed to delete'); }
  };

  const profit = (p) => ((p.sellPrice - p.buyPrice) / p.buyPrice * 100).toFixed(1);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">📦 Products & Prices</h4>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}
        <button className="btn-close" onClick={() => setError('')} /></div>}

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th><th>Unit</th><th>Category</th>
                  <th className="text-end">Buy Price</th>
                  <th className="text-end">Sell Price</th>
                  <th className="text-end">Margin</th>
                  <th className="text-end">Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0
                  ? <tr><td colSpan={8} className="text-center text-muted py-4">No products found</td></tr>
                  : products.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold">{p.name}</td>
                      <td>{p.unit}</td>
                      <td>{p.category || '-'}</td>
                      <td className="text-end">{formatCurrency(p.buyPrice)}</td>
                      <td className="text-end text-success fw-bold">{formatCurrency(p.sellPrice)}</td>
                      <td className="text-end">
                        <span className="badge bg-info text-dark">{profit(p)}%</span>
                      </td>
                      <td className="text-end">
                        <span className={`badge ${p.stockQuantity < 10 ? 'bg-danger' : 'bg-success'}`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => fetchProducts(page - 1)}>Prev</button>
              <span className="align-self-center small">Page {page + 1} of {totalPages}</span>
              <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => fetchProducts(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit Product' : 'Add Product'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {[
                  { label: 'Product Name *', key: 'name', type: 'text' },
                  { label: 'Category', key: 'category', type: 'text' },
                  { label: 'Buy Price (₹) *', key: 'buyPrice', type: 'number' },
                  { label: 'Sell Price (₹) *', key: 'sellPrice', type: 'number' },
                  { label: 'Stock Quantity *', key: 'stockQuantity', type: 'number' },
                  { label: 'Description', key: 'description', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Unit *</label>
                  <select className="form-select" value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>{editId ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
