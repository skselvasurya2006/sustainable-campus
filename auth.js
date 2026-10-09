const $ = s => document.querySelector(s);
const loginTab = $('#loginTab');
const registerTab = $('#registerTab');
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
const alertBox = $('#authAlert');

function getAccounts() {
  try { return JSON.parse(localStorage.getItem('ecoStudentAccounts') || '[]'); }
  catch { return []; }
}
function setAlert(message, success = false) {
  alertBox.textContent = message;
  alertBox.className = `auth-alert show${success ? ' success' : ''}`;
}
function clearAlert() { alertBox.textContent = ''; alertBox.className = 'auth-alert'; }
function switchMode(mode) {
  const isLogin = mode === 'login';
  loginForm.classList.toggle('hidden', !isLogin);
  registerForm.classList.toggle('hidden', isLogin);
  loginTab.classList.toggle('active', isLogin);
  registerTab.classList.toggle('active', !isLogin);
  loginTab.setAttribute('aria-selected', String(isLogin));
  registerTab.setAttribute('aria-selected', String(!isLogin));
  $('#authTitle').textContent = isLogin ? 'Welcome back.' : 'Join the movement.';
  $('#authSubtitle').textContent = isLogin ? 'Sign in to continue your green journey.' : 'Create your student account and start making an impact.';
  clearAlert();
}
loginTab.addEventListener('click', () => switchMode('login'));
registerTab.addEventListener('click', () => switchMode('register'));
document.querySelectorAll('[data-switch]').forEach(b => b.addEventListener('click', () => switchMode(b.dataset.switch)));

if (localStorage.getItem('ecoCurrentStudent')) {
  // Keep the sign-in page accessible, but offer a convenient route back to the dashboard.
  setAlert('You are already signed in on this browser. Log in again or create a different demo account.', true);
}

$('#showLoginPassword').addEventListener('click', () => {
  const input = $('#loginPassword');
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  $('#showLoginPassword').textContent = showing ? 'Show' : 'Hide';
});

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  clearAlert();
  const data = Object.fromEntries(new FormData(registerForm).entries());
  const name = (data.name || '').trim();
  const email = (data.email || '').trim().toLowerCase();
  const studentId = (data.studentId || '').trim();
  if ((data.password || '').length < 8) return setAlert('Please use a password with at least 8 characters.');
  if (data.password !== data.confirm) return setAlert('The passwords do not match. Please check them and try again.');
  if (!$('#agreeTerms').checked) return setAlert('Please agree to the student community guidelines to continue.');
  const accounts = getAccounts();
  if (accounts.some(a => a.email === email)) return setAlert('An account with this email already exists. Please log in instead.');
  if (accounts.some(a => a.studentId.toLowerCase() === studentId.toLowerCase())) return setAlert('This register number is already registered in this browser demo.');
  const student = { name, email, department: data.department, studentId, password: data.password, createdAt: new Date().toISOString() };
  accounts.push(student);
  localStorage.setItem('ecoStudentAccounts', JSON.stringify(accounts));
  localStorage.setItem('ecoCurrentStudent', JSON.stringify({ name, email, department: data.department, studentId }));
  setAlert('Account created! Opening your sustainability dashboard…', true);
  setTimeout(() => window.location.href = 'index.html', 650);
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  clearAlert();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  const student = getAccounts().find(a => a.email === email && a.password === password);
  if (!student) return setAlert('We could not find a matching account. Check your details or create an account first.');
  localStorage.setItem('ecoCurrentStudent', JSON.stringify({ name: student.name, email: student.email, department: student.department, studentId: student.studentId }));
  setAlert('Login successful! Opening your dashboard…', true);
  setTimeout(() => window.location.href = 'index.html', 450);
});
