// lib/api.ts

export async function fetchTransactions() {
  try {
    const res = await fetch('/api/transactions');
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return await res.json();
  } catch (err) {
    console.error('fetchTransactions error:', err);
    return []; // fallback
  }
}

export async function fetchBudgets() {
  try {
    const res = await fetch('/api/budgets');
    const contentType = res.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Expected JSON but got:', contentType, '| Raw response:', text);
      return [];
    }

    const data = await res.json();
    console.log('Fetched budgets:', data); 
    return data;
  } catch (err) {
    console.error('fetchBudgets error:', err);
    return [];
  }
}

