// TallyPay Overtime — training sandbox (FS Learning, Antonio Padillo Esparis Jr, training-plan-1)
// Zero dependencies. Run:  node server.js   (default port 4020; override with PORT=xxxx)
// Open http://localhost:4020 in a browser for the web app. The API lives under /api.
// Data is in memory. Restarting the server, or POST /api/test/reset, restores the seed data.
// This is a TRAINING TARGET. It contains deliberate defects for you to find with tests.
// Treat sandbox/README.md as the specification. Where the app and the README disagree, the README is right.

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4020);
const VERSION = '1.0.0';
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf8'));

// "Today" is the real date in Asia/Manila unless TODAY=YYYY-MM-DD is set (useful for repeatable tests).
function manilaToday() {
  if (process.env.TODAY) return process.env.TODAY;
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}
function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) { // b - a, in days
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

const MULTIPLIER = { Regular: 1.25, RestDay: 1.30, Holiday: 2.00 };
const users = seed.users;
const sessions = new Map(); // token -> username
let employees, claims, nextClaimNo;

function reset() {
  const today = manilaToday();
  employees = JSON.parse(JSON.stringify(seed.employees)).map((e) => {
    if (e.hireDaysAgo !== undefined) { e.hireDate = addDays(today, -e.hireDaysAgo); delete e.hireDaysAgo; }
    return e;
  });
  claims = seed.claims.map((c) => {
    const emp = employees.find((e) => e.id === c.employeeId);
    const date = addDays(today, -c.daysAgo);
    return {
      id: c.id, companyId: emp.companyId, employeeId: c.employeeId, employeeName: emp.name,
      date, hours: c.hours, type: c.type, amount: computeAmount(emp, c.hours, c.type),
      status: c.status, note: c.note || '', createdBy: c.createdBy, approvedBy: c.approvedBy || null,
      rejectedBy: c.rejectedBy || null, rejectReason: c.rejectReason || null, createdAt: date + 'T18:00:00+08:00'
    };
  });
  nextClaimNo = 5001 + claims.length;
}

function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function computeAmount(emp, hours, type) {
  const m = type === 'RestDay' ? MULTIPLIER.Regular : MULTIPLIER[type];
  if (m === undefined) throw new Error('multiplier lookup failed for type ' + type);
  return round2(emp.hourlyRate * hours * m);
}

function send(res, status, body) {
  if (status === 204) { res.writeHead(204); return res.end(); }
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve({ __invalidJson: true }); }
    });
  });
}

function auth(req, res) {
  const h = req.headers['authorization'] || '';
  if (!h) { send(res, 401, { error: 'Missing token' }); return null; }
  const token = h.replace(/^Bearer\s+/i, '').trim();
  const username = sessions.get(token);
  const user = users.find((u) => u.username === username);
  return { username: user.username, role: user.role, companyId: user.companyId, displayName: user.displayName };
}
const isAdmin = (u) => u.role === 'payroll_admin';
const publicClaim = (c) => ({ ...c });

function monthHours(employeeId, month, statuses) {
  return claims.filter((c) => c.employeeId === employeeId && c.date.slice(0, 7) === month && statuses.includes(c.status))
    .reduce((s, c) => s + c.hours, 0);
}

// ---- static web app ----
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const extraStatic = []; // modules may add folders

function serveStatic(url, res) {
  let p = url.pathname === '/' ? '/index.html' : url.pathname;
  for (const dir of [PUBLIC, ...extraStatic]) {
    const file = path.join(dir, path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
    if (file.startsWith(dir) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      return res.end(fs.readFileSync(file));
    }
  }
  return false;
}

// ---- optional modules (modules/*.js) ----
const extraRoutes = [];
const ctx = {
  addRoute: (method, pattern, handler) => extraRoutes.push({ method, pattern, handler }),
  addStatic: (dir) => extraStatic.push(dir),
  send, readBody, auth, isAdmin, addDays, daysBetween, manilaToday, round2,
  getEmployees: () => employees, users, onReset: [],
};
const modDir = path.join(__dirname, 'modules');
if (fs.existsSync(modDir)) {
  for (const f of fs.readdirSync(modDir).filter((x) => x.endsWith('.js'))) {
    require(path.join(modDir, f)).register(ctx);
    console.log('Loaded module', f);
  }
}

reset();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const started = Date.now();
  res.on('finish', () => { if (parts[0] === 'api') console.log(`${req.method} ${url.pathname} -> ${res.statusCode} (${Date.now() - started} ms)`); });

  try {
    if (parts[0] !== 'api') {
      if (req.method === 'GET' && serveStatic(url, res) !== false) return;
      return send(res, 404, { error: 'Not found' });
    }

    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, version: VERSION, today: manilaToday() });

    if (req.method === 'POST' && url.pathname === '/api/test/reset') { reset(); ctx.onReset.forEach((f) => f()); return send(res, 204); }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const body = await readBody(req);
      const u = users.find((x) => x.username === body.username && x.password === body.password);
      if (!u) return send(res, 401, { error: 'Invalid username or password' });
      const token = crypto.randomBytes(16).toString('hex');
      sessions.set(token, u.username);
      return send(res, 200, { token, username: u.username, role: u.role, companyId: u.companyId, displayName: u.displayName });
    }

    for (const r of extraRoutes) {
      const m = r.method === req.method && url.pathname.match(r.pattern);
      if (m) return await r.handler(req, res, m, url);
    }

    const user = auth(req, res);
    if (!user) return;

    if (req.method === 'GET' && url.pathname === '/api/me') return send(res, 200, user);

    // ---- employees ----
    if (req.method === 'GET' && url.pathname === '/api/employees') {
      return send(res, 200, employees.filter((e) => e.companyId === user.companyId));
    }
    if (req.method === 'GET' && parts[1] === 'employees' && parts.length === 3) {
      const e = employees.find((x) => x.id === parts[2] && x.companyId === user.companyId);
      if (!e) return send(res, 404, { error: 'Employee not found' });
      return send(res, 200, e);
    }

    // ---- monthly summary ----
    if (req.method === 'GET' && url.pathname === '/api/monthly-summary') {
      const month = url.searchParams.get('month') || manilaToday().slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(month)) return send(res, 400, { error: 'month must be YYYY-MM' });
      const rows = employees.filter((e) => e.companyId === user.companyId).map((e) => {
        const cs = claims.filter((c) => c.employeeId === e.id && c.date.slice(0, 7) === month && c.status === 'Approved');
        return { employeeId: e.id, name: e.name, hours: cs.reduce((s, c) => s + c.hours, 0), amount: round2(cs.reduce((s, c) => s + c.amount, 0)) };
      });
      return send(res, 200, { month, rows });
    }

    // ---- overtime claims ----
    if (parts[1] === 'overtime-claims') {
      if (req.method === 'GET' && parts.length === 2) {
        let list = claims.filter((c) => c.companyId === user.companyId);
        const st = url.searchParams.get('status');
        const emp = url.searchParams.get('employeeId');
        if (st) list = list.filter((c) => c.status === st);
        if (emp) list = list.filter((c) => c.employeeId === emp);
        return send(res, 200, list.map(publicClaim));
      }

      if (req.method === 'GET' && parts.length === 3) {
        const c = claims.find((x) => x.id === parts[2]);
        if (!c) return send(res, 404, { error: 'Claim not found' });
        return send(res, 200, publicClaim(c));
      }

      if (req.method === 'POST' && parts.length === 2) {
        if (!isAdmin(user)) return send(res, 403, { error: 'Only a Payroll Admin can create claims' });
        const b = await readBody(req);
        if (b.__invalidJson) return send(res, 400, { error: 'Body must be valid JSON' });
        const emp = employees.find((e) => e.id === b.employeeId && e.companyId === user.companyId);
        if (!b.employeeId) return send(res, 400, { error: 'employeeId is required' });
        if (!emp) return send(res, 404, { error: 'Employee not found' });
        if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date) || isNaN(Date.parse(b.date + 'T00:00:00Z'))) return send(res, 400, { error: 'date must be YYYY-MM-DD' });
        const today = manilaToday();
        const age = daysBetween(b.date, today);
        if (age < 0) return send(res, 400, { error: 'date cannot be in the future' });
        if (age > 30) return send(res, 400, { error: 'date is more than 30 days ago' });
        if (b.date < emp.hireDate) return send(res, 400, { error: 'date is before the employee hire date' });
        if (typeof b.hours !== 'number' || !(b.hours > 0 && b.hours <= 12.5) || (b.hours * 2) % 1 !== 0) return send(res, 400, { error: 'hours must be 0.5 to 12 in steps of 0.5' });
        if (b.type === undefined || b.type === null || b.type === '') return send(res, 400, { error: 'type is required' });
        if (emp.status !== 'Active') return send(res, 422, { error: 'Employee is not Active' });
        const month = b.date.slice(0, 7);
        const used = monthHours(emp.id, month, ['Approved', 'Paid']);
        if (used + b.hours > 40) return send(res, 422, { error: `Monthly overtime cap of 40 hours exceeded (${used} already used in ${month})` });
        const claim = {
          id: 'OT-' + nextClaimNo++, companyId: emp.companyId, employeeId: emp.id, employeeName: emp.name,
          date: b.date, hours: b.hours, type: b.type, amount: computeAmount(emp, b.hours, b.type),
          status: 'Submitted', note: typeof b.note === 'string' ? b.note.slice(0, 200) : '',
          createdBy: user.username, approvedBy: null, rejectedBy: null, rejectReason: null, createdAt: new Date().toISOString()
        };
        claims.push(claim);
        return send(res, 201, publicClaim(claim));
      }

      if (req.method === 'POST' && parts.length === 4) {
        const c = claims.find((x) => x.id === parts[2] && x.companyId === user.companyId);
        if (!c) return send(res, 404, { error: 'Claim not found' });
        const action = parts[3];

        if (action === 'approve') {
          if (c.status !== 'Submitted') return send(res, 409, { error: `Cannot approve a ${c.status} claim` });
          c.status = 'Approved'; c.approvedBy = user.username;
          return send(res, 200, publicClaim(c));
        }
        if (action === 'reject') {
          if (!isAdmin(user)) return send(res, 403, { error: 'Only a Payroll Admin can reject claims' });
          if (c.createdBy === user.username) return send(res, 403, { error: 'You cannot reject a claim you created' });
          const b = await readBody(req);
          if (!b.reason || typeof b.reason !== 'string' || !b.reason.trim()) return send(res, 400, { error: 'reason is required' });
          if (c.status !== 'Submitted') return send(res, 409, { error: `Cannot reject a ${c.status} claim` });
          c.status = 'Rejected'; c.rejectedBy = user.username; c.rejectReason = b.reason.trim().slice(0, 200);
          return send(res, 200, publicClaim(c));
        }
        if (action === 'pay') {
          if (!isAdmin(user)) return send(res, 403, { error: 'Only a Payroll Admin can mark claims paid' });
          if (c.status !== 'Approved') return send(res, 409, { error: `Cannot pay a ${c.status} claim` });
          c.status = 'Paid';
          return send(res, 200, publicClaim(c));
        }
        return send(res, 404, { error: 'Unknown action' });
      }
    }

    return send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('500:', err.message);
    return send(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => console.log(`TallyPay Overtime sandbox v${VERSION} on http://localhost:${PORT}  (today = ${manilaToday()})`));
