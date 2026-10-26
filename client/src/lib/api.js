import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

export function getApiError(error, fallback = 'Something went sideways. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback;
}

export function getFieldErrors(error) {
  const details = error?.response?.data?.details;
  if (!Array.isArray(details)) return {};
  return details.reduce((accumulator, detail) => {
    if (detail?.field) accumulator[detail.field] = detail.message;
    return accumulator;
  }, {});
}

export default api;
