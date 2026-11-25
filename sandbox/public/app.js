// Shared helpers for the TallyPay web pages.
const TP = {
  token: () => sessionStorage.getItem('tp_token'),
  me: () => JSON.parse(sessionStorage.getItem('tp_me') || 'null'),
  async api(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...(TP.token() ? { Authorization: 'Bearer ' + TP.token() } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch { /* 204 or empty */ }
    return { status: res.status, data };
  },
  requireLogin() { if (!TP.token()) { location.href = '/'; return false; } return true; },
  header() {
    const me = TP.me();
    const roleLabel = me.role === 'payroll_admin' ? 'Payroll Admin' : 'Payroll Viewer';
    document.getElementById('who').textContent = `Signed in as ${me.username} (${roleLabel})`;
    document.getElementById('signout').addEventListener('click', () => { sessionStorage.clear(); location.href = '/'; });
  },
  money: (n) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};
