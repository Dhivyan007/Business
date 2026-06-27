import apiClient from './client';

// ─── EXPENSES ───────────────────────────────────────────────
export const getExpenses = (page = 0, size = 20) =>
  apiClient.get(`/expenses?page=${page}&size=${size}`);

export const getExpensesByDate = (start, end) =>
  apiClient.get(`/expenses/by-date?start=${start}&end=${end}`);

export const getExpenseSummaryByCategory = () =>
  apiClient.get('/expenses/summary/by-category');

export const createExpense = (data) => apiClient.post('/expenses', data);
export const updateExpense = (id, data) => apiClient.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => apiClient.delete(`/expenses/${id}`);

// ─── PRODUCTS ───────────────────────────────────────────────
export const getProducts = (page = 0, size = 20) =>
  apiClient.get(`/products?page=${page}&size=${size}`);

export const searchProducts = (name) =>
  apiClient.get(`/products/search?name=${name}`);

export const getLowStockProducts = (threshold = 10) =>
  apiClient.get(`/products/low-stock?threshold=${threshold}`);

export const createProduct = (data) => apiClient.post('/products', data);
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// ─── SALES ──────────────────────────────────────────────────
export const getSales = (page = 0, size = 20) =>
  apiClient.get(`/sales?page=${page}&size=${size}`);

export const getSalesByDate = (start, end) =>
  apiClient.get(`/sales/by-date?start=${start}&end=${end}`);

export const getRevenueByProduct = () =>
  apiClient.get('/sales/summary/by-product');

export const getMonthlyRevenue = (year) =>
  apiClient.get(`/sales/summary/monthly?year=${year}`);

export const createSale = (data) => apiClient.post('/sales', data);
export const updateSale = (id, data) => apiClient.put(`/sales/${id}`, data);
export const deleteSale = (id) => apiClient.delete(`/sales/${id}`);

// ─── VEHICLES ───────────────────────────────────────────────
export const getVehicles = (page = 0, size = 20) =>
  apiClient.get(`/vehicles?page=${page}&size=${size}`);

export const getActiveVehicles = () => apiClient.get('/vehicles/active');

export const createVehicle = (data) => apiClient.post('/vehicles', data);
export const updateVehicle = (id, data) => apiClient.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => apiClient.delete(`/vehicles/${id}`);

// ─── VEHICLE LOGS ────────────────────────────────────────────
export const getVehicleLogs = (page = 0, size = 20) =>
  apiClient.get(`/vehicle-logs?page=${page}&size=${size}`);

export const getLogsByVehicle = (vehicleId) =>
  apiClient.get(`/vehicle-logs/by-vehicle/${vehicleId}`);

export const createVehicleLog = (data) => apiClient.post('/vehicle-logs', data);
export const updateVehicleLog = (id, data) => apiClient.put(`/vehicle-logs/${id}`, data);
export const deleteVehicleLog = (id) => apiClient.delete(`/vehicle-logs/${id}`);

// ─── REPORTS ─────────────────────────────────────────────────
export const getProfitLoss = (start, end) =>
  apiClient.get(`/reports/profit-loss?start=${start}&end=${end}`);

export const getDashboard = () => apiClient.get('/reports/dashboard');
