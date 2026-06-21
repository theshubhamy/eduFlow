import api from '@/lib/api';

// Fees
export const getFees = async (params?: unknown) => {
  const { data } = await api.get('/api/fees', { params });
  return data;
};

export const createFeeCategory = async (categoryData: unknown) => {
  const { data } = await api.post('/api/fees/category', categoryData);
  return data;
};

export const allocateFee = async (allocationData: unknown) => {
  const { data } = await api.post('/api/fees/allocate', allocationData);
  return data;
};

// Payments
export const getPayments = async (params?: unknown) => {
  const { data } = await api.get('/api/payments', { params });
  return data;
};

export const collectPayment = async (paymentData: unknown) => {
  const { data } = await api.post('/api/payments/collect', paymentData);
  return data;
};

export const downloadReceipt = async (id: string) => {
  const response = await api.get(`/api/payments/${id}/receipt`, {
    responseType: 'blob',
  });
  return response.data;
};

// Finance
export const exportFinance = async () => {
  const response = await api.get('/api/finance/export', {
    responseType: 'blob',
  });
  return response.data;
};
