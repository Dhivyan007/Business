import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api/services';
import { formatCurrency } from '../utils/helpers';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const revenueByProduct = data?.revenueByProduct || [];
  const expensesByCategory = data?.expensesByCategory || [];

  const barData = {
    labels: revenueByProduct.map((r) => r[0]),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenueByProduct.map((r) => r[1]),
      backgroundColor: '#0d6efd',
    }],
  };

  const pieData = {
    labels: expensesByCategory.map((e) => e[0]),
    datasets: [{
      data: expensesByCategory.map((e) => e[1]),
      backgroundColor: ['#0d6efd','#dc3545','#ffc107','#198754','#6c757d','#0dcaf0','#fd7e14'],
    }],
  };

  const profit = data?.monthProfit || 0;

  return (
    <div>
      <h4 className="mb-4 fw-bold">Dashboard — This Month</h4>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Revenue', value: data?.monthRevenue, color: 'success', icon: '📈' },
          { label: 'Expenses', value: data?.monthExpenses, color: 'danger', icon: '📉' },
          { label: 'Net Profit', value: profit, color: profit >= 0 ? 'primary' : 'warning', icon: '💰' },
        ].map(({ label, value, color, icon }) => (
          <div className="col-md-4" key={label}>
            <div className={`card border-${color} shadow-sm`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">{label}</div>
                    <div className={`fs-4 fw-bold text-${color}`}>{formatCurrency(value)}</div>
                  </div>
                  <span className="fs-2">{icon}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3">
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Revenue by Product</h6>
              {revenueByProduct.length > 0
                ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                : <p className="text-muted">No sales data yet</p>}
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Expenses by Category</h6>
              {expensesByCategory.length > 0
                ? <Pie data={pieData} options={{ responsive: true }} />
                : <p className="text-muted">No expense data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
