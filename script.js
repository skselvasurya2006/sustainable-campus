// Demo authentication guard. This protects the dashboard flow in this browser only.
const ecoCurrentStudent = JSON.parse(localStorage.getItem('ecoCurrentStudent') || 'null');
if (!ecoCurrentStudent) window.location.replace('auth.html');

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modalBackdrop = $('#modalBackdrop');
const modalFields = $('#modalFields');
const toast = $('#toast');
let toastTimer;
let points = Number(localStorage.getItem('ecoPoints') || 240);
let joinedChallenges = JSON.parse(localStorage.getItem('ecoJoinedChallenges') || '[]');
let reports = JSON.parse(localStorage.getItem('ecoReports') || '[]');
let ideas = JSON.parse(localStorage.getItem('ecoIdeas') || '[]');
let greenEvents = JSON.parse(localStorage.getItem('ecoEvents') || '[]');
let activeFormType = '';

$('#myPointsSide').textContent = points;

if (ecoCurrentStudent && ecoCurrentStudent.name) {
  const firstName = ecoCurrentStudent.name.trim().split(/\\s+/)[0];
  const greeting = document.querySelector('.welcome-row h1');
  if (greeting) greeting.innerHTML = `Good morning, <span>${firstName.replace(/[<>]/g, '')}.</span>`;
  const sideName = document.querySelector('.profile-copy b');
  const sideMeta = document.querySelector('.profile-copy small');
  const avatar = document.querySelector('.profile-button .avatar');
  const topAvatar = document.querySelector('#profileTop');
  if (sideName) sideName.textContent = ecoCurrentStudent.name;
  if (sideMeta) sideMeta.textContent = ecoCurrentStudent.department || 'Student · Green starter';
  if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();
  if (topAvatar) topAvatar.textContent = firstName.charAt(0).toUpperCase();
}
function showToast(title, message) {
  $('#toastTitle').textContent = title;
  $('#toastMessage').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
}
function openModal(type, options = {}) {
  activeFormType = type;
  const config = {
    report: { icon:'＋', eyebrow:'HELP IMPROVE CAMPUS', title:'Report a campus issue', intro:'Tell us what needs attention. Your report helps the campus team take action.', button:'Send report', fields:`
      <div class="form-grid">
        <div class="field"><label for="issueType">Issue category</label><select id="issueType" name="category" required><option value="">Choose category</option><option>Waste management</option><option>Water leakage</option><option>Electricity wastage</option><option>Plastic waste</option><option>Paper wastage</option><option>Other</option></select></div>
        <div class="field"><label for="issueLocation">Campus location</label><input id="issueLocation" name="location" placeholder="e.g. Block A, 2nd floor" required></div>
        <div class="field full"><label for="issueDetails">What did you notice?</label><textarea id="issueDetails" name="details" placeholder="Describe the issue and any useful details..." required></textarea></div>
        <div class="field full"><label for="issuePriority">Urgency</label><select id="issuePriority" name="priority"><option>Normal</option><option>High — needs quick attention</option><option>Low — suggestion / improvement</option></select></div>
      </div>` },
    idea: { icon:'✧', eyebrow:'IDEAS THAT GROW', title:'Share a green idea', intro:'Have an idea that could make campus more sustainable? Put it out there.', button:'Submit idea', fields:`
      <div class="field"><label for="ideaTitle">Idea title</label><input id="ideaTitle" name="title" placeholder="Give your idea a clear name" required></div>
      <div class="field"><label for="ideaCategory">Focus area</label><select id="ideaCategory" name="category" required><option value="">Choose area</option><option>Waste reduction</option><option>Water conservation</option><option>Energy saving</option><option>Paperless campus</option><option>Green events</option><option>Other</option></select></div>
      <div class="field"><label for="ideaDetails">How would it work?</label><textarea id="ideaDetails" name="details" placeholder="Describe your idea in a few sentences..." required></textarea></div>` },
    event: { icon:'▦', eyebrow:'PLAN WITH PURPOSE', title:'Plan a green event', intro:'Build sustainability into your next campus activity from the start.', button:'Create event plan', fields:`
      <div class="field"><label for="eventName">Event name</label><input id="eventName" name="title" placeholder="e.g. Department symposium" required></div>
      <div class="form-grid">
        <div class="field"><label for="eventDate">Event date</label><input id="eventDate" name="date" type="date" required></div>
        <div class="field"><label for="eventAttendees">Expected attendees</label><input id="eventAttendees" name="attendees" type="number" min="1" placeholder="100" required></div>
      </div>
      <div class="field"><label for="eventGoals">Green measures</label><select id="eventGoals" name="goals" required><option value="">Choose a priority</option><option>Paperless registration and certificates</option><option>Reusable or no single-use plastics</option><option>Waste segregation stations</option><option>Refill water stations</option><option>All of the above</option></select></div>
      <div class="field"><label for="eventNotes">Additional notes (optional)</label><textarea id="eventNotes" name="notes" placeholder="Venue, organizer, or other details..."></textarea></div>` },
    guide: { icon:'♧', eyebrow:'WASTE LESS, SORT RIGHT', title:'Find the right bin', intro:'Choose an item below to see the best disposal route. Follow your campus signage if local rules differ.', button:'Got it', fields:`
      <div class="field"><label for="wasteItem">What are you throwing away?</label><select id="wasteItem" name="item" required><option value="">Choose an item</option><option value="paper">Paper / notebook</option><option value="plastic">Clean plastic bottle</option><option value="food">Food scraps</option><option value="wrapper">Multi-layer wrapper</option><option value="battery">Battery / e-waste</option><option value="cup">Disposable cup</option></select></div>
      <div class="field"><div id="wasteAnswer" class="waste-answer">Select an item to see guidance.</div></div>` },
    profile: { icon:'S', eyebrow:'YOUR GREEN JOURNEY', title:'Student profile', intro:'Your local demo profile and sustainability progress.', button:'Done', fields:`
      <div class="profile-summary"><div class="profile-big">S</div><div><b>Campus Changemaker</b><p>Green starter · Level 2</p><strong>${points} points earned</strong></div></div>
      <div class="profile-progress"><div><span>Next level</span><b>${Math.max(0,1000-points)} points to go</b></div><div class="progress-track"><span style="width:${Math.min(100,points/10)}%"></span></div></div>
      <p class="helper-note">Demo note: this profile is stored in this browser only. Connect a backend to support real student accounts.</p>
      <button type="button" class="logout-button" id="logoutButton">Log out of EcoCampus ↗</button>` }
  };
  const c = config[type] || config.report;
  $('#modalIcon').textContent = c.icon;
  $('#modalEyebrow').textContent = c.eyebrow;
  $('#modalTitle').textContent = c.title;
  $('#modalIntro').textContent = c.intro;
  $('#modalSubmit').innerHTML = `${c.button} <span>↗</span>`;
  modalFields.innerHTML = c.fields;
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  if (type === 'event') {
    const date = $('#eventDate');
    date.min = new Date().toISOString().slice(0,10);
  }
  if (type === 'guide') $('#wasteItem').addEventListener('change', updateWasteAnswer);
  if (type === 'profile' || type === 'guide') $('#modalSubmit').innerHTML = `${c.button} <span>↗</span>`;
  $('#modalSubmit').style.display = type === 'guide' || type === 'profile' ? 'inline-flex' : 'inline-flex';
  $('#modalFields').querySelector('input,select,textarea')?.focus({preventScroll:true});
}
function closeModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function updateWasteAnswer() {
  const answers = {
    paper: ['♧ Recycle bin','Keep paper dry and clean. Remove plastic covers or spiral bindings when possible. Use both sides before recycling.'],
    plastic: ['♻️ Plastic recycling','Empty and rinse the bottle, then place it in the designated plastic recycling bin. Keep caps separate if your campus requests it.'],
    food: ['🌱 Organic / compost bin','Food scraps can often be composted. Keep them out of dry-recycling bins and avoid mixing them with plastic packaging.'],
    wrapper: ['↗ Check local collection rules','Multi-layer wrappers are often not accepted in standard recycling. Use a designated collection point if available; otherwise follow campus general-waste guidance.'],
    battery: ['⚠️ E-waste collection','Never place batteries or electronics in regular bins. Hand them to an authorized e-waste collection point or campus facilities team.'],
    cup: ['♻️ Check the cup material','Paper cups may have a plastic lining and may not be recyclable everywhere. Empty the cup and use the campus-labelled bin. Reusable cups are best.']
  };
  const item = $('#wasteItem').value;
  $('#wasteAnswer').innerHTML = item ? `<b>${answers[item][0]}</b><p>${answers[item][1]}</p>` : 'Select an item to see guidance.';
}
$('#modalClose').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

$('#actionForm').addEventListener('submit', e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
  if (activeFormType === 'report') {
    reports.unshift({...formData, id:Date.now(), status:'Submitted', createdAt:new Date().toISOString()});
    localStorage.setItem('ecoReports', JSON.stringify(reports));
    showToast('Report submitted', 'Your campus issue has been recorded in this demo.');
  } else if (activeFormType === 'idea') {
    ideas.unshift({...formData, id:Date.now(), createdAt:new Date().toISOString()});
    localStorage.setItem('ecoIdeas', JSON.stringify(ideas));
    showToast('Idea shared!', 'Thanks for helping campus think greener.');
    points += 20; savePoints();
  } else if (activeFormType === 'event') {
    greenEvents.unshift({...formData, id:Date.now(), createdAt:new Date().toISOString()});
    localStorage.setItem('ecoEvents', JSON.stringify(greenEvents));
    showToast('Green plan created', 'Your event checklist is ready to use.');
    points += 25; savePoints();
  } else if (activeFormType === 'guide') {
    showToast('Keep it green', 'Small sorting decisions make a real difference.');
  } else if (activeFormType === 'profile') {
    showToast('Progress saved', 'Keep building your green streak.');
  }
  closeModal();
  e.currentTarget.reset();
});
function savePoints() {
  localStorage.setItem('ecoPoints', String(points));
  $('#myPointsSide').textContent = points;

if (ecoCurrentStudent && ecoCurrentStudent.name) {
  const firstName = ecoCurrentStudent.name.trim().split(/\\s+/)[0];
  const greeting = document.querySelector('.welcome-row h1');
  if (greeting) greeting.innerHTML = `Good morning, <span>${firstName.replace(/[<>]/g, '')}.</span>`;
  const sideName = document.querySelector('.profile-copy b');
  const sideMeta = document.querySelector('.profile-copy small');
  const avatar = document.querySelector('.profile-button .avatar');
  const topAvatar = document.querySelector('#profileTop');
  if (sideName) sideName.textContent = ecoCurrentStudent.name;
  if (sideMeta) sideMeta.textContent = ecoCurrentStudent.department || 'Student · Green starter';
  if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();
  if (topAvatar) topAvatar.textContent = firstName.charAt(0).toUpperCase();
}
}
$('#quickReport').addEventListener('click', () => openModal('report'));
$('#profileButton').addEventListener('click', () => openModal('profile'));
$('#profileTop').addEventListener('click', () => openModal('profile'));
$('#notificationButton').addEventListener('click', () => showToast('You’re all caught up', 'No new campus notifications in this demo.'));
$$('.quick-action').forEach(btn => btn.addEventListener('click', () => {
  const target = btn.dataset.target;
  if (target === 'report') openModal('report');
  if (target === 'guide') openModal('guide');
  if (target === 'events') openModal('event');
  if (target === 'ideas') openModal('idea');
}));
$$('.join-button').forEach(btn => {
  const name = btn.dataset.challenge;
  if (joinedChallenges.includes(name)) { btn.classList.add('joined'); btn.innerHTML = 'Joined ✓'; }
  btn.addEventListener('click', () => {
    if (joinedChallenges.includes(name)) {
      showToast('Challenge joined', 'You’re already on this green mission.');
      return;
    }
    joinedChallenges.push(name);
    localStorage.setItem('ecoJoinedChallenges', JSON.stringify(joinedChallenges));
    btn.classList.add('joined'); btn.innerHTML = 'Joined ✓';
    points += name.includes('Sort') ? 100 : name.includes('Switch') ? 75 : 50;
    savePoints();
    showToast('Challenge accepted!', `You earned points for joining “${name}”.`);
  });
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  $$('.nav-link').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
  $('#currentPage').textContent = link.textContent.trim().replace(/\s+\d+$/, '');
  $('#sidebar').classList.remove('open');
  if (link.dataset.section === 'report') { openModal('report'); }
  if (link.dataset.section === 'guide') { openModal('guide'); }
  if (link.dataset.section === 'ideas') { openModal('idea'); }
  if (link.dataset.section === 'events') { openModal('event'); }
}));
$$('[data-target]').forEach(btn => btn.addEventListener('click', () => {
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.section === btn.dataset.target));
}));
$('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('click', e => {
  if (window.innerWidth <= 760 && $('#sidebar').classList.contains('open') && !$('#sidebar').contains(e.target) && !$('#mobileMenu').contains(e.target)) $('#sidebar').classList.remove('open');
});

const boardData = {
  students: [
    ['A','Arun Kumar','12 actions completed','840','av-green'],
    ['P','Priya S.','10 actions completed','760','av-purple'],
    ['K','Karthik R.','8 actions completed','690','av-orange'],
    ['M','Meena V.','7 actions completed','580','av-blue']
  ],
  departments: [
    ['I','Information Technology','42 green actions','2,840','av-green'],
    ['C','Computer Science','38 green actions','2,510','av-purple'],
    ['E','Electrical Engineering','31 green actions','2,140','av-orange'],
    ['M','Mechanical Engineering','26 green actions','1,920','av-blue']
  ]
};
$$('.leader-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.leader-tab').forEach(t => t.classList.toggle('active', t === tab));
  const data = boardData[tab.dataset.board];
  $('#leaderboardList').innerHTML = data.map((r,i) => `<div class="leader-row"><span class="rank ${i===0?'rank-gold':i===1?'rank-silver':i===2?'rank-bronze':''}">${i+1}</span><span class="leader-avatar ${r[4]}">${r[0]}</span><span class="leader-info"><b>${r[1]}</b><small>${r[2]}</small></span><b class="leader-points">${r[3]} <small>pts</small></b></div>`).join('');
}));
$('#leaderboardMore').addEventListener('click', () => showToast('Leaderboard preview', 'Connect a shared database to show live campus rankings.'));
$('#chartPeriod').addEventListener('change', e => {
  const month = e.target.value === 'month';
  const data = month
    ? {w:'M0 95 L85 82 L170 72 L255 78 L340 54 L425 48 L510 35 L600 28', en:'M0 130 L85 118 L170 120 L255 102 L340 98 L425 89 L510 80 L600 70', wa:'M0 155 L85 148 L170 135 L255 140 L340 120 L425 125 L510 108 L600 98'}
    : {w:'M0 75 L85 88 L170 64 L255 90 L340 54 L425 65 L510 40 L600 50', en:'M0 112 L85 100 L170 125 L255 95 L340 110 L425 83 L510 98 L600 75', wa:'M0 145 L85 132 L170 145 L255 126 L340 139 L425 118 L510 125 L600 112'};
  $('#waterPath').setAttribute('d',data.w); $('#waterArea').setAttribute('d',data.w+' L600 190 L0 190Z');
  $('#energyPath').setAttribute('d',data.en); $('#wastePath').setAttribute('d',data.wa);
  showToast(month?'Monthly view':'Weekly view', 'The resource chart has been updated.');
});
$('#leaderboardMore').setAttribute('aria-label','View full leaderboard');

document.addEventListener('click', e => {
  if (e.target && e.target.id === 'logoutButton') {
    localStorage.removeItem('ecoCurrentStudent');
    window.location.href = 'auth.html';
  }
});
