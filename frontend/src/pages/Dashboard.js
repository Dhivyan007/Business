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
      backgroundColor: 'rgba(0, 240, 255, 0.85)',
      borderColor: '#00f0ff',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const pieData = {
    labels: expensesByCategory.map((e) => e[0]),
    datasets: [{
      data: expensesByCategory.map((e) => e[1]),
      backgroundColor: ['#00f0ff', '#ff007f', '#ff7b00', '#00ff87', '#9d4edd', '#0d9488', '#475569'],
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    }],
  };

  const profit = data?.monthProfit || 0;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Outfit' } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Outfit' } },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit', size: 11 },
        },
      },
    },
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold text-cyan">Dashboard — This Month</h4>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Revenue', value: data?.monthRevenue, color: 'success', textColor: 'emerald', icon: '📈' },
          { label: 'Expenses', value: data?.monthExpenses, color: 'danger', textColor: 'pink', icon: '📉' },
          { label: 'Net Profit', value: profit, color: profit >= 0 ? 'primary' : 'warning', textColor: profit >= 0 ? 'cyan' : 'orange', icon: '💰' },
        ].map(({ label, value, color, textColor, icon }) => (
          <div className="col-md-4" key={label}>
            <div className={`card border-${color} shadow-sm h-100`}>
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>{label}</div>
                    <div className={`fs-4 fw-bold text-${textColor}`}>{formatCurrency(value)}</div>
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
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title fw-bold text-cyan mb-3">Revenue by Product</h6>
              {revenueByProduct.length > 0
                ? <Bar data={barData} options={chartOptions} />
                : <p className="text-muted">No sales data yet</p>}
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title fw-bold text-cyan mb-3">Expenses by Category</h6>
              {expensesByCategory.length > 0
                ? <Pie data={pieData} options={pieOptions} />
                : <p className="text-muted">No expense data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
