// Handles paginated Spring Boot responses AND plain arrays
export const toArray = (data) =>
  Array.isArray(data) ? data : (data?.content || data?.data || []);

// Format currency in INR
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Get today's date as YYYY-MM-DD (for date inputs)
export const today = () => new Date().toISOString().split('T')[0];

// Get first day of current month as YYYY-MM-DD
export const firstDayOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
};

// Badge color by status
export const statusBadge = (status) => {
  const map = {
    ACTIVE: 'success',
    COMPLETED: 'success',
    PENDING: 'warning',
    CANCELLED: 'danger',
    MAINTENANCE: 'warning',
    INACTIVE: 'secondary',
  };
  return map[status] || 'secondary';
};

// Expense / log category options
export const EXPENSE_CATEGORIES = [
  'FUEL', 'MAINTENANCE', 'SALARY', 'RENT', 'UTILITIES', 'TRANSPORT', 'OTHER',
];

export const VEHICLE_LOG_TYPES = [
  'FUEL', 'MAINTENANCE', 'INSURANCE', 'TAX', 'OTHER',
];

export const VEHICLE_TYPES = ['TRUCK', 'VAN', 'CAR', 'BIKE', 'OTHER'];

export const VEHICLE_STATUSES = ['ACTIVE', 'MAINTENANCE', 'INACTIVE'];

export const SALE_STATUSES = ['COMPLETED', 'PENDING', 'CANCELLED'];

export const UNITS = ['KG', 'TON', 'PIECE', 'BOX', 'LITRE', 'METRE'];
