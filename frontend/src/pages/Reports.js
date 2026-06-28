import React, { useState } from 'react';
import { getProfitLoss } from '../api/services';
import { formatCurrency, firstDayOfMonth, today } from '../utils/helpers';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Reports() {
  const [start, setStart] = useState(firstDayOfMonth());
  const [end, setEnd] = useState(today());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = () => {
    if (!start || !end) { setError('Please select a date range'); return; }
    setLoading(true);
    getProfitLoss(start, end)
      .then((res) => { setReport(res.data); setError(''); })
      .catch(() => setError('Failed to load report'))
      .finally(() => setLoading(false));
  };

  const barData = report ? {
    labels: ['Revenue', 'Expenses', 'Vehicle Costs', 'Net Profit'],
    datasets: [{
      label: 'Amount (₹)',
      data: [report.totalRevenue, report.totalExpenses, report.vehicleCosts, report.netProfit],
      backgroundColor: [
        '#00ff87', '#ff007f', '#ff7b00',
        report.netProfit >= 0 ? '#00f0ff' : '#ff007f',
      ],
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      borderRadius: 4,
    }],
  } : null;

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
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Outfit' } },
      },
    },
  };

  return (
    <div>
      <h4 className="fw-bold mb-4 text-cyan">📊 Profit & Loss Report</h4>

      {/* Date range picker */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">From Date</label>
              <input className="form-control" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">To Date</label>
              <input className="form-control" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100" onClick={fetchReport} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {report && (
        <>
          {/* Summary cards */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Revenue', value: report.totalRevenue, color: 'success', textColor: 'emerald', icon: '📈' },
              { label: 'General Expenses', value: report.totalExpenses, color: 'danger', textColor: 'pink', icon: '💸' },
              { label: 'Fuel Cost', value: report.fuelCost, color: 'warning', textColor: 'orange', icon: '⛽' },
              { label: 'Maintenance Cost', value: report.maintenanceCost, color: 'warning', textColor: 'orange', icon: '🔧' },
              { label: 'Total Costs', value: report.totalCosts, color: 'danger', textColor: 'pink', icon: '📉' },
              {
                label: 'Net Profit',
                value: report.netProfit,
                color: report.netProfit >= 0 ? 'primary' : 'danger',
                textColor: report.netProfit >= 0 ? 'cyan' : 'pink',
                icon: report.netProfit >= 0 ? '✅' : '❌',
              },
            ].map(({ label, value, color, textColor, icon }) => (
              <div className="col-md-4 col-sm-6" key={label}>
                <div className={`card border-${color} shadow-sm h-100`}>
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>{label}</div>
                        <div className={`fs-5 fw-bold text-${textColor}`}>{formatCurrency(value)}</div>
                      </div>
                      <span className="fs-3">{icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title fw-bold text-cyan mb-3">Financial Overview</h6>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="card shadow-sm">
            <div className="card-header fw-bold text-cyan py-3" style={{ borderBottom: '1px solid var(--border-glass)' }}>Detailed Breakdown</div>
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr className="fw-semibold text-emerald" style={{ background: 'rgba(0, 255, 135, 0.03)' }}>
                    <td>Total Revenue</td>
                    <td className="text-end fw-bold">{formatCurrency(report.totalRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">General Expenses</td>
                    <td className="text-end text-pink">- {formatCurrency(report.totalExpenses)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">Fuel Costs</td>
                    <td className="text-end text-pink">- {formatCurrency(report.fuelCost)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">Maintenance Costs</td>
                    <td className="text-end text-pink">- {formatCurrency(report.maintenanceCost)}</td>
                  </tr>
                  <tr className="fw-bold border-top" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    <td>Total Costs</td>
                    <td className="text-end text-pink">- {formatCurrency(report.totalCosts)}</td>
                  </tr>
                  <tr className={`fw-bold fs-5 ${report.netProfit >= 0 ? 'text-cyan' : 'text-pink'}`} style={{ background: report.netProfit >= 0 ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 0, 127, 0.05)' }}>
                    <td>Net Profit / Loss</td>
                    <td className="text-end">{formatCurrency(report.netProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!report && !loading && (
        <div className="text-center text-muted py-5 card">
          <div className="card-body">
            <p className="fs-1">📊</p>
            <p className="fw-semibold">Select a date range and click Generate Report to see your Profit & Loss</p>
          </div>
        </div>
      )}
    </div>
  );
}
