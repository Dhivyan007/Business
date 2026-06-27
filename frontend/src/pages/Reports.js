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
        '#198754', '#dc3545', '#ffc107',
        report.netProfit >= 0 ? '#0d6efd' : '#dc3545',
      ],
    }],
  } : null;

  return (
    <div>
      <h4 className="fw-bold mb-4">📊 Profit & Loss Report</h4>

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
              { label: 'Total Revenue', value: report.totalRevenue, color: 'success', icon: '📈' },
              { label: 'General Expenses', value: report.totalExpenses, color: 'danger', icon: '💸' },
              { label: 'Fuel Cost', value: report.fuelCost, color: 'warning', icon: '⛽' },
              { label: 'Maintenance Cost', value: report.maintenanceCost, color: 'warning', icon: '🔧' },
              { label: 'Total Costs', value: report.totalCosts, color: 'danger', icon: '📉' },
              {
                label: 'Net Profit',
                value: report.netProfit,
                color: report.netProfit >= 0 ? 'primary' : 'danger',
                icon: report.netProfit >= 0 ? '✅' : '❌',
              },
            ].map(({ label, value, color, icon }) => (
              <div className="col-md-4 col-sm-6" key={label}>
                <div className={`card border-${color} shadow-sm`}>
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">{label}</div>
                        <div className={`fs-5 fw-bold text-${color}`}>{formatCurrency(value)}</div>
                      </div>
                      <span className="fs-3">{icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Financial Overview</h6>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="card shadow-sm mt-4">
            <div className="card-header fw-semibold">Detailed Breakdown</div>
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr className="table-success">
                    <td>Total Revenue</td>
                    <td className="text-end fw-bold">{formatCurrency(report.totalRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">General Expenses</td>
                    <td className="text-end text-danger">- {formatCurrency(report.totalExpenses)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">Fuel Costs</td>
                    <td className="text-end text-danger">- {formatCurrency(report.fuelCost)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4 text-muted">Maintenance Costs</td>
                    <td className="text-end text-danger">- {formatCurrency(report.maintenanceCost)}</td>
                  </tr>
                  <tr className="table-light fw-bold border-top">
                    <td>Total Costs</td>
                    <td className="text-end text-danger">- {formatCurrency(report.totalCosts)}</td>
                  </tr>
                  <tr className={`fw-bold fs-5 ${report.netProfit >= 0 ? 'table-primary' : 'table-danger'}`}>
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
        <div className="text-center text-muted py-5">
          <p className="fs-1">📊</p>
          <p>Select a date range and click Generate Report to see your Profit & Loss</p>
        </div>
      )}
    </div>
  );
}
